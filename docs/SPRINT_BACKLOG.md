# Sprint Backlog - LebanonAI

## User stories

| ID | User story | Status |
|----|-----------|--------|
| FR-01/02 | As a user, I register and choose my segment (tourist, student, retired) | Done |
| FR-03/04 | As a user, I search and filter hotels, restaurants, places and activities | Done |
| FR-05 | As a user, I see all listings on a map | Done |
| FR-06/07 | As a user, I ask the AI and get answers from stored listings, adapted to my segment | Done |
| FR-08/09/10 | As a user, I book, open WhatsApp, and see My Bookings | Done |
| FR-11 | As a user, I rate and review listings | Done |
| FR-12 | As a user, I see offers for my segment | Done |
| FR-13 | As a user, I listen to a voice guide | Done |
| FR-15 | As a user, I see hiking routes | Done |
| FR-19 | As a retired user, I filter by accessibility | Done |
| FR-17 | As the Ministry, I see bookings and users per segment (role protected) | In progress (branch feature/dashboard-role) |
| FR-16 | As a user, I switch the interface to Arabic or French | Not done |
| FR-18 | As an admin, I manage listings | Not done |

## Technical issues

| Issue | Status |
|-------|--------|
| .env and db.sqlite3 were tracked in Git, now removed | Done |
| Dashboard API was open to everyone, fixed with a Ministry role | In progress |
| Page titles hidden under the navbar | Done |
| Fresh clone setup (migrate + loaddata) documented in README | Done |
| Secret key still in settings.py | Open |
| Listings must be verified against real sources | Open |

## Removed from scope

Photo recognition (FR-14), PostgreSQL, Cloudinary, public online URL.
