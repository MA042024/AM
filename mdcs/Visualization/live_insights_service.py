"""Aggregation service backing the Live Insights tab of the Visualization page.

Scope resolution:
  - scope="workspace" accepts one or more workspace ids and unions their
    records (deduped by id), enforcing the normal per-user read access on
    EACH one individually (same check used by the Shared Workspace page).
  - scope="all" deliberately bypasses per-record visibility to compute
    sitewide aggregates (counts, distributions, averages) across every
    curated record, including ones the current user could not normally
    open. Only aggregated numbers are ever returned to the client -
    individual record content is never exposed through this scope. See
    docs/Visualization/live-insights.md for the access-control rationale.

Every numeric summary reports its sample size (n) alongside the statistic,
and uses a mean + 95% interval (2.5th-97.5th percentile of the underlying
values) plus an optional histogram - see docs/Visualization/live-insights.md.
"""
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict, namedtuple

from core_main_app.components.data.models import Data
from core_main_app.components.data import api as data_api
from core_main_app.components.workspace import api as workspace_api
from core_main_app.settings import DATA_SORTING_FIELDS

from ..downloadexcel_codes import extract_paths_and_values
from . import live_insights_fields as fields


class LiveInsightsError(Exception):
    """Raised for invalid scope/test parameters or access-control failures."""


# A record parsed once: its XML root, resolved test key, the flattened
# path -> value dict (for scalar fields), and pre-walked sieve points (which
# extract_paths_and_values can't represent, see _collect_sieve_points).
# sieve_points is {source_key: {size: value}} for each of fields.SIEVE_SOURCES.
ParsedRecord = namedtuple("ParsedRecord", ["root", "test_key", "values", "sieve_points"])


def get_accessible_workspaces(user):
    """Workspaces the user can read or write, same merge logic as the Shared
    Workspace page's DashboardWorkspaces view."""
    read_ws = list(workspace_api.get_all_workspaces_with_read_access_by_user(user))
    write_ws = list(workspace_api.get_all_workspaces_with_write_access_by_user(user))
    merged = read_ws + [ws for ws in write_ws if ws not in read_ws]
    return [{"id": ws.id, "title": ws.title, "is_public": ws.is_public} for ws in merged]


def _resolve_records(scope, workspace_ids, user):
    if scope == "workspace":
        workspace_ids = [w for w in (workspace_ids or []) if w]
        if not workspace_ids:
            raise LiveInsightsError("At least one workspace is required for scope='workspace'.")
        records = []
        seen_ids = set()
        for workspace_id in workspace_ids:
            workspace = workspace_api.get_by_id(workspace_id)
            if not workspace_api.can_user_read_workspace(workspace, user):
                raise LiveInsightsError(f"You do not have read access to workspace {workspace_id}.")
            # NOTE: intentionally NOT passing order_by_field here. In some
            # deployed core_main_app versions, @access_control forwards every
            # kwarg straight to the permission check function
            # (can_read_or_write_in_workspace), which doesn't accept
            # order_by_field and raises a TypeError. Ordering isn't needed
            # for aggregation, so we just omit it.
            for record in data_api.get_all_by_workspace(workspace, user):
                if record.id not in seen_ids:
                    seen_ids.add(record.id)
                    records.append(record)
        return records
    if scope == "all":
        return Data.get_all(DATA_SORTING_FIELDS)
    raise LiveInsightsError("scope must be 'all' or 'workspace'.")


def _to_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _collect_sieve_points(root, path):
    """Sieve points aren't indexed by extract_paths_and_values (repeated,
    non-indexed <Point> tags collide onto one dict key), so walk them
    directly instead."""
    points = {}
    for point in root.findall(f".//{path}"):
        size_el = point.find(fields.SIEVE_POINT_SIZE_TAG)
        value_el = point.find(fields.SIEVE_POINT_VALUE_TAG)
        size = _to_float(size_el.text if size_el is not None else None)
        value = _to_float(value_el.text if value_el is not None else None)
        if size is not None and value is not None:
            points[size] = value
    return points


def _collect_stiffness_moduli(root):
    """Same collision issue as sieve points, for repeated <Case> entries."""
    moduli = []
    for case in root.findall(f".//{fields.STIFFNESS_CASE_PATH}"):
        modulus_el = case.find(fields.STIFFNESS_MODULUS_TAG)
        value = _to_float(modulus_el.text if modulus_el is not None else None)
        if value is not None:
            moduli.append(value)
    return moduli


