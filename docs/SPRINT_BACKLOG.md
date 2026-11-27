# Sprint Backlog - LebanonAI

## User stories

| ID | User story | Status |
|----|-----------|--------|
| FR-01/02 | As a user, I register and choose my segment (tourist, student, retired) | Done |
| FR-03/04 | As a user, I search and filter hotels, restaurants, places and activities | Done |
| FR-05 | As a user, I see all listings on a map | Done (60 pins) |
| FR-06/07 | As a user, I ask the AI and get answers from stored listings, adapted to my segment | Done (English only, up to 5 results per answer) |
| FR-08/09/10 | As a user, I book, open WhatsApp, and see My Bookings | Done |
| FR-11 | As a user, I rate and review listings | Done |
| FR-12 | As a user, I see offers for my segment | Done (sample offers) |
| FR-13 | As a user, I listen to a voice guide | Done for 10 places only |
| FR-15 | As a user, I see hiking routes | Done |
| FR-19 | As a retired user, I filter by accessibility | Done |
| FR-17 | As the Ministry, I see bookings and users per segment (role protected) | Done (PR #3) |
| FR-18 | As an admin, I add, edit and delete listings | Done (Django admin, tested) |
| FR-16 | As a user, I switch the interface to Arabic or French | Not done |

## Technical issues

| Issue | Status |
|-------|--------|
| .env and db.sqlite3 were tracked in Git, now removed and ignored | Done (old .env still in Git history) |
| Python cache files were tracked in Git, now removed and ignored | Done |
| Dashboard API was open to everyone, fixed with a Ministry role | Done |
| Secret key moved from settings.py to backend/.env | Done |
| Input validation on register and bookings | Done |
| Page titles hidden under the navbar | Done |
| Home page showed fake numbers and features we do not have | Done |
| Docker: backend and frontend start with docker compose | Done (Ollama stays on the host laptop, fresh-clone test not run) |
| Unit tests: 31 tests for register, login, dashboard role, bookings, chat, offers | Done |
| README with architecture, services, API list and run steps | Done (fresh-clone steps not tested) |
| AI answer speed reduced (about 3 to 12 s warm, about 30 s after restart) | Done |
| 20 AI test questions (16 must be correct) | Open |
| User guide and test report | Open |
| Listings must be verified against real sources | Open |
| Kanaan Boutique Hotel and Palmyra Hotel: decide to keep or remove | Open |

## Pull requests

PR #1 to #10 are on GitHub, all opened by Hussein026. Early work (phases 1 to 4) went straight into develop without branches. From the dashboard work on, each change has its own branch and pull request.

## Removed from scope

Photo recognition (FR-14), PostgreSQL, Cloudinary, public online URL, online payments, mobile app. This also drops AC-11, NFR-05 and NFR-09.