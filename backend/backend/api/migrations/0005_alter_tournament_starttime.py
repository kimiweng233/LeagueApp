# Generated by Django 4.1.5 on 2023-05-03 03:36

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_alter_tournament_starttime"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tournament",
            name="startTime",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2023, 5, 3, 3, 36, 38, 840393, tzinfo=datetime.timezone.utc
                )
            ),
        ),
    ]