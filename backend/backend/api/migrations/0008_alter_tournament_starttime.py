# Generated by Django 4.1.5 on 2023-05-05 03:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_tournament_started_alter_tournament_starttime"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tournament",
            name="startTime",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2023, 5, 5, 3, 15, 59, 39656, tzinfo=datetime.timezone.utc
                )
            ),
        ),
    ]
