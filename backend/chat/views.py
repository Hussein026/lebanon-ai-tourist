import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ChatSession, ChatMessage
from hotels.models import Hotel
from restaurants.models import Restaurant
from places.models import Place

def get_lebanon_context():
    hotels = Hotel.objects.all()[:5]
    restaurants = Restaurant.objects.all()[:5]
    places = Place.objects.all()[:5]
    
    context = "You are an AI tourist guide for Lebanon. Here is some data about Lebanon:\n\n"
    
    context += "HOTELS:\n"
    for h in hotels:
        context += f"- {h.name} in {h.governorate}, {h.stars} stars, {h.price_range}\n"
    
    context += "\nRESTAURANTS:\n"
    for r in restaurants:
        context += f"- {r.name} in {r.governorate}, {r.cuisine_type}, {r.price_range}\n"
    
    context += "\nPLACES:\n"
    for p in places:
        context += f"- {p.name} in {p.governorate}, {p.category}\n"
    
    context += "\nAnswer in the same language the tourist uses. Be helpful, friendly and specific about Lebanon."
    return context

@api_view(['POST'])
def chat(request):
    message = request.data.get('message', '')
    session_id = request.data.get('session_id', None)
    
    if not message:
        return Response({'error': 'No message provided'}, status=400)
    
    # Get or create session
    if session_id:
        try:
            session = ChatSession.objects.get(id=session_id)
        except:
            session = ChatSession.objects.create()
    else:
        session = ChatSession.objects.create()
    
    # Save user message
    ChatMessage.objects.create(session=session, role='user', content=message)
    
    # Get context from database
    context = get_lebanon_context()
    
    # Call Ollama
    try:
        response = requests.post('http://localhost:11434/api/generate', json={
            'model': 'llama3.2',
            'prompt': f"{context}\n\nTourist: {message}\nAI Guide:",
            'stream': False
        })
        ai_response = response.json()['response']
    except Exception as e:
        ai_response = "Sorry, AI service is currently unavailable."
    
    # Save AI response
    ChatMessage.objects.create(session=session, role='assistant', content=ai_response)
    
    return Response({
        'session_id': session.id,
        'message': ai_response
    })