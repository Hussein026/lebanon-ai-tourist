# User Stories - LebanonAI

Format: As a [user], I want [goal], so that [benefit].

| ID | User story | Acceptance criteria | Status |
|----|-----------|---------------------|--------|
| US-01 (FR-01, FR-02) | As a visitor, I want to register and choose my segment (tourist, student, retired), so that the platform adapts to me. | Register form has a segment picker. Student sees university fields, retired sees health fields. After registering I am logged in. Weak passwords and bad emails are refused. | Done |
| US-02 (FR-03, FR-04) | As a tourist, I want to search and filter hotels, restaurants, places and activities, so that I find what fits me. | Search and filters return correct results. Each listing shows name, description, location, price and photo. | Done |
| US-03 (FR-05) | As a tourist, I want to see listings on a map, so that I know where they are. | All 60 listings have a marker. Clicking a marker shows its details. | Done |
| US-04 (FR-06) | As a tourist, I want to ask the AI about Lebanon, so that I get answers fast. | Answers use stored listings, up to 5 results, in English. If no data exists, the AI says it has no information. | Done |
| US-05 (FR-07) | As a student or retired user, I want recommendations for my segment, so that I see relevant places. | Student sees low price and student offers. Retired sees accessible places. | Done |
| US-06 (FR-08, FR-09) | As a logged-in user, I want to send a booking request and open WhatsApp, so that the provider receives it. | Booking is saved with status pending. WhatsApp opens with a prepared message. A guest is asked to sign in. Only 10 of 60 listings have a WhatsApp number. | Done |
| US-07 (FR-10) | As a user, I want to see my bookings, so that I can follow them. | My Bookings shows only my own bookings. | Done |
| US-08 (FR-11) | As a user, I want to rate and review a listing, so that others can decide. | Rating 1-5 and a comment are saved. Average rating shows on the listing. | Done |
| US-09 (FR-12) | As a student, I want to see offers for my segment, so that I save money. | Offers show with validity dates. Only offers for my segment appear. Offers are SAMPLE offers. | Done |
| US-10 (FR-13) | As a tourist, I want a voice guide, so that I can listen to a place description. | Audio plays on the place page. Available for 10 of 34 places only. | Done (10 places) |
| US-11 (FR-15) | As a tourist, I want to see hiking routes, so that I can plan a hike. | Each route shows distance, difficulty and a line on the map. | Done |
| US-12 (FR-19) | As a retired user, I want an accessibility filter, so that I see places I can visit. | Filter by accessibility and mobility works. Accessibility data exists for 3 hotels only. | Done |
| US-13 (FR-17) | As the Ministry, I want a dashboard with bookings, popular places and users per segment, so that I understand usage. | Only Ministry accounts can open it. Guests get 401, other users get 403 and see Access denied. | Done |
| US-14 (FR-16) | As a user, I want the interface in English, Arabic and French, so that I use my language. | Language switch changes the labels. | Not done |
| US-15 (FR-18) | As an administrator, I want to add, edit and delete listings, so that data stays correct. | Admin can add, edit and delete hotels, restaurants, places and activities in the admin site. | Done |