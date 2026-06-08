# Moksh Yatri V2 Audit Action Plan

Based on:
- Architecture Audit 001
- V1 Release Review

---

# Phase 1 — Security & Stability

## High Priority

- [ ] Verify all Supabase RLS policies
- [ ] Document RLS rules in docs/security/
- [ ] Add authentication checks to AI routes
- [ ] Add rate limiting to Groq endpoints
- [ ] Add request validation for AI APIs
- [ ] Protect profiles.role from modification
- [ ] Update DATABASE_SCHEMA.md to match reality
- [ ] Add GitHub Actions build check

Goal:
Create a secure V2 foundation.

---

# Phase 2 — Architecture Cleanup

## High Priority

- [ ] Create src/types/
- [ ] Add shared database types
- [ ] Remove duplicated profile functions
- [ ] Consolidate recommendation logic
- [ ] Rename dashboard/[id] route
- [ ] Standardize admin vs user service naming

Goal:
Reduce technical debt before V2 features.

---

# Phase 3 — AI & Intelligence

## Planned

- [ ] Shared AI module
- [ ] Recommendation feedback engine
- [ ] AI quotation assistant
- [ ] Personalized travel memory
- [ ] Multi-agent architecture research

Goal:
Transform Moksh Yatri into an AI-first travel platform.

---

# Phase 4 — Automation

## Planned

- [ ] Timeline event persistence
- [ ] Notification system redesign
- [ ] CRM automation
- [ ] Analytics engine
- [ ] Workflow orchestration

Goal:
Create an intelligent travel operating system.