# Generated by Django 4.1.5 on 2023-08-09 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0011_remove_tournament_ended"),
    ]

    operations = [
        migrations.AddField(
            model_name="tournament",
            name="omittedTeams",
            field=models.ManyToManyField(blank=True, related_name="+", to="api.team"),
        ),
    ]
