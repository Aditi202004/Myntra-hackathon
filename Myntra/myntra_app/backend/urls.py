from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, PostView, FilteredDataView, UpdateVotes, UpdatePoints, InitializeView, PersonalPostsView

urlpatterns = [
    path('initialize', InitializeView.as_view()),
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('post', PostView.as_view()),
    path('personal-posts', PersonalPostsView.as_view()),
    path('get-data/<str:field_name>/', FilteredDataView.as_view(), name='get-data'),
    path('update-votes/<int:post_id>/', UpdateVotes.as_view(), name='update-votes'),
    path('update-points', UpdatePoints.as_view()),
]