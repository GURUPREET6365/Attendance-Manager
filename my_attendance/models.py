from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create your models here.
class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    date = models.DateField(default=date.today)

    day = models.IntegerField()
    
    month = models.IntegerField()

    is_present = models.BooleanField(default=False)

    is_school_off = models.BooleanField(default=False, null=True)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.first_name} - {self.date}"
    