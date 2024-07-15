from django.urls import path
from .views import index

urlpatterns = [
    path('', index), # two buttons - Register, Login
    path('login', index),
    path('register', index),
    path('profile', index), # changes
    path('upload', index), # to_make
    path('vote', index), # no need...make card only (horizontal)
    path('voucher', index), # to make
    path('your-posts', index), # no need
    path('view', index), # to make square card
]