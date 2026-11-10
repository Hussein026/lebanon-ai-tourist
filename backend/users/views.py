from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile

SEGMENTS = ['tourist', 'student', 'retired']


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


def user_data(user):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'segment': user.profile.segment if hasattr(user, 'profile') else 'tourist',
    }


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    segment = request.data.get('segment', 'tourist')

    if not username or not email or not password:
        return Response({'error': 'All fields are required.'}, status=400)
    if segment not in SEGMENTS:
        return Response({'error': 'Invalid segment.'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered.'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    UserProfile.objects.create(
        user=user,
        segment=segment,
        nationality=request.data.get('nationality', ''),
        university=request.data.get('university', '') if segment == 'student' else '',
        student_id=request.data.get('student_id', '') if segment == 'student' else '',
        health_conditions=request.data.get('health_conditions', '') if segment == 'retired' else '',
        mobility_issues=bool(request.data.get('mobility_issues', False)) if segment == 'retired' else False,
    )
    return Response({
        'message': 'Account created successfully.',
        'user': user_data(user),
        'tokens': get_tokens_for_user(user),
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

    UserProfile.objects.get_or_create(user=user)
    user.refresh_from_db()
    return Response({
        'message': 'Login successful.',
        'user': user_data(user),
        'tokens': get_tokens_for_user(user),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    p, _ = UserProfile.objects.get_or_create(user=user)
    # Private fields are returned only to the owner (NFR-06)
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'segment': p.segment,
        'nationality': p.nationality,
        'university': p.university,
        'student_id': p.student_id,
        'health_conditions': p.health_conditions,
        'mobility_issues': p.mobility_issues,
        'date_joined': user.date_joined,
    })
