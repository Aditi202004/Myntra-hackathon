from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from .serializers import UserSerializer, PostSerializer, VoteSerializer
from .models import User, Post, Vote
import jwt, datetime
from datetime import datetime, timezone, timedelta
from django.http import JsonResponse
import pandas as pd 
import logging


# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User Not Found')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')
        
        payload = {
            'id': user.id,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=60),
            'iat': datetime.now(timezone.utc)
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }

        request.session['session_key'] = user.id  # added
        return response
    
class UserView(APIView):
    def get_user_from_token(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        # added
        session_key = request.session.get('session_key')
        if not session_key:
            raise AuthenticationFailed('Session key not found. Login again.')

        user = User.objects.filter(id=session_key).first() # changed
        if not user:
            raise AuthenticationFailed('User not found')

        return user

    def get(self, request):
        user = self.get_user_from_token(request)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        del request.session['session_key']
        response.data = {
            'message': 'success'
        }
        return response


class PostView(generics.CreateAPIView):
    serializer_class = PostSerializer
    def post(self, request):
        user_view = UserView()
        user = user_view.get_user_from_token(request)

        # Add the user ID to the request data
        request.data['user'] = user.id
        request.data['activated'] = True

        # Serialize and save the post
        serializer = PostSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            latest = user.latest_post
            today = datetime.now().date()
            if (today - latest).days > 1:
                user.streak = 0

            if (today - latest).days == 1:
                user.streak += 1
                user.points += 1

            user.latest_post = today
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




logger = logging.getLogger(__name__)

class FilteredDataView(APIView):
    def get(self, request, field_name):
        print(field_name)
        allowed_fields = ['votes', 'date_created', 'none']

        if field_name and field_name not in allowed_fields:
            return JsonResponse({'error': 'Invalid field name'}, status=400)

        if not field_name or field_name == 'none':
            filtered_objects = Post.objects.filter(activated=True).select_related('user')
        elif field_name == 'votes':
            filtered_objects = Post.objects.filter(activated=True).order_by('-votes').select_related('user')
        elif field_name == 'date_created':
            filtered_objects = Post.objects.filter(activated=True).order_by('-date_created').select_related('user')

        user_id = request.session.get('session_key')

        data = []
        for post in filtered_objects:
            already_voted = Vote.objects.filter(user=user_id, post=post.id).exists()
            post_data = {
                'id': post.id,
                'user_id': post.user.id,
                'user_name': post.user.name,
                'images': post.images.url,
                'caption': post.caption,
                'votes': post.votes,
                'date_created': post.date_created,
                'already_voted': already_voted,
                'activated': post.activated
            }
            data.append(post_data)

        logger.debug(f'Returned data: {data}')
        return JsonResponse(data, safe=False)


class PersonalPostsView(APIView):
    def get(self, request):

        user_id = request.session['session_key']

        all_posts = Post.objects.filter(user=user_id).select_related('user')

        data = []
        for post in all_posts:
            already_voted = Vote.objects.filter(user=user_id, post=post.id).exists()
            post_data = {
                'id': post.id,
                'user_id': post.user.id,
                'user_name': post.user.name,
                'images': post.images.url,
                'caption': post.caption,
                'votes': post.votes,
                'date_created': post.date_created,
                'already_voted': already_voted,
                'activated': post.activated
            }
            data.append(post_data)

        return JsonResponse(data, safe=False)



class UpdateVotes(APIView):
    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        user_id = request.session['session_key']
        already_voted = Vote.objects.filter(user=user_id, post=post_id).exists()

        if not already_voted:
            post.votes += 1
            post.save()

            data = {
                'user': user_id,
                'post': post_id
            }
            serializer1 = VoteSerializer(data=data)
            serializer1.is_valid(raise_exception=True)
            serializer1.save()


        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdatePoints(APIView):
    def post(self, request):
        user_id = request.session['session_key']
        try:
            user = User.objects.get(id=user_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        to_ret = user.points
        user.points = 0
        user.save()

        data = {
            'amt': to_ret
        }

        serializer = UserSerializer(user)
        return Response(data, status=status.HTTP_200_OK)
    

class InitializeView(APIView):
    def post(self, request):
        users = User.objects.all()
        for user in users:
            today = datetime.now().date()
            latest = user.latest_post
            if (today - latest).days > 1:
                user.streak = 0
            user.save()

        posts = Post.objects.all()
        for post in posts:
            if datetime.now().year == post.date_created.year:
                date_dict = {'Date': [post.date_created, datetime.now().date()]}
                df = pd.DataFrame.from_dict(date_dict)
                df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
                df.astype('int64').dtypes
                week_number = df['Date'].dt.isocalendar().week

                if week_number.iloc[0] != week_number.iloc[1]:
                    post.activated = False

        data = {
            'message': 'success'
        }

        return Response(data, status=status.HTTP_200_OK)

