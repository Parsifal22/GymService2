from django.db import models


class GymBooking(models.Model):
    selected_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
