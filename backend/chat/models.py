from django.db import models

class ChatSession(models.Model):
    LANGUAGE_CHOICES = [('en', 'English'), ('ar', 'Arabic'), ('fr', 'French')]
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='en')
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.id} - {self.language}"

class ChatMessage(models.Model):
    ROLE_CHOICES = [('user', 'User'), ('assistant', 'Assistant')]
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role}: {self.content[:50]}"