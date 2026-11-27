from unittest.mock import Mock, patch

import requests
from rest_framework.test import APITestCase

from chat.views import NO_INFO_START, UNAVAILABLE, ask_model, clean_answer, tokens

ITEMS = [{'line': '- [hotel] Test Hotel | Beirut'}]


class ChatApiTests(APITestCase):
    def test_empty_message_is_refused(self):
        r = self.client.post('/api/chat/', {'message': '   '}, format='json')
        self.assertEqual(r.status_code, 400)


class ChatHelperTests(APITestCase):
    def test_clean_answer_hides_internal_word(self):
        out = clean_answer('Based on the FACTS, there is one hotel.')
        self.assertNotIn('FACTS', out)

    def test_no_information_answer_is_detected(self):
        self.assertTrue(NO_INFO_START.match("I don't have information about that."))

    def test_stopwords_are_ignored(self):
        self.assertEqual(tokens('tell me about hotels'), {'hotel'})

    @patch('chat.views.requests.post', side_effect=requests.exceptions.ConnectionError)
    def test_ai_down_gives_safe_message(self, _post):
        text, ok = ask_model('hello', ITEMS, 'tourist')
        self.assertEqual(text, UNAVAILABLE)
        self.assertFalse(ok)

    @patch('chat.views.requests.post')
    def test_ai_answer_is_returned(self, post):
        resp = Mock()
        resp.json.return_value = {'message': {'content': 'One hotel: Test Hotel.'}}
        post.return_value = resp
        text, ok = ask_model('hotels', ITEMS, 'tourist')
        self.assertTrue(ok)
        self.assertIn('Test Hotel', text)