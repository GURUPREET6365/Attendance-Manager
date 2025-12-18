from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    date = models.DateField(auto_now_add=True)

    day = models.IntegerField()


    month = models.IntegerField()

    is_present = models.BooleanField(default=False)

    def __str__(self):
        return self.user.first_name