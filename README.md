# 🏡 Flex Living — Reviews Dashboard

## Developer Assessment Submission

Author: Ruolph Peterside
Stack: FastAPI (Backend) · Next.js + Tailwind (Frontend) · TypeScript · Mocked Hostaway Integration

# 📘 Overview

The Flex Living Reviews Dashboard is a full-stack web application that helps property managers monitor and manage guest feedback across listings.

It integrates with (mocked) Hostaway Reviews API, normalizes data, and provides a modern Manager Dashboard to filter, analyze, and approve reviews for public display.

# ⚙️ Tech Stack
| Layer           | Technology                                | Purpose                                          |
| --------------- | ----------------------------------------- | ------------------------------------------------ |
| **Frontend**    | Next.js 14 (React + TypeScript)           | Manager dashboard UI, property review display    |
| **Styling**     | Tailwind CSS, shadcn/ui                   | Clean, modern, and responsive layout             |
| **Backend**     | FastAPI (Python)                          | REST API to fetch, normalize, and manage reviews |
| **Data Layer**  | JSON-based mock + `approved_reviews.json` | Temporary persistence for approved reviews       |
| **Integration** | Hostaway Sandbox API (mocked)             | Review source simulation                         |
| **Utilities**   | Axios / Fetch Hooks                       | API integration & state management               |

# 🚀 Local Setup
## Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

## Frontend
cd frontend
npm install
npm run dev

# 📡 API Overview
All routes are prefixed with /api/v1/.
| Method    | Endpoint                             | Description                                            |                       |
| --------- | ------------------------------------ | ------------------------------------------------------ | --------------------- |
| **GET**   | `/reviews`                           | Fetch all reviews (wrapper: `{status, count, result}`) |                       |
| **GET**   | `/reviews/hostaway`                  | Fetch and normalize Hostaway reviews (mocked data)     |                       |
| **GET**   | `/reviews/property/{property_id}`    | Fetch **approved** reviews for a given property        |                       |
| **GET**   | `/reviews/analytics`                 | Basic analytics: average rating, category trends       |                       |
| **GET**   | `/reviews/stats`                     | Summary stats: count by status/category/source         |                       |
| **PATCH** | `/reviews/{id}`                      | Update review status (approve/reject)                  |                       |
| **PUT**   | `/reviews/{id}/approve?approved=true | false`                                                 | Toggle approval state |
| **GET**   | `/hostaway/hostaway`                 | (Alias) Returns mocked Hostaway dataset                |                       |

# 🧩 Data Model (Normalized Review)
{
  "id": 7453,
  "listingName": "2B N1 A - 29 Shoreditch Heights",
  "guestName": "Shane Finkelstein",
  "rating": 10,
  "publicReview": "Shane and family are wonderful! Would definitely host again :)",
  "reviewCategory": [
    {"category": "cleanliness", "rating": 10},
    {"category": "communication", "rating": 10},
    {"category": "respect_house_rules", "rating": 10}
  ],
  "submittedAt": "2020-08-21T22:45:14",
  "review_type": "host-to-guest",
  "status": "published",
  "source": "hostaway"
}
# Manager Dashboard Features
Modern UI built with Tailwind + shadcn/ui

Filters Panel to search by property, rating, category, or source

Interactive Reviews Table with:

Inline status update (Approve / Reject)

Real-time toast feedback

Analytics Section (optional) showing performance insights

Property Review Display page — only approved reviews appear

# 🧠 Design & Logic Decisions
Mock Data Strategy:
Used JSON-based fallback (mock_reviews.json) to simulate Hostaway’s sandbox response.
Ensures consistent testing without live API dependency.

Normalization Layer:
Created a dedicated normalizer (hostaway.py) to unify review fields (rating, category, timestamps) across all sources.

Status Persistence:
Approved/Rejected reviews stored in approved_reviews.json for persistence; easily replaceable with SQLite.

Frontend Hooks:
useReviews(filters) automatically constructs API URLs, unwraps wrapper responses, and revalidates on update.

UX Considerations:
Designed dashboard to feel “manager-first”: intuitive filters, clean table view, and non-blocking feedback toasts.

# 🧾 Deliverables Summary
| Deliverable                 | Status           |
| --------------------------- | ---------------- |
| Mocked Hostaway Integration | ✅ Done           |
| Review Normalization        | ✅ Done           |
| Manager Dashboard UI        | ✅ Done           |
| Filtering & Sorting         | ✅ Done           |
| Approve / Reject Reviews    | ✅ Done           |
| Property Display Page       | ✅ Done           |
| Google Reviews Exploration  | ⚠️ Research Only |
| Documentation               | ✅ This README    |

# 🏁 Conclusion
This implementation provides a complete, functional prototype for Flex Living’s Reviews Dashboard — meeting both functional and UX expectations of the assessment.

It demonstrates robust data normalization, responsive UI design, and an intuitive manager workflow. The system is ready for further enhancements, including database persistence and authentication.