def _iter_parsed_records(records):
    """Parse each record's XML exactly once, yielding a ParsedRecord.
    Records with missing/unparsable content are skipped."""
    for record in records:
        content = record.content
        if not content:
            continue
        try:
            root = ET.fromstring(content)
        except ET.ParseError:
            continue
        yield ParsedRecord(
            root=root,
            test_key=fields.TEST_ROOT_TAGS.get(root.tag),
            values=extract_paths_and_values(root),
            sieve_points={
                source_key: _collect_sieve_points(root, path)
                for source_key, (path, _label) in fields.SIEVE_SOURCES.items()
            },
        )


def _percentile(sorted_values, pct):
    """Linear-interpolated percentile (pct in [0, 1]) of an already-sorted list."""
    n = len(sorted_values)
    if n == 0:
        return None
    if n == 1:
        return sorted_values[0]
    k = (n - 1) * pct
    lo_idx, hi_idx = int(k), min(int(k) + 1, n - 1)
    if lo_idx == hi_idx:
        return sorted_values[lo_idx]
    fraction = k - lo_idx
    return sorted_values[lo_idx] + (sorted_values[hi_idx] - sorted_values[lo_idx]) * fraction


def _histogram(sorted_values, bin_count=10):
    n = len(sorted_values)
    if n == 0:
        return {"labels": [], "counts": []}
    lo, hi = sorted_values[0], sorted_values[-1]
    if lo == hi:
        return {"labels": [f"{lo:.2f}"], "counts": [n]}
    width = (hi - lo) / bin_count
    counts = [0] * bin_count
    for value in sorted_values:
        idx = min(int((value - lo) / width), bin_count - 1)
        counts[idx] += 1
    labels = [f"{lo + i * width:.2f}–{lo + (i + 1) * width:.2f}" for i in range(bin_count)]
    return {"labels": labels, "counts": counts}


def _numeric_summary(values, label):
    """n, mean, the 95% interval (2.5th-97.5th percentile), and a histogram."""
    clean = sorted(v for v in values if v is not None)
    n = len(clean)
    if n == 0:
        return {"kind": "numeric", "label": label, "n": 0, "mean": None, "low": None, "high": None, "histogram": {"labels": [], "counts": []}}
    mean = sum(clean) / n
    return {
        "kind": "numeric",
        "label": label,
        "n": n,
        "mean": round(mean, 3),
        "low": round(_percentile(clean, 0.025), 3),
        "high": round(_percentile(clean, 0.975), 3),
        "histogram": _histogram(clean),
    }


def _categorical_summary(values, label, top_n=None):
    clean = [v for v in values if v]
    counts = Counter(clean)
    ordered = sorted(counts.items(), key=lambda item: item[1], reverse=True)
    if top_n:
        ordered = ordered[:top_n]
    return {
        "kind": "categorical",
        "label": label,
        "n": len(clean),
        "categories": [{"value": value, "count": count} for value, count in ordered],
    }


def _year_trend(parsed_records):
    path = fields.YEAR_FIELD[0]
    years = []
    for parsed in parsed_records:
        raw = parsed.values.get(path)
        if raw:
            year = "".join(ch for ch in str(raw) if ch.isdigit())[:4]
            if year:
                years.append(year)
    counts = Counter(years)
    return {
        "kind": "trend",
        "label": fields.YEAR_FIELD[1],
        "n": len(years),
        "points": [{"year": year, "count": counts[year]} for year in sorted(counts)],
    }


def _sieve_band(size_to_values, label):
    band = []
    for size in sorted(size_to_values):
        summary = _numeric_summary(size_to_values[size], None)
        band.append({"size": size, "n": summary["n"], "mean": summary["mean"], "low": summary["low"], "high": summary["high"]})
    return {"label": label, "points": band}


def _mixture_overview(parsed_records):
    numeric_values = {key: [] for key in fields.MIXTURE_NUMERIC_FIELDS}
    categorical_values = {key: [] for key in fields.MIXTURE_CATEGORICAL_FIELDS}
    top_n_values = {key: [] for key in fields.MIXTURE_TOP_N_FIELDS}
    sieve_values = {source_key: defaultdict(list) for source_key in fields.SIEVE_SOURCES}

    for parsed in parsed_records:
        for key, (path, _label) in fields.MIXTURE_NUMERIC_FIELDS.items():
            numeric_values[key].append(_to_float(parsed.values.get(path)))
        for key, (path, _label) in fields.MIXTURE_CATEGORICAL_FIELDS.items():
            categorical_values[key].append(parsed.values.get(path))
        for key, (path, _label) in fields.MIXTURE_TOP_N_FIELDS.items():
            top_n_values[key].append(parsed.values.get(path))
        for source_key, points in parsed.sieve_points.items():
            for size, pct in points.items():
                sieve_values[source_key][size].append(pct)

    result = {
        key: _numeric_summary(numeric_values[key], label)
        for key, (_path, label) in fields.MIXTURE_NUMERIC_FIELDS.items()
    }
    for key, (_path, label) in fields.MIXTURE_CATEGORICAL_FIELDS.items():
        result[key] = _categorical_summary(categorical_values[key], label)
    for key, (_path, label) in fields.MIXTURE_TOP_N_FIELDS.items():
        result[key] = _categorical_summary(top_n_values[key], label, top_n=10)
    result["sieve_curves"] = {
        source_key: _sieve_band(sieve_values[source_key], label)
        for source_key, (_path, label) in fields.SIEVE_SOURCES.items()
    }
    result["year_trend"] = _year_trend(parsed_records)
    return result


