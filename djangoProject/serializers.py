from rest_framework import serializers
from .models import GymBooking


class GymBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymBooking
        fields = ['selected_date', 'start_time', 'end_time']