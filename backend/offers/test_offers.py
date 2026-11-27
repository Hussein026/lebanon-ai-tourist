from rest_framework.test import APITestCase


class OfferTests(APITestCase):
    def test_guest_gets_a_list(self):
        r = self.client.get('/api/offers/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(list(r.data), [])