def get_overview(scope, workspace_ids, user):
    parsed_records = list(_iter_parsed_records(_resolve_records(scope, workspace_ids, user)))

    test_counts = Counter(p.test_key for p in parsed_records if p.test_key)
    mixture = _mixture_overview(parsed_records)

    return {
        "total_records": len(parsed_records),
        "records_by_test": [
            {"test": key, "label": fields.TEST_LABELS[key], "count": count}
            for key, count in sorted(test_counts.items())
        ],
        "avg_binder_content": mixture["binder_content"]["mean"],
        "avg_binder_content_n": mixture["binder_content"]["n"],
        "avg_rap_content": mixture["rap_content"]["mean"],
        "avg_rap_content_n": mixture["rap_content"]["n"],
        "mixture": mixture,
    }


def get_test_detail(test_key, scope, workspace_ids, user):
    if test_key not in fields.TEST_LABELS:
        raise LiveInsightsError(f"Unknown test '{test_key}'.")

    all_parsed = _iter_parsed_records(_resolve_records(scope, workspace_ids, user))
    parsed_records = [p for p in all_parsed if p.test_key == test_key]

    result_summaries = {}
    for metric_key, (path, label) in fields.TEST_RESULT_FIELDS.get(test_key, {}).items():
        values = [_to_float(p.values.get(path)) for p in parsed_records]
        result_summaries[metric_key] = _numeric_summary(values, label)

    if test_key == "stiffness":
        moduli = [v for p in parsed_records for v in _collect_stiffness_moduli(p.root)]
        result_summaries["stiffness_modulus"] = _numeric_summary(moduli, "Stiffness Modulus (MPa)")

    return {
        "test": test_key,
        "label": fields.TEST_LABELS[test_key],
        "record_count": len(parsed_records),
        "mixture": _mixture_overview(parsed_records),
        "results": result_summaries,
        "correlation": _correlation_analysis(parsed_records, test_key),
    }


# ---------------------------------------------------------------------------
# Correlation Analysis
#
# Pearson (linear) goes in the lower triangle, Spearman (rank/monotonic) in
# the upper - together they catch both straight-line and curved-but-monotonic
# relationships that Pearson alone would understate. Both are computed from
# scratch (no numpy/scipy dependency) since the data sizes here are small
# (per-test record counts, not bulk numerics) and every other stat on this
# page is already plain Python.
# ---------------------------------------------------------------------------

def _closest_sieve_value(points, target_size, tolerance=0.005):
    """`points` is {size: value}; returns the value at the size closest to
    target_size within tolerance, or None. Records don't always report sieve
    sizes with identical formatting/precision, so this is a tolerance match
    rather than an exact dict lookup."""
    best_size, best_diff = None, None
    for size in points:
        diff = abs(size - target_size)
        if diff <= tolerance and (best_diff is None or diff < best_diff):
            best_size, best_diff = size, diff
    return points.get(best_size) if best_size is not None else None


def _correlation_field_label(field_key, test_key):
    if field_key in fields.MIXTURE_NUMERIC_FIELDS:
        return fields.MIXTURE_NUMERIC_FIELDS[field_key][1]
    if field_key == "recovered_0063":
        return f"Recovered @ {fields.RECOVERED_FINES_SIEVE_SIZE}mm (%)"
    if field_key == "stiffness_modulus":
        return "Stiffness Modulus (MPa)"
    return fields.TEST_RESULT_FIELDS.get(test_key, {}).get(field_key, (None, field_key))[1]


