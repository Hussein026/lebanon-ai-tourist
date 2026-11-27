from rest_framework.test import APITestCase


class RecommendationTests(APITestCase):
    def test_guest_gets_default_tourist_list(self):
        r = self.client.get('/api/recommendations/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data['segment'], 'tourist')
        self.assertFalse(r.data['personalised'])
        self.assertEqual(len(r.data['groups']), 4)