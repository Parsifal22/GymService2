from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import GymBooking
import json


def homePage(request):
    return render(request, 'index.html')


@csrf_exempt
def save_booking(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))

        # Extract data from the request (adjust this based on your needs)
        selected_date = data.get('selected_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        # Create a new instance of your model and save it to the database
        booking = GymBooking(selected_date=selected_date, start_time=start_time, end_time=end_time)
        booking.save()

        return JsonResponse({'message': 'Data saved successfully'})

    return JsonResponse({'error': 'Invalid request method'})