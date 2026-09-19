from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error': 'All fields are required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered.'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'Account created successfully.',
        'user': {'id': user.id, 'username': user.username, 'email': user.email},
        'tokens': tokens
    }, status=201)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required.'}, status=400)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials.'}, status=401)

    if not user.check_password(password):
        return Response({'error': 'Invalid credentials.'}, status=401)

    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'Login successful.',
        'user': {'id': user.id, 'username': user.username, 'email': user.email},
        'tokens': tokens
    })


@api_view(['GET'])
def profile(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Not authenticated.'}, status=401)
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined
    })