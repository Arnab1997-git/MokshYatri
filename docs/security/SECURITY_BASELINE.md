# Security Baseline

## Purpose

This document establishes the baseline security posture of Moksh Yatri V1.

---

## Authentication

Provider:

* Supabase Auth

Capabilities:

* Signup
* Login
* Session Management

---

## Authorization

Roles:

### CUSTOMER

Access:

* Customer dashboard
* Personal data
* AI tools

Restrictions:

* No admin access

### ADMIN

Access:

* Admin portal
* Operational systems
* Customer management

---

## Route Protection

Protected Areas:

* /dashboard/*
* /admin/*

Public Areas:

* Homepage
* Hidden Gems
* Community
* Dream Trips

---

## Secrets Management

Sensitive values stored using:

* Environment variables

Examples:

* Supabase keys
* Groq API key

---

## Database Security

Platform uses Supabase.

Current protections:

* Authentication checks
* Role validation

Future Review Required:

* Full RLS audit
* Permission audit

---

## API Security

Current APIs:

* AI Advisor
* AI Itinerary Generator

Future Reviews:

* Rate limiting
* Abuse prevention
* Monitoring

---

## File Upload Security

Current state:

* Limited upload functionality

Future Review Required:

* File validation
* Malware scanning
* Content restrictions

---

## Future Security Priorities

### V2

* Full OWASP review
* RLS validation
* Security audit automation
* Penetration testing
* Rate limiting
* Audit logging
