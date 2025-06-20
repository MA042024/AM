# Live Insights

The **Live Insights** tab (third tab of the Visualization page, `templates/Visualization/data_insights.html`)
provides real-time analytics across curated database records, driven by the
six AsphaltDB test schemas maintained in
`core_curate_app/core_curate_app/pythoncodes/AsphaltDB-*.xsd`.

## Scope selector

At the top of the tab, a scope toggle switches between:

- **All Data** — sitewide aggregates across every curated record in the
  database.
- **Workspace** — one or more workspaces the current user has read or write
  access to, picked via a tag input (type to search, click a result to add
  it as a chip, click a chip's "×" to remove it — chosen over a native
  multi-select list because that doesn't hold up once a user has many
  workspaces). The workspace list itself is built with the same merge logic
  used by the Shared Workspace page
  (`workspace_api.get_all_workspaces_with_read_access_by_user` +
  `..._write_access_by_user`). Records from all selected workspaces are
  unioned (deduped by id); each workspace is still access-checked
  individually server-side (`_resolve_records` in `live_insights_service.py`)
  — the frontend list being pre-filtered to accessible workspaces is not
  treated as sufficient on its own.

### Access-control note (read before touching scope resolution)

`scope="workspace"` enforces the normal per-user workspace read check
(`workspace_api.can_user_read_workspace`) before querying, exactly like the
Shared Workspace page.

`scope="all"` is a **deliberate, intentional exception**: it queries every
record in the database via `Data.get_all(...)`, bypassing the normal
per-record visibility rules (`core_main_app.components.data.api.get_all` is
superuser-only; this feature calls the `Data` model directly instead). This
was a conscious product decision — Live Insights is meant to show sitewide
research trends to every logged-in user, not just staff. The guarantee that
keeps this safe: **only aggregated numbers ever leave the server** (counts,
means, percentile bounds). No endpoint under `visu/live-insights/` returns
raw record content, XML, or any way to page back to an individual record. If
you add a new chart or endpoint here, keep that guarantee — do not add a way
to fetch a single record's content through this scope.

`data_api.get_all_by_workspace` is called **without** `order_by_field`. Some
deployed `core_main_app` versions forward every kwarg from that call straight
into the `@access_control` permission check function
(`can_read_or_write_in_workspace`), which doesn't accept `order_by_field` and
raises a `TypeError`. Aggregation doesn't need ordering, so it's simply
omitted — don't add it back without confirming the deployed `core_main_app`
version accepts it.

## Charts

Every chart and summary reports its sample size in plain language ("245
records") — a mean or count without knowing how many records it's based on
isn't very useful.

### Choosing a chart type per variable

- **Continuous single-value fields** (binder %, RAP %, max density, and each
  test's key result metrics) default to a **mean + 95% interval** card (the
  2.5th-97.5th percentile of the underlying values, computed in
  `_numeric_summary()`/`_percentile()` in `live_insights_service.py`) — with
  many fields tiled on one page, a compact mean/interval/count card reads
  faster than a grid of small histograms and states the actual numbers
  plainly. Each card still carries its full histogram in the payload and can
  expand it in place via the "Distribution" toggle, so shape-of-distribution
  detail is one click away rather than always-on clutter.
- **Small, fixed-vocabulary categorical fields** (mixing method: hand /
  mechanical / plant — 3 values) use a **pie/donut** — a pie reads well as
  "share of total" precisely because there are few, comparably-sized slices.
- **Large/open-vocabulary categorical fields** (target binder grade, which
  can have many distinct values like "50/70", "40/60-70", etc.) use a
  **top-10 horizontal bar chart** instead of a pie — too many slices makes a
  pie unreadable, and long text labels fit a horizontal bar much better than
  pie-slice labels.
- **Record distribution by test** stays a vertical **bar chart**, not a pie:
  the 6 tests are heavily skewed (e.g. one test with ~1900 of 2300 records,
  others with a few dozen each), and a pie badly compresses the small slices
  into slivers that are hard to compare — a bar chart keeps every category
  legible regardless of how skewed the split is.
- **Records by year** is a **line trend**, not a histogram — year is a
  temporal/ordinal count, not a continuous measurement to bin.
- **Sieve gradation** stays the mean line + shaded 95% interval band
  described below — it's a curve across an ordered x-axis (sieve size), not
  a single-value distribution, so none of the above chart types apply. Shown
  as **two separate curves**, not merged (see below).

**Overview (always visible, Mixture branch — common to every test):**
- Record distribution by test (bar chart)
- Mixing method (pie/donut)
- Target binder grade (top-10 horizontal bar)
- Records by year (line trend) — technically a `DataSource.Year` field, not
  `Mixture`, but shown alongside the mixture charts since it's useful context
  for interpreting them
- Binder content, RAP content, maximum density — mean + 95% interval cards,
  each with an expandable histogram
- Sieve gradation — Composition (as designed) and Sieve gradation — Recovered
  Materials, each its own mean line + shaded 95% interval band per sieve size
  (hover a point for its record count)

**Per test (after picking a test in the drill-down selector):**
- The same Mixture charts above, narrowed to only that test's records
- That test's key result metrics as mean + 95% interval cards (e.g. Marshall
  stability/flow, ITS strength, Rutting depth, Stiffness modulus, TSRST
  failure temp/stress, UTST tensile strength)

### Two sieve sources, not one

`GrainSizeDistributionType` (the `Point`/`Size`/`PercentageDistribution`
structure) appears in more than one place in the schema, and they mean
different things — they must **not** be merged:

- `fields.SIEVE_SOURCES["composition"]` →
  `Mixture.MixtureRecipe.Composition.AggregatesDistribution` — the
  as-designed blend gradation for the whole mixture.
- `fields.SIEVE_SOURCES["recovered"]` →
  `Mixture.RecoveredMaterials.Aggregates.GrainSizeDistribution` — the
  gradation measured on aggregate recovered/extracted back out of the
  mixture after production (a QA/verification curve, and usually the more
  commonly reported one).

Both are computed independently in `_mixture_overview()` (`sieve_curves`,
keyed by source) and rendered as two separate charts, both in the overview
and in the per-test drill-down. An earlier version of this code silently
fell back from "composition" to a third branch
(`MixtureComponentProperties.VirginAggregates.GrainSizeDistribution`) when
the composition-level curve was empty for a record — that was a guess made
without DB access and merged two conceptually different curves into one
misleading "average"; it's been replaced by showing the two real,
independent sources explicitly instead of merging anything.

### Sieve band rendering

Each band is drawn as a Chart.js line chart with an explicit `fill: 0`
target (absolute dataset index, not the relative `'+1'`/`'-1'` shorthand)
between the "95% Upper" and "95% Lower" datasets. Both boundary datasets are
hidden from the legend and from the tooltip's per-row list (via a `legend.
labels.filter` / `tooltip.filter` callback) so the chart reads as one Mean
line with a shaded band, not three separate confusingly-named series.

### A note on RAP content coverage

`rap_content` (`Mixture.MixtureRecipe.Composition.ReclaimedAsphalt`) is
`minOccurs="0"` in every test XSD, and it's genuinely often absent in curated
records (virgin mixes, or literature-derived records that didn't report it).
The `n` shown on the RAP card is the real count of records that reported a
RAP percentage — **don't** treat a missing value as an implicit 0; there's no
way to distinguish "confirmed virgin mix" from "not reported" from the data
alone, so silently defaulting to 0 would misrepresent unknown data as
confirmed. If RAP coverage looks low, that's the schema's optional field
being honestly reported, not a parsing bug — the `MixtureComponentProperties.
ReclaimedAsphalt` branch was checked as a possible alternate source and only
contains RAP *material* properties (grain size, LA abrasion, etc.), not a
content percentage.

## Field mapping

`mdcs/Visualization/live_insights_fields.py` declares, per test, which XSD
paths are charted and their display labels, split into `MIXTURE_NUMERIC_FIELDS`
(mean + interval cards), `MIXTURE_CATEGORICAL_FIELDS` (pie charts, small fixed
vocabulary), `MIXTURE_TOP_N_FIELDS` (top-10 bar charts, open vocabulary), and
`TEST_RESULT_FIELDS` (per-test numeric metrics). Paths are copied verbatim
from the XSD element names (not guessed), and the root-tag → test-key mapping
mirrors the `Tests` dict built by `xmlprocessing.load_test_schemas()` in
`core_curate_app`. Two field families need dedicated extraction instead of
the generic path-walker, because repeated non-indexed XML tags collide under
it:
- sieve `<Point>` entries under `AggregatesDistribution`
- Stiffness `<Case>` entries (each carrying a `StiffnessModulus`)

Both are walked directly with `ElementTree.findall()` in
`live_insights_service.py`. Sieve points are walked once per source in
`fields.SIEVE_SOURCES` (see "Two sieve sources, not one" above) rather than
once overall.

## Backend

- `mdcs/Visualization/live_insights_fields.py` — XSD-derived field/path config.
- `mdcs/Visualization/live_insights_service.py` — scope resolution, XML
  parsing (reuses `downloadexcel_codes.extract_paths_and_values`), and
  aggregation (counts, mean + 95% interval summaries, sieve band).
- `mdcs/Visualization/toolsviews.py` — `live_insights_workspaces`,
  `live_insights_tests`, `live_insights_overview`, `live_insights_test_detail`.
- `mdcs/Visualization/tools_urls.py` — routes under `visu/live-insights/`.

## API endpoints

| Endpoint | Method | Query params | Returns |
|---|---|---|---|
| `visu/live-insights/workspaces/` | GET | — | Workspaces the user can read/write |
| `visu/live-insights/tests/` | GET | — | The 6 test keys + display labels |
| `visu/live-insights/overview/` | GET | `scope`, `workspace_id` (comma-separated ids, e.g. `3,7,12`) | Sitewide/workspace KPIs + overview charts |
| `visu/live-insights/test/<test_key>/` | GET | `scope`, `workspace_id` (comma-separated ids) | Mixture charts narrowed to the test + result-metric charts |

## Frontend

- `static/js/Visualization/live-insights.js` — lazy-initializes when the
  "Live Insights" tab is first opened, fetches the endpoints above, and
  renders all charts with Chart.js (already loaded site-wide on the
  Visualization page).
- `static/css/Visualization/live-insights.css` — styling, reusing the design
  tokens defined in `excel_visu.css` (`--accent`, `--accent2`, `--card-bg`,
  `--shadow`, Inter font) for visual consistency with the rest of the page.
