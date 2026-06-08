# Moksh Yatri System Overview

## Overview

Moksh Yatri is an AI-powered travel platform built using Next.js, Supabase, Groq AI, and Vercel.

The platform provides:

- Public travel discovery
- Customer travel management
- Admin travel operations
- AI-powered travel assistance

---

# High-Level Architecture

User
↓
Next.js Frontend
↓
Supabase
↓
Database

AI Features
↓
Groq API

Deployment
↓
Vercel

---

# Technology Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Framer Motion

---

## Backend

Current architecture uses:

- Next.js API Routes
- Supabase Services

Examples:

- AI Advisor API
- Itinerary Generator API
- Customer Services
- Admin Services

---

## Database

Platform database is hosted on Supabase.

Core entities:

- Profiles
- Leads
- Quotations
- Bookings
- Payments
- Hidden Gems
- Community Stories
- Notifications

---

## Authentication

Authentication is handled using:

- Supabase Auth

Supported roles:

### CUSTOMER

Customer portal access

### ADMIN

Administrative portal access

---

## Customer Portal

Main modules:

- Dashboard
- Profile
- Leads
- Quotations
- Bookings
- AI Advisor
- Notifications
- Saved Gems

---

## Admin Portal

Main modules:

- Dashboard
- Leads
- Customers
- Quotations
- Bookings
- Payments
- Hotel Allocation
- Vehicle Allocation
- Reviews
- Activity Monitoring

---

## AI Components

### AI Travel Advisor

Provides travel guidance using:

- Travel Style
- Travel Personality
- User Question

Powered by Groq.

---

### AI Itinerary Generator

Generates:

- Multi-day itineraries
- Hidden gem recommendations
- Travel tips
- Photography spots
- Food suggestions

Powered by Groq.

---

## Deployment

Production Environment:

- Vercel

Source Control:

- GitHub

Branches:

- main
- v2-development

Stable Release:

- v1.0.0