def _correlation_field_value(parsed, field_key, test_key):
    """A single scalar for one field on one parsed record, or None if that
    record doesn't report it."""
    if field_key in fields.MIXTURE_NUMERIC_FIELDS:
        path, _label = fields.MIXTURE_NUMERIC_FIELDS[field_key]
        return _to_float(parsed.values.get(path))
    if field_key == "recovered_0063":
        points = parsed.sieve_points.get("recovered", {})
        return _closest_sieve_value(points, fields.RECOVERED_FINES_SIEVE_SIZE)
    if field_key == "stiffness_modulus":
        moduli = _collect_stiffness_moduli(parsed.root)
        return sum(moduli) / len(moduli) if moduli else None
    result_field = fields.TEST_RESULT_FIELDS.get(test_key, {}).get(field_key)
    if result_field:
        path, _label = result_field
        return _to_float(parsed.values.get(path))
    return None


def _ranks(values):
    """Average ranks (1-based), ties sharing the mean of the ranks they span -
    the standard way to make Spearman's rho well-defined with tied values."""
    order = sorted(range(len(values)), key=lambda i: values[i])
    ranks = [0.0] * len(values)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and values[order[j + 1]] == values[order[i]]:
            j += 1
        avg_rank = (i + j) / 2.0 + 1
        for k in range(i, j + 1):
            ranks[order[k]] = avg_rank
        i = j + 1
    return ranks


def _pearson(xs, ys):
    n = len(xs)
    mean_x, mean_y = sum(xs) / n, sum(ys) / n
    cov = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    var_x = sum((x - mean_x) ** 2 for x in xs)
    var_y = sum((y - mean_y) ** 2 for y in ys)
    denom = (var_x * var_y) ** 0.5
    return cov / denom if denom else None


def _spearman(xs, ys):
    return _pearson(_ranks(xs), _ranks(ys))


def _correlation_analysis(parsed_records, test_key):
    config = fields.CORRELATION_FIELDS.get(test_key)
    if not config:
        return None
    field_keys = config["default"] + config["extra"]
    values = {
        fk: [_correlation_field_value(p, fk, test_key) for p in parsed_records]
        for fk in field_keys
    }

    cells = []
    for i in range(len(field_keys)):
        for j in range(i + 1, len(field_keys)):
            fk_a, fk_b = field_keys[i], field_keys[j]
            paired = [
                (values[fk_a][k], values[fk_b][k])
                for k in range(len(parsed_records))
                if values[fk_a][k] is not None and values[fk_b][k] is not None
            ]
            if len(paired) < fields.MIN_CORRELATION_N:
                continue
            xs, ys = [p[0] for p in paired], [p[1] for p in paired]
            pearson, spearman = _pearson(xs, ys), _spearman(xs, ys)
            if pearson is None or spearman is None:
                continue
            n = len(paired)
            # Lower triangle (row > col): Pearson. Upper triangle (row < col): Spearman.
            cells.append({"row": j, "col": i, "r": round(pearson, 3), "n": n})
            cells.append({"row": i, "col": j, "r": round(spearman, 3), "n": n})

    return {
        "fields": [{"key": fk, "label": _correlation_field_label(fk, test_key)} for fk in field_keys],
        "default_count": len(config["default"]),
        "cells": cells,
    }


def get_correlation_pair(test_key, field_a, field_b, scope, workspace_ids, user):
    """Raw paired (x, y) values for one specific field pair, for the
    scatter-plot view opened by clicking a cell in the matrix - fetched on
    demand rather than bundled into every test-detail response, since most
    of a full field set's pairs are never actually clicked."""
    if test_key not in fields.TEST_LABELS:
        raise LiveInsightsError(f"Unknown test '{test_key}'.")
    config = fields.CORRELATION_FIELDS.get(test_key)
    allowed = set(config["default"] + config["extra"]) if config else set()
    if field_a not in allowed or field_b not in allowed:
        raise LiveInsightsError("Unknown correlation field for this test.")

    all_parsed = _iter_parsed_records(_resolve_records(scope, workspace_ids, user))
    parsed_records = [p for p in all_parsed if p.test_key == test_key]

    points = []
    for parsed in parsed_records:
        x = _correlation_field_value(parsed, field_a, test_key)
        y = _correlation_field_value(parsed, field_b, test_key)
        if x is not None and y is not None:
            points.append({"x": x, "y": y})

    xs = [p["x"] for p in points]
    ys = [p["y"] for p in points]
    pearson = round(_pearson(xs, ys), 3) if len(points) >= 2 and _pearson(xs, ys) is not None else None
    spearman = round(_spearman(xs, ys), 3) if len(points) >= 2 and _spearman(xs, ys) is not None else None

    return {
        "field_a": {"key": field_a, "label": _correlation_field_label(field_a, test_key)},
        "field_b": {"key": field_b, "label": _correlation_field_label(field_b, test_key)},
        "points": points,
        "n": len(points),
        "pearson": pearson,
        "spearman": spearman,
    }
