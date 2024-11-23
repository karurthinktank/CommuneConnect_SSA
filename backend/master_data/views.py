from .serializers import PincodeSerializer
from .models import Pincode
from rest_framework import permissions
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action


class MasterDataViewSet(viewsets.ModelViewSet):
    # permission_classes = (permissions.AllowAny,)
    queryset = Pincode.objects.all()
    # serializer_class = PincodeSerializer

    @action(methods=['get'], detail=False, url_path='get-state-list')
    def state_list(self, request):
        data = list(Pincode.objects.all().distinct('state').values_list('state', flat=True))
        return Response({"data": data}, status=200)

    @action(methods=['get'], detail=False, url_path='get-state-list/(?P<state>[^/]+)')
    def state_based_list(self, request, state):
        queryset = Pincode.objects.all()
        state_list = list(queryset.distinct('state').values_list('state', flat=True))
        district_list = list(queryset.filter(state=state).distinct('district').values_list('district', flat=True))
        pincode_list = list(queryset.filter(state=state).values_list('pincode', flat=True))
        return Response({"state": state_list, "district": district_list, "pincode": pincode_list}, status=200)

    @action(methods=['get'], detail=False, url_path='get-district-list/(?P<state>[^/]+)')
    def district_list(self, request, state):
        data = list(Pincode.objects.filter(state=state).distinct('district').values_list('district', flat=True))
        return Response({"data": data}, status=200)

    @action(methods=['get'], detail=False, url_path='get-pincode-list/(?P<district>[^/]+)')
    def pincode_list(self, request, district):
        data = list(Pincode.objects.filter(district=district).values_list("pincode", flat=True))
        return Response({"data": data}, status=200)

    @action(methods=['get'], detail=False, url_path='get-pincode')
    def pincode_details(self, request, code=None):
        instance = Pincode.objects.filter(pincode=code).first()
        serializer = PincodeSerializer(instance, context={'request': request})
        return Response(serializer.data)



