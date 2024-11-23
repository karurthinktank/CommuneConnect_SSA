import logging
import json
import base64
import subprocess

from datetime import timedelta
from django.utils import timezone
from .serializers import PeopleSerializer, UserSerializer, FamilyMembersSerializer
from .models import People, FamilyMembers, Scripts
from rest_framework import permissions
from rest_framework import viewsets, status
from django.contrib.auth.models import Group
from rest_framework.response import Response
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib.auth.base_user import get_random_string
from django.conf import settings

from django.db.models import Q
from rest_framework.views import APIView
# from common.custom_exceptions import DevOpsValidationErr
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import TokenVerifySerializer
import datetime
from rest_framework.decorators import action
from utils.google_ import upload_from_string, read_file


"""
User creation, list, view, edit and delete
"""


class PeopleViewSet(viewsets.ModelViewSet):
    queryset = People.objects.filter(deleted=False)
    serializer_class = PeopleSerializer

    def list(self, request, *args, **kwargs):
        """
        User List API
        Args:
            request:
            *args:
            **kwargs:

        Returns: Json Response

        """
        response = dict()
        try:
            query_params = request.GET.copy()
            page = query_params.get("page", 1)
            count = query_params.get("count", 50)
            search_text = query_params.get("search", None)
            sort_by = query_params.get("sort_by", "id")
            order_by = query_params.get("order_by", None)
            q_object = Q()
            if order_by and order_by == "asc":
                sort_by = "-" + sort_by

            if search_text:
                q_object.add(Q(name__icontains=search_text) | Q(mobile_number__icontains=search_text) |
                          Q(member_id__icontains=search_text), Q.OR)
            try:
                count = int(count)
                count = 200 if count > 200 else count
            except Exception:
                count = 50

            try:
                page = int(page)
            except Exception:
                page = 1
            user_list = People.objects.filter(q_object, deleted=False).order_by(sort_by)
            paginator = Paginator(user_list, count)
            try:
                resource = paginator.page(page)
            except PageNotAnInteger:
                resource = paginator.page(1)
            except EmptyPage:
                resource = paginator.page(paginator.num_pages)

            data = self.serializer_class(resource, context={'request': request}, many=True).data
            payload = {
                "data": data,
                "current_page": resource.number,
                "total_count": user_list.count(),
                "has_next": resource.has_next(),
                "has_previous": resource.has_previous(),
                "count": count,
                "total_pages": resource.paginator.num_pages,
                "message": "Success"
            }
            return Response(payload, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(str(e))
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        """
        Create Case
        Args:
            request:
            *args:
            **kwargs:

        Returns: Json Response

        """
        response = dict()
        response['error'] = None
        data = dict()
        try:
            profile_image = request.FILES.get('profile_image')
            if profile_image:
                data['profile_image'] = self.upload_images(profile_image, "profile", data['member_id'])
            data = json.loads(request.POST.get("form_data"))
            existing_instance = People.objects.filter(member_id=data['member_id']).first()
            if existing_instance:
                response['message'] = "Member Id already exist! Kindly update correct Member ID"
                response['code'] = 400
                response['error'] = "Member Id already exist! Kindly update correct Member ID"
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            data['created_by'] = request.user.first_name
            if profile_image:
                profile_image = profile_image.read()
                data['profile_image'] = base64.b64encode(profile_image).decode()
            if data['profile_image'] and data['mobile_number'] and data['current_address']:
                data['is_profile_completed'] = True
            if not data['receipt_date']:
                data['receipt_date'] = None

            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.validated_data['member_id'] = data['member_id']
                serializer.save()
                for member in data['members']:
                    member['name'] = member['member_name']
                    member['mobile_number'] = member['member_mobile_number']
                    member['people_id'] = serializer.data['id']
                    member['created_by'] = request.user.first_name
                    people = People.objects.filter(id=serializer.data['id']).first()
                    member['people'] = serializer.data['id']
                    if not member['date_of_birth']:
                        member['date_of_birth'] = None

                    member_serializer = FamilyMembersSerializer(data=member)
                    if member_serializer.is_valid():
                        # member_serializer.validated_data['people_id'] = serializer.data['id']
                        member_serializer.save()
                    else:
                        people.delete()
                        response['message'] = "Bad Request!"
                        response['code'] = 400
                        response['error'] = member_serializer.errors
                        return Response(response, status=status.HTTP_400_BAD_REQUEST)
            else:
                response['message'] = "Bad Request!"
                response['error'] = serializer.errors
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response['message'] = "Created Successfully!"
            response['code'] = 201
            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            response['message'] = "Internal Server Error!"
            response['error'] = str(e)
            response['code'] = 500
            logging.error(str(e))
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        response = dict()
        response['error'] = None
        data = dict()
        try:
            data = json.loads(request.POST.get("form_data"))
            slug = kwargs.get("pk", None)
            data['modified_by'] = request.user.first_name
            data['modified_at'] = timezone.now()
            people = People.objects.filter(member_id=slug).first()
            if not people:
                logging.error("")
                response['message'] = "Invalid Member ID"
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            profile_image = request.FILES.get('profile_image', None)
            data['created_by'] = people.created_by
            if profile_image:
                data['profile_image'] = self.upload_images(profile_image, "profile", data['member_id'])
            else:
                del data['profile_image']
            if not data['receipt_date']:
                data['receipt_date'] = None
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.update(people, serializer.validated_data)
                # updated instance
                people = People.objects.filter(member_id=slug).first()
                # check profile is completed
                if people.mobile_number and people.profile_image and people.current_address:
                    people.is_profile_completed = True
                else:
                    people.is_profile_completed = False
                people.save()
                logging.info({"Member Id": data['member_id'], "message": "Updated Successfully!"})
                for member in data['members']:
                    existing_member = None
                    if 'id' in member:
                        existing_member = FamilyMembers.objects.filter(id=member['id'], people=people).first()
                    if existing_member:
                        if not member['date_of_birth']:
                            member['date_of_birth'] = None
                        member_serializer = FamilyMembersSerializer(data=member)
                        if member_serializer.is_valid():
                            # member_serializer.validated_data['people_id'] = people.id
                            serializer.update(existing_member, member_serializer.validated_data)
                        else:
                            response['message'] = "Bad Request!"
                            response['code'] = 400
                            return Response(response, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        member['people'] = people.id
                        member['created_by'] = request.user.first_name
                        if not member['date_of_birth']:
                            member['date_of_birth'] = None

                        member_serializer = FamilyMembersSerializer(data=member)
                        if member_serializer.is_valid():
                            # member_serializer.validated_data['people_id'] = people.id
                            member_serializer.save()
                        else:
                            response['message'] = "Bad Request!"
                            response['code'] = 400
                            response['error'] = member_serializer.errors
                            return Response(response, status=status.HTTP_400_BAD_REQUEST)

                # soft delete members
                for deleted in data['deleted_members']:
                    member_instance = FamilyMembers.objects.filter(id=deleted['id'], people=people).first()
                    member_instance.deleted = True
                    member_instance.save()
            else:
                logging.info({"Member ID": data['member_id'], "message": serializer.errors})
                response['message'] = "Bad Request!"
                response['code'] = 400
                response['error'] = serializer.errors
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response['message'] = "Updated Successfully!"
            response['code'] = 200
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = "Internal Server Error!"
            response['error'] = str(e)
            response['code'] = 500
            logging.error({"Member ID": data['member_id'], "message": str(e)})
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @staticmethod
    def upload_images(attachment, folder, member_id):
        try:
            obj = dict()
            # attachment = request.FILES.get(file)
            file_content = attachment.read()
            content_type = attachment.content_type
            extension = attachment.name.split(".")[-1]
            name = "{}-profile".format(str(member_id))
            file_name = "{}/{}.{}".format(folder, name, extension)
            blob = upload_from_string(
                file_content,
                content_type,
                file_name,
                settings.BUCKET_NAME)
            signed_url = blob.generate_signed_url(expiration=timedelta(days=3650))
            if blob:
                obj = {
                    "bucket_name": blob.bucket.name,
                    "file_path": blob.name,
                    "name": attachment.name,
                    "public_url": blob.public_url,
                    "media_link": blob.media_link,
                    "signed_url": signed_url
                }
            return obj
        except Exception as e:
            logging.error(str(e))
            raise e

    def retrieve(self, request, *args, **kwargs):
        response = dict()
        try:
            slug = kwargs.get("pk", None)
            people = People.objects.filter(member_id=slug).first()
            if not people:
                logging.info({"User": slug, "message": "Invalid User"})
                response['message'] = "Invalid User"
                response['code'] = 400
                response['data'] = dict()
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            data = self.serializer_class(people, context={'request': request}).data
            family_members = FamilyMembers.objects.filter(people=people, deleted=False)
            data['family_members'] = FamilyMembersSerializer(family_members,
                                                             context={'request': request}, many=True).data
            response['message'] = "Success!"
            response['code'] = 200
            response['data'] = data
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            response['data'] = dict()
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        response = dict()
        try:
            slug = kwargs.get("pk", None)
            case = People.objects.filter().first()
            case.deleted = True
            case.modified_by = request.user
            case.modified_at = timezone.now()
            case.save()
            response['message'] = "Deleted Successfully!"
            response['code'] = 200
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['get'], detail=False, url_path='get-user')
    def get_user(self, request):
        # qs = self.queryset.filter(id=pk, is_superuser=False).first()
        serializer = UserSerializer(request.user, context={'request': request})
        data = serializer.data
        return Response(data)

    @action(methods=['get'], detail=False, url_path='get-user-by-card')
    def get_user_by_card(self, request):
        response = dict()
        try:
            script_name = 'nfctool'
            script = Scripts.objects.filter(script_name=script_name).first()
            script_path = script.script_path
            logging.info("Path :", script_path if script_path else '')
            if not script_path:
                response['message'] = "Add script path in the Database"
                response['code'] = 500
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            # script_path = 'C://Users//kmuruga6//Downloads//nfctool.py'
            tag_info = subprocess.run(['python', script_path], capture_output=True, text=True, check=True)
            if tag_info.returncode == 0:
                uid = tag_info.stdout.strip()  # Extract UID from stdout
                print(uid)
                logging.info('UID: for the user : ', uid)
                if 'error' in uid:
                    response['message'] = uid
                    response['code'] = 500
                    return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                person = People.objects.filter(Q(family_card_no=uid) | Q(trust_card_no=uid)).first()
                if person:
                    member_id = person.member_id
                    response['message'] = "Success"
                    response['code'] = 200
                    response['member_id'] = member_id
                    return Response(response, status=status.HTTP_200_OK)
                else:
                    response['message'] = "No user mapped for this card"
                    response['code'] = 500
                    return Response(response, status=status.HTTP_200_OK)
            else:
                response['message'] = "Script execution failed"
                response['code'] = 500
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['post'], detail=True, url_path='card-map')
    def card_map(self, request, pk):
        response = dict()
        try:
            data = request.data
            card_type = data.get('cardType')
            member_id = data.get('member_id')
            script_name = 'nfctool'
            script = Scripts.objects.filter(script_name=script_name).first()
            script_path = script.script_path
            logging.info("Path :", script_path if script_path else '')
            if not script_path:
                response['message'] = "Add script path in the Database"
                response['code'] = 500
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            # script_path = 'C://Users//kmuruga6//Downloads//nfctool.py'
            tag_info = subprocess.run(['python', script_path], capture_output=True, text=True, check=True)
            if tag_info.returncode == 0:
                uid = tag_info.stdout.strip()  # Extract UID from stdout
                print(uid)
                logging.info('UID: for the user : ', uid)
                if 'error' in uid:
                    response['message'] = uid
                    response['code'] = 500
                    return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                if People.objects.filter(Q(family_card_no=uid) | Q(trust_card_no=uid)).exists():
                    response['message'] = "This card is already mapped, please check in Database!"
                    response['code'] = 500
                    return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                people = People.objects.filter(member_id=member_id).first()
                people.modified_by = request.user.first_name
                people.modified_at = timezone.now()

                if card_type == 'Trustee':
                    if people.trust_card_no == uid:
                        response['message'] = "Trustee card already mapped, try family card instead"
                        response['code'] = 500
                        return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    people.trust_card_no = uid
                else:
                    if people.family_card_no == uid:
                        response['message'] = "Family card already mapped"
                        response['code'] = 500
                        return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    people.family_card_no = uid
                people.save()

                if int(member_id) < 600 and people.family_card_no and people.trust_card_no:
                    people.is_card_mapped = True
                elif int(member_id) > 600:
                    people.is_card_mapped = True
                else:
                    people.is_card_mapped = False
                people.save()
                response['message'] = "{} Card Mapped Successfully!".format(card_type)
                response['code'] = 200
                return Response(response, status=status.HTTP_200_OK)
            else:
                response['message'] = "Script execution failed"
                response['code'] = 500
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['get'], detail=True, url_path='get-id-card')
    def get_id_card(self, request, pk):
        # qs = self.queryset.filter(id=pk, is_superuser=False).first()
        instance = People.objects.filter(member_id=pk).first()
        image_type = instance.profile_image['name'].split(".")[-1]
        b64_content = ""
        blob = read_file(instance.profile_image['file_path'], instance.profile_image['bucket_name'])
        if blob:
            b64_content = base64.b64encode(blob.download_as_bytes()).decode("utf-8")
        data = {
            "name": instance.name,
            "father_or_husband": instance.father_or_husband,
            "member_id": instance.member_id,
            "is_charity_member": instance.is_charity_member,
            "receipt_no": instance.receipt_no,
            "profile_image": b64_content,
            "current_address": instance.current_address,
            "mobile_number": instance.mobile_number
        }
        return Response(data, status=status.HTTP_200_OK)


class DashboardViewSet(viewsets.ModelViewSet):
    queryset = People.objects.filter(deleted=False)
    serializer_class = PeopleSerializer

    def list(self, request, *args, **kwargs):
        try:
            family_count = self.queryset.count()
            members = FamilyMembers.objects.filter(deleted=False)
            total_members_count = family_count + members.count()
            card_mapped_count = self.queryset.filter(is_card_mapped=True).count()
            male_count = self.queryset.filter(gender="ஆண்").count() + members.filter(gender="ஆண்").count()
            female_count = self.queryset.filter(gender="பெண்").count() + members.filter(gender="பெண்").count()
            no_profile_count = self.queryset.filter(Q(profile_image__isnull=True) | Q(profile_image__exact='')).count()
            no_mobile_count = self.queryset.filter(Q(mobile_number__isnull=True) | Q(mobile_number__exact='')).count()
            response = {
                "family_count": family_count,
                "members_count": total_members_count,
                "id_card_count": card_mapped_count,
                "male_count": male_count,
                "female_count": female_count,
                "no_profile_count": no_profile_count,
                "no_mobile_count": no_mobile_count
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)






