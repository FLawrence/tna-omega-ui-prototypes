from django.db import migrations, models
import django.db.models.deletion
import modelcluster.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("utils", "0002_tracking"),
    ]

    operations = [
        migrations.CreateModel(
            name="PageRelatedPage",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "sort_order",
                    models.IntegerField(blank=True, editable=False, null=True),
                ),
                (
                    "page",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to="wagtailcore.Page",
                    ),
                ),
                (
                    "parent",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="page_related_pages",
                        to="wagtailcore.Page",
                    ),
                ),
            ],
            options={"ordering": ["sort_order"], "abstract": False},
        ),
    ]
