""" Patch Data.title prefixes using an old->new campaign ID mapping CSV
produced by renumber_campaign_ids. Only touches the leading
"<old_id>_" segment of the title, leaving the rest untouched.
"""
import csv

from django.core.management.base import BaseCommand, CommandError

from core_main_app.components.data.models import Data


class Command(BaseCommand):
    help = "Patch Data.title prefixes using a renumber_campaign_ids mapping CSV."

    def add_arguments(self, parser):
        parser.add_argument("--csv", required=True)
        parser.add_argument("--apply", action="store_true")

    def handle(self, *args, **options):
        with open(options["csv"], newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))

        updated = 0
        skipped = []
        for row in rows:
            data = Data.objects.get(id=row["record_id"])
            old_prefix = row["old_campaign_id"] + "_"
            new_prefix = row["new_campaign_id"] + "_"

            if not data.title.startswith(old_prefix):
                skipped.append((data.id, data.title))
                continue

            new_title = new_prefix + data.title[len(old_prefix):]

            if options["apply"]:
                data.title = new_title
                data.save()
            updated += 1

        if skipped:
            self.stdout.write(
                self.style.WARNING(
                    "Skipped {} records whose title didn't start with the "
                    "expected old campaign ID: {}".format(len(skipped), skipped[:10])
                )
            )

        if not options["apply"]:
            self.stdout.write(
                "Dry run: {} titles would be updated. Pass --apply to write.".format(updated)
            )
        else:
            self.stdout.write(self.style.SUCCESS("Updated {} titles.".format(updated)))

        if skipped and options["apply"]:
            raise CommandError(
                "{} records were skipped due to unexpected title format - review before re-running.".format(
                    len(skipped)
                )
            )
