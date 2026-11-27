from django.contrib.auth.models import User
from rest_framework.test import APITestCase

GOOD = {'username': 'new_user1', 'email': 'new1@test.com',
        'password': 'Strong#Pass9271', 'segment': 'tourist'}


class RegisterTests(APITestCase):
    def post(self, **changes):
        data = dict(GOOD)
        data.update(changes)
        return self.client.post('/api/auth/register/', data, format='json')

    def test_register_ok(self):
        r = self.post()
        self.assertEqual(r.status_code, 201)
        self.assertIn('access', r.data['tokens'])
        self.assertTrue(User.objects.filter(username='new_user1').exists())

    def test_bad_email_is_refused(self):
        r = self.post(email='bad')
        self.assertEqual(r.status_code, 400)
        self.assertFalse(User.objects.filter(username='new_user1').exists())

    def test_weak_password_is_refused(self):
        self.assertEqual(self.post(password='123').status_code, 400)

    def test_short_username_is_refused(self):
        self.assertEqual(self.post(username='x1').status_code, 400)

    def test_invalid_segment_is_refused(self):
        self.assertEqual(self.post(segment='king').status_code, 400)

    def test_duplicate_username_is_refused(self):
        self.assertEqual(self.post().status_code, 201)
        self.assertEqual(self.post(email='other@test.com').status_code, 400)


class LoginAndProfileTests(APITestCase):
    def setUp(self):
        User.objects.create_user('maria', 'maria@test.com', 'Strong#Pass9271')

    def test_login_ok(self):
        r = self.client.post('/api/auth/login/', {'username': 'maria', 'password': 'Strong#Pass9271'}, format='json')
        self.assertEqual(r.status_code, 200)
        self.assertIn('access', r.data['tokens'])

    def test_wrong_password_gives_401(self):
        r = self.client.post('/api/auth/login/', {'username': 'maria', 'password': 'wrong'}, format='json')
        self.assertEqual(r.status_code, 401)

    def test_profile_needs_login(self):
        self.assertEqual(self.client.get('/api/auth/profile/').status_code, 401)

    def test_profile_returns_own_data(self):
        self.client.force_authenticate(User.objects.get(username='maria'))
        r = self.client.get('/api/auth/profile/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data['username'], 'maria')