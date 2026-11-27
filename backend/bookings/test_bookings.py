from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from bookings.models import Booking


def payload(**changes):
    data = {'booking_type': 'hotel', 'item_id': 1, 'item_name': 'Test Hotel',
            'full_name': 'Test User', 'email': 't@test.com', 'phone': '+96170123456'}
    data.update(changes)
    return data


class BookingTests(APITestCase):
    def setUp(self):
        self.a = User.objects.create_user('user_a', 'a@test.com', 'Strong#Pass9271')
        self.b = User.objects.create_user('user_b', 'b@test.com', 'Strong#Pass9271')

    def test_guest_cannot_book(self):
        self.assertEqual(self.client.post('/api/bookings/', payload(), format='json').status_code, 401)

    def test_valid_booking_is_pending(self):
        self.client.force_authenticate(self.a)
        r = self.client.post('/api/bookings/', payload(), format='json')
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data['status'], 'pending')

    def test_user_cannot_set_own_status(self):
        self.client.force_authenticate(self.a)
        r = self.client.post('/api/bookings/', payload(status='confirmed'), format='json')
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data['status'], 'pending')

    def test_zero_guests_refused(self):
        self.client.force_authenticate(self.a)
        self.assertEqual(self.client.post('/api/bookings/', payload(guests=0), format='json').status_code, 400)

    def test_checkout_before_checkin_refused(self):
        self.client.force_authenticate(self.a)
        r = self.client.post('/api/bookings/', payload(check_in='2026-12-10', check_out='2026-12-05'), format='json')
        self.assertEqual(r.status_code, 400)

    def test_bad_phone_refused(self):
        self.client.force_authenticate(self.a)
        self.assertEqual(self.client.post('/api/bookings/', payload(phone='abc'), format='json').status_code, 400)

    def test_user_sees_only_own_bookings(self):
        Booking.objects.create(user=self.a, **payload())
        self.client.force_authenticate(self.b)
        r = self.client.get('/api/bookings/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.data), 0)