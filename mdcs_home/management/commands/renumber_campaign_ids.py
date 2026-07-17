""" Renumber MeasurementCampaignID on Marshall records in a workspace.

Assigns a new sequential ID per record, per Year (in "0001/YY" format,
two-digit year), based on the existing <Year> element in each record.
Writes a CSV mapping of old -> new IDs before making any change; only
writes to the database when --apply is passed.
"""
import csv
import re

from django.core.management.base import BaseCommand, CommandError

from core_main_app.components.data.api import check_xml_file_is_valid
from core_main_app.components.data.models import Data
from core_main_app.components.workspace.models import Workspace

CAMPAIGN_ID_RE = re.compile(
    r"(<MeasurementCampaignID>)(.*?)(</MeasurementCampaignID>)"
)
YEAR_RE = re.compile(r"<Year>(.*?)</Year>")
ALREADY_NUMBERED_RE = re.compile(r"^\d{4}/\d{2}$")


class Command(BaseCommand):
    """Renumber MeasurementCampaignID for a workspace, per year."""

    help = "Renumber MeasurementCampaignID on Marshall records in a workspace."

    def add_arguments(self, parser):
        parser.add_argument(
            "--workspace",
            required=True,
            help="Workspace title, e.g. CantonZH or 'Canton Aargau'.",
        )
        parser.add_argument(
            "--csv",
            required=True,
            help="Path to write the old->new mapping CSV to.",
        )
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Actually write the new IDs. Without this, only the CSV is produced.",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Renumber even if the workspace looks already renumbered.",
        )

    def handle(self, *args, **options):
        workspace = Workspace.objects.get(title=options["workspace"])
        records = list(Data.objects.filter(workspace=workspace))

        if not records:
            raise CommandError(
                "No records found in workspace '{}'.".format(workspace.title)
            )

        by_year = {}
        for data in records:
            id_match = CAMPAIGN_ID_RE.search(data.xml_content)
            year_match = YEAR_RE.search(data.xml_content)
            if not id_match or not year_match:
                raise CommandError(
                    "Record {}: missing MeasurementCampaignID or Year.".format(
                        data.id
                    )
                )
            by_year.setdefault(year_match.group(1), []).append(
                (data, id_match.group(2))
            )

        already_numbered = sum(
            1
            for records_for_year in by_year.values()
            for _, old_id in records_for_year
            if ALREADY_NUMBERED_RE.match(old_id)
        )
        if already_numbered == len(records) and not options["force"]:
            raise CommandError(
                "Every record in '{}' already has an ID in NNNN/YY format - "
                "this workspace looks like it was already renumbered. "
                "Pass --force to renumber it again anyway.".format(workspace.title)
            )

        rows = []
        for year in sorted(by_year):
            short_year = year[-2:]
            for i, (data, old_id) in enumerate(by_year[year], start=1):
                new_id = "{:04d}/{}".format(i, short_year)
                rows.append((data.id, old_id, new_id, year))

        with open(options["csv"], "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["record_id", "old_campaign_id", "new_campaign_id", "year"])
            writer.writerows(rows)

        self.stdout.write(
            "Wrote mapping for {} records to {}".format(len(rows), options["csv"])
        )

        if not options["apply"]:
            self.stdout.write(self.style.WARNING("Dry run only. Pass --apply to write changes."))
            return

        by_id = {r[0]: r[2] for r in rows}
        updated = 0
        for data in records:
            new_id = by_id[data.id]
            data.xml_content = CAMPAIGN_ID_RE.sub(
                r"\g<1>{}\g<3>".format(new_id), data.xml_content, count=1
            )
            check_xml_file_is_valid(data)
            data.convert_and_save()
            updated += 1

        self.stdout.write(self.style.SUCCESS("Updated {} records.".format(updated)))
