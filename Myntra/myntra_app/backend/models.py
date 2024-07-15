from django.db import models
from django.contrib.auth.models import AbstractUser
import os

# Create your models here.
class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = None
    streak = models.IntegerField(default=0)
    created_at = models.DateField(auto_now_add=True)
    latest_post = models.DateField(auto_now=True)
    points = models.IntegerField(default=0)  

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


def file_path(instance, filename):
    user_id = str(instance.user.id)
    filename = f"{user_id}_{filename}"
    return os.path.join('static/images/', filename)


class Post(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    images = models.ImageField(upload_to=file_path)
    caption = models.TextField(max_length=500)
    votes = models.IntegerField(default=0)
    date_created = models.DateField(auto_now_add=True)
    activated = models.BooleanField(default=True)


class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'post')  # Ensure each user can vote only once on each post