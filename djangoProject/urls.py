
from django.contrib import admin
from django.urls import path
from .homePage import homePage
from .homePage import save_booking
from .homePage import get_bookings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', homePage, name='index'),
    path('api/save_booking/', save_booking, name='save_booking'),
    path('api/get_bookings/<str:selected_date>/', get_bookings, name='get_bookings'),

]
