# Moksh Yatri AI Context

## Project Overview

Moksh Yatri is an AI-powered travel platform focused on cinematic journeys, personalized travel recommendations, hidden gems, community travel stories, and intelligent travel planning.

The platform contains:

* Public website
* Customer portal
* Admin portal
* AI travel advisor
* AI itinerary generator

---

## Documentation

Before making architectural decisions, review:

* ../docs/product/VISION.md
* ../docs/architecture/SYSTEM_OVERVIEW.md
* ../docs/database/DATABASE_SCHEMA.md
* ../docs/release-notes/V1_RELEASE.md
* ../docs/security/SECURITY_BASELINE.md

---

## Technology Stack

Frontend:

* Next.js 16
* React
* TypeScript
* Tailwind CSS

Backend:

* Next.js API Routes
* Supabase

AI:

* Groq

Deployment:

* Vercel

---

## Current Branch Strategy

main:

* Production branch
* Protected branch
* Connected to Vercel production deployment

v2-development:

* Active development branch
* All V2 work happens here

---

## Development Principles

1. Understand existing architecture before changing code.

2. Prefer extending existing services over creating duplicate services.

3. Maintain separation between:

   * Public Website
   * Customer Portal
   * Admin Portal

4. Avoid breaking existing production functionality.

5. Keep TypeScript strict and build-clean.

6. Always ensure:

   * npm run build succeeds
   * No TypeScript errors
   * No route protection regressions

---

## AI Audit Priorities

When reviewing the repository, prioritize:

1. Architecture improvements
2. Security improvements
3. Performance improvements
4. Database design improvements
5. AI feature enhancements
6. Developer experience improvements

---

## V2 Objectives

Potential future goals:

* Multi-agent AI architecture
* Advanced recommendation engine
* AI-assisted quotation generation
* CRM intelligence
* Travel timeline management
* Analytics dashboard
* Automated workflows

Provide recommendations incrementally and avoid unnecessary rewrites.
