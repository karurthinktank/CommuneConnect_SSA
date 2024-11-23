#!/usr/bin/env python
import csv
import sys
import os
import datetime


def csv_parsing():
    from master_data.models import Pincode
    rows = dict()
    try:
        print("read csv file started...")
        with open("static/pincode.csv", "r") as file:
            csv_reader = csv.reader(file)
            header = next(csv_reader)
            print("read csv file completed...")
            for row in csv_reader:
                print(row)
                try:
                    # check existing pincode
                    instance = Pincode.objects.filter(pincode=row[1]).first()
                    if not instance:
                        instance = Pincode()
                    instance.pincode = row[1]
                    instance.city = row[7]
                    instance.district = row[8]
                    instance.state = row[9]
                    instance.save()
                except Exception as e:
                    print("***Error in insert data***")
                    print(e)
        print("sync Completed")
    except Exception as e:
        print("***Error in file read***")
        print(e)


if __name__ == "__main__":
    if sys.argv.__len__() > 1:
        command = sys.argv[1]

        if command == 'updatepincode':
            import django

            os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tms.settings")
            django.setup()
            print("Sync started....")
            csv_parsing()


