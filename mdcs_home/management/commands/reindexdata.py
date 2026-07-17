""" Rebuild the MongoDB search index of every record.

Records are indexed when they are saved, so this is only needed to pick up
changes to what gets indexed (e.g. the searchable text of existing records).
"""
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from core_main_app.commons.constants import DATA_TEXT_FIELD
from core_main_app.components.data.models import Data


class Command(BaseCommand):
    """Reindex every record in MongoDB."""

    help = "Rebuild the MongoDB search index of every record."

    def add_arguments(self, parser):
        parser.add_argument(
            "--check",
            action="store_true",
            help="Only report how many records are searchable, index nothing.",
        )

    def handle(self, *args, **options):
        if not settings.MONGODB_INDEXING:
            raise CommandError("MongoDB indexing is disabled.")

        from core_main_app.components.mongo.models import MongoData

        if DATA_TEXT_FIELD not in MongoData._fields:
            raise CommandError(
                "MongoData has no '{}' field: this container is running an "
                "older core_main_app, indexing now would have no "
                "effect.".format(DATA_TEXT_FIELD)
            )

        if options["check"]:
            self._report(MongoData)
            return

        total = Data.objects.count()
        count = 0
        errors = 0

        self.stdout.write("Reindexing {} records...".format(total))

        for data in Data.objects.all().iterator():
            try:
                MongoData.init_mongo_data(data).save()
                count += 1
            except Exception as exception:
                errors += 1
                self.stderr.write(
                    "Record {}: {}".format(data.id, str(exception))
                )

            if count and count % 500 == 0:
                self.stdout.write("  {}/{}".format(count, total))

        self.stdout.write("Reindexed {} records, {} errors.".format(count, errors))
        self._report(MongoData)

    def _report(self, mongo_data_model):
        """Count how many indexed records actually hold searchable text."""
        indexed = mongo_data_model.objects.count()
        searchable = mongo_data_model.objects(
            **{"{}__nin".format(DATA_TEXT_FIELD): [None, ""]}
        ).count()

        message = "{}/{} records in MongoDB are searchable.".format(
            searchable, indexed
        )

        if searchable == indexed and indexed:
            self.stdout.write(self.style.SUCCESS(message))
        else:
            self.stdout.write(self.style.WARNING(message))
