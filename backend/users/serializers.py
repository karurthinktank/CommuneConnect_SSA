from rest_framework import serializers
from .models import People, FamilyMembers, TMSUser


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = TMSUser
        fields = ("username", "first_name", "email", "last_name")


class PeopleSerializer(serializers.ModelSerializer):
    member_id = serializers.CharField(required=False, read_only=True)
    def to_representation(self, instance):

        """ Serialize GenericForeignKey field """

        primitive_repr = super(PeopleSerializer, self).to_representation(instance)
        primitive_repr['father_or_husband'] = instance.father_or_husband if instance.father_or_husband else ""
        primitive_repr['id_card_no'] = instance.id_card_no if instance.id_card_no else ""
        primitive_repr['mobile_number'] = instance.mobile_number if instance.mobile_number else ""
        primitive_repr['receipt_date'] = instance.receipt_date if instance.receipt_date else ""
        primitive_repr['charity_registration_number'] = instance.charity_registration_number \
            if instance.charity_registration_number else ""
        primitive_repr['taluk'] = instance.taluk if instance.taluk else ""
        primitive_repr['panchayat'] = instance.panchayat if instance.panchayat else ""
        primitive_repr['village'] = instance.village if instance.village else ""
        primitive_repr['postal_code'] = instance.postal_code if instance.postal_code else ""
        primitive_repr['secondary_mobile_number'] = instance.secondary_mobile_number \
            if instance.secondary_mobile_number else ""
        primitive_repr['country_code'] = instance.country_code if instance.country_code else ""
        primitive_repr['phone_number'] = instance.phone_number if instance.phone_number else ""

        return primitive_repr

    class Meta:
        model = People
        fields = "__all__"


class FamilyMembersSerializer(serializers.ModelSerializer):
    # people = PeopleSerializer(read_only=True)
    class Meta:
        model = FamilyMembers
        fields = "__all__"



