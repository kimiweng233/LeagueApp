# Generated by Django 4.1.5 on 2023-06-24 23:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="summoner",
            name="topMasteries",
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
    ]
