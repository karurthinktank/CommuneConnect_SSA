# Generated by Django 5.1.3 on 2024-12-06 03:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='people',
            name='caste',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
