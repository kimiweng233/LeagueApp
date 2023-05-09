# Generated by Django 4.1.5 on 2023-05-06 05:13

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0009_alter_team_members_alter_team_teamacronym_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="RegisteredSummoner",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "summonerID",
                    models.TextField(default="No Name", max_length=16, unique=True),
                ),
                ("registeredTournaments", models.JSONField(default=dict)),
                ("registeredTeams", models.JSONField(default=dict)),
            ],
        ),
        migrations.DeleteModel(name="RegisteredSummoners",),
        migrations.AlterField(
            model_name="tournament",
            name="startTime",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]