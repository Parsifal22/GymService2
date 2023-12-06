from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import GymBooking
import json


def homePage(request):
    return render(request, 'index.html')


def get_bookings(request, selected_date):
    if request.method == 'GET':
        try:
            # Retrieve bookings from the database based on the selected date
            bookings = GymBooking.objects.filter(selected_date=selected_date)
            print("Test")
            # Convert the queryset to a list of dictionaries
            bookings_data = [
                {'start_time': booking.start_time.strftime('%H:%M'),
                 'end_time': booking.end_time.strftime('%H:%M')}
                for booking in bookings
            ]

            return JsonResponse({'bookings': bookings_data})
        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method'})

@csrf_exempt
def save_booking(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))

        # Extract data from the request (adjust this based on your needs)
        selected_date = data.get('selected_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        # Validate that the required fields are present in the data
        if 'selected_date' not in data or 'start_time' not in data or 'end_time' not in data:
            return JsonResponse({'error': 'Missing required fields'})

        # Validate that the start time is not greater than the end time
        if data['start_time'] >= data['end_time']:
            return JsonResponse({'error': 'Start time must be earlier than end time'})

        # Create a new instance of your model and save it to the database
        booking = GymBooking(selected_date=selected_date, start_time=start_time, end_time=end_time)
        booking.save()

        return JsonResponse({'message': 'Data saved successfully'})

    return JsonResponse({'error': 'Invalid request method'})