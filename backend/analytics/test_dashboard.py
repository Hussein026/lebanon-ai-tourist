from django.contrib.auth.models import Group, User
from rest_framework.test import APITestCase

from bookings.models import Booking


class DashboardRoleTests(APITestCase):
    def setUp(self):
        self.tourist = User.objects.create_user('tourist_t', 't@test.com', 'Strong#Pass9271')
        self.ministry = User.objects.create_user('ministry_t', 'm@test.com', 'Strong#Pass9271')
        self.ministry.groups.add(Group.objects.create(name='ministry'))
        self.admin = User.objects.create_superuser('admin_t', 'a@test.com', 'Strong#Pass9271')
        self.booking = Booking.objects.create(
            user=self.tourist, booking_type='hotel', item_id=1, item_name='Test Hotel',
            full_name='Test User', email='t@test.com', phone='+96170123456')

    def test_guest_gets_401(self):
        self.assertEqual(self.client.get('/api/analytics/dashboard/').status_code, 401)

    def test_normal_user_gets_403(self):
        self.client.force_authenticate(self.tourist)
        self.assertEqual(self.client.get('/api/analytics/dashboard/').status_code, 403)

    def test_ministry_user_gets_200_with_segments(self):
        self.client.force_authenticate(self.ministry)
        r = self.client.get('/api/analytics/dashboard/')
        self.assertEqual(r.status_code, 200)
        self.assertIn('users_per_segment', r.data)
        self.assertEqual(r.data['totals']['bookings'], 1)

    def test_superuser_gets_200(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get('/api/analytics/dashboard/').status_code, 200)

    def test_normal_user_cannot_change_booking_status(self):
        self.client.force_authenticate(self.tourist)
        url = '/api/analytics/bookings/%d/status/' % self.booking.id
        self.assertEqual(self.client.patch(url, {'status': 'confirmed'}, format='json').status_code, 403)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, 'pending')

    def test_ministry_can_change_booking_status(self):
        self.client.force_authenticate(self.ministry)
        url = '/api/analytics/bookings/%d/status/' % self.booking.id
        self.assertEqual(self.client.patch(url, {'status': 'confirmed'}, format='json').status_code, 200)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, 'confirmed')