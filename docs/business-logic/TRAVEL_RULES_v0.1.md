# Moksh Yatri — Travel Business Rules (Draft)

**Document status:** Draft  
**Version:** 0.1  
**Last updated:** June 8, 2026  
**Derived from:** Business Logic Audit 001, Architecture Audit 001, Audit Action Plan  

---

## Purpose

This document defines the **official business rules** for Moksh Yatri’s travel operations workflow. It translates audit findings into clear rules that the whole organization can follow and that future product work can enforce consistently.

**Intended audience:**

- Business owners and leadership  
- Travel consultants and sales staff  
- Operations, finance, and hotel/transport coordinators  
- Developers and AI agents implementing or validating platform behavior  

**Canonical journey:**

```
Lead → Quotation → Booking → Hotel Allocation → Vehicle Allocation
     → Payment → Ready to Travel → Trip → Review
```

This draft describes **what should happen** in the business. It does not prescribe databases, code, or screens.

---

## How to Read Each Rule

| Field | Meaning |
|-------|---------|
| **Rule ID** | Stable reference (e.g. `LEAD-003`) |
| **Description** | What the business requires |
| **Validation** | How to check the rule is satisfied |
| **Example** | Realistic scenario |
| **Exception** | When the rule may be waived and who may approve |

---

## Shared Definitions

### Lead statuses (canonical)

| Status | Meaning |
|--------|---------|
| **NEW** | Inquiry received; not yet contacted |
| **CONTACTED** | Consultant has reached the customer |
| **FOLLOW_UP** | Awaiting customer response or decision |
| **QUOTED** | At least one quotation has been shared |
| **BOOKED** | A confirmed booking exists for this lead |
| **LOST** | Customer declined or inquiry closed without booking |
| **CLOSED** | Journey finished (e.g. trip completed and archived) |

*Note: Older documentation used terms such as QUALIFIED and CONVERTED. Those should map to the statuses above or be retired to avoid confusion.*

### Quotation statuses (canonical)

| Status | Meaning |
|--------|---------|
| **DRAFT** | Internal only; not shared with customer |
| **SENT** | Shared with customer; awaiting response |
| **ACCEPTED** | Customer agreed to this price and package |
| **DECLINED** | Customer rejected this quotation |
| **SUPERSEDED** | Replaced by a newer quotation for the same lead |
| **EXPIRED** | Validity period ended without acceptance |

### Booking statuses (canonical)

| Status | Meaning |
|--------|---------|
| **PENDING** | Booking created; payment and preparations not complete |
| **PARTIALLY_PAID** | Some payment received; balance remains |
| **CONFIRMED** | Fully paid; allocations may still be pending |
| **READY_FOR_TRAVEL** | Paid in full; hotel and vehicle requirements met |
| **IN_PROGRESS** | Customer is on the trip (travel date reached) |
| **COMPLETED** | Trip has ended |
| **CANCELLED** | Booking cancelled; trip will not proceed |

### Financial terms

- **Total amount** — Final price the customer owes for the booking (from the accepted quotation).  
- **Advance** — Amount collected when the booking is confirmed.  
- **Installment** — Any payment recorded after the advance.  
- **Total collected** — Advance plus all installments (and minus approved refunds).  
- **Outstanding balance** — Total amount minus total collected.  

---

# Lead Rules

### LEAD-001 — Minimum inquiry information

**Description**  
Every lead must capture enough information for a consultant to contact the customer and prepare a quote.

**Validation**  
Lead cannot be saved or moved to **CONTACTED** without: customer name, valid phone number, at least one traveler, and a stated destination.

**Example**  
Priya submits “Plan My Trip” with name, phone, destination “Sikkim,” and 4 travelers. The lead is valid.

**Exception**  
Walk-in or phone inquiries may be entered by admin with a note “details to follow” only for **NEW** leads; destination and travelers must be added before **QUOTED**.

---

### LEAD-002 — Destination must be identifiable

**Description**  
Every lead must reference a recognizable destination so reporting, quoting, and operations stay aligned.

**Validation**  
Destination is captured as a standard destination from the company catalog (not free text alone). Website and admin intake must resolve to the same destination list.

**Example**  
A customer types “Sikkim” on the website; the system maps it to the official **Sikkim** destination used in admin.

**Exception**  
Custom or multi-destination requests may use “Custom itinerary” with a mandatory notes field describing places; a consultant must confirm the destination list before quoting.

---

### LEAD-003 — Lead status must follow the pipeline

**Description**  
Lead status reflects where the customer is in the sales journey. Status changes must follow allowed steps.

**Validation**  
Allowed progression: **NEW → CONTACTED → FOLLOW_UP → QUOTED → BOOKED → CLOSED**, with **LOST** possible from **CONTACTED** or **QUOTED**. Skipping steps requires a documented reason.

**Example**  
After sharing a quotation, the consultant sets the lead to **QUOTED**.

**Exception**  
**BOOKED** may be set only when a booking exists (see LEAD-004). Leadership may reopen a **LOST** lead to **CONTACTED** with a reopen reason.

---

### LEAD-004 — “Booked” requires a real booking

**Description**  
A lead cannot be marked **BOOKED** unless a booking is linked to that lead.

**Validation**  
**BOOKED** status is present only when an active booking record exists with this lead as its source.

**Example**  
When quotation #108 is converted to booking #52, lead #41 automatically becomes **BOOKED**.

**Exception**  
None. If no booking exists, the lead must remain **QUOTED** or **LOST**.

---

### LEAD-005 — Quoting only on active leads

**Description**  
New quotations should be created only for leads that are still open for sale.

**Validation**  
“Create quotation” is available when lead status is **NEW**, **CONTACTED**, **FOLLOW_UP**, or **QUOTED**. It is blocked for **BOOKED**, **LOST**, and **CLOSED** unless the lead is formally reopened.

**Example**  
A lead marked **LOST** in January cannot receive a new quote in March without reopening.

**Exception**  
Repeat customers with **CLOSED** history may receive a new lead auto-created as **CONTACTED** for a new journey (see BOOK-009).

---

### LEAD-006 — Customer account linkage

**Description**  
When a customer creates an account, their past inquiries and trips should attach to them so the portal shows a complete history.

**Validation**  
On signup or profile update, the system matches open leads and bookings by phone and/or email and links them to the customer account.

**Example**  
Rahul submitted an inquiry as a guest, then signed up with the same phone. His quotation appears in “My Quotations.”

**Exception**  
If phone/email differ, a consultant may manually link the lead to the customer profile with a note.

---

### LEAD-007 — Budget and travelers must be realistic

**Description**  
Budget and party size must be non-negative and usable for planning.

**Validation**  
Travelers ≥ 1; budget, if provided, ≥ 0.

**Example**  
A lead with 0 travelers is rejected with a message to correct party size.

**Exception**  
Budget may be left blank for “flexible budget” leads; consultants note expected range in lead notes.

---

# Quotation Rules

### QUOTE-001 — Every quotation belongs to a lead

**Description**  
A quotation must trace back to a customer inquiry (lead) so sales, operations, and the customer portal stay connected.

**Validation**  
Saved quotations include a lead reference, except for approved walk-in/direct-sale cases with an identified customer profile.

**Example**  
Consultant opens “Quotation engine” from lead #41; the saved quote is tied to lead #41.

**Exception**  
Repeat direct bookings (BOOK-009) may use a system-generated lead marked as direct sale.

---

### QUOTE-002 — Party size on the quote matches the inquiry

**Description**  
The number of travelers on the quotation should match the lead unless the customer has changed their request.

**Validation**  
If quotation travelers differ from lead travelers, the consultant must confirm the change and record a reason.

**Example**  
Lead says 6 travelers; quote is built for 6. If the quote is for 4, the system warns and requires override.

**Exception**  
Customer explicitly reduces or increases party size after the lead was created; consultant updates the lead travelers when the quote is sent.

---

### QUOTE-003 — One active quotation per lead

**Description**  
At any time, only one quotation per lead may be **SENT** or **ACCEPTED**. Older versions must not compete with the current offer.

**Validation**  
When a new quotation is issued for a lead, previous open quotations become **SUPERSEDED**.

**Example**  
Quote A (₹80,000) is **SENT**. Quote B (₹95,000) is created; Quote A becomes **SUPERSEDED**.

**Exception**  
Side-by-side options (e.g. “standard vs premium package”) may be offered as separate quotes only if business policy labels one as primary and others as **DECLINED** or **SUPERSEDED** when customer chooses.

---

### QUOTE-004 — Complete pricing before sharing

**Description**  
A quotation must include a full, reliable price. Partial or incomplete cost build-up must not be sent to the customer.

**Validation**  
Quote cannot move to **SENT** if any night, location, hotel category, or vehicle day in the package cannot be priced. System shows “incomplete pricing” to the consultant.

**Example**  
A 5-night package missing hotel rates for 2 nights cannot be sent until rates are fixed.

**Exception**  
Executive-approved manual quotes may be **SENT** with “manual pricing” flag and attached cost worksheet (see Future Rule Candidates).

---

### QUOTE-005 — Quoted price is the customer-facing price

**Description**  
The price the customer accepts is the price used for booking and payment. Internal cost and profit must stay consistent when the quoted price changes.

**Validation**  
When the final customer price differs from the system-calculated selling price, profit is recalculated. Bookings use the accepted quoted price.

**Example**  
System suggests ₹100,000; consultant offers ₹90,000 after discount. Booking total is ₹90,000 and profit reflects actual margin.

**Exception**  
Promotional or loyalty discounts require a discount reason code approved by policy.

---

### QUOTE-006 — Quotation lifecycle before booking

**Description**  
Customers should see and accept a quotation before it becomes a booking.

**Validation**  
Booking is created only from a quotation in **ACCEPTED** status (or **SENT** with documented verbal acceptance noted by consultant).

**Example**  
Quote is **SENT** on Monday; customer agrees on Tuesday; consultant marks **ACCEPTED**; booking is created Wednesday.

**Exception**  
Urgent confirmed bookings: consultant may mark **ACCEPTED** with “verbal confirmation” note and customer follow-up within 24 hours.

---

### QUOTE-007 — Package must match lead destination

**Description**  
The travel package on the quotation must align with the destination the customer asked for.

**Validation**  
Package destination (or itinerary region) matches the lead’s destination, or consultant documents why a different package was proposed.

**Example**  
Lead requests Sikkim; only Sikkim-compatible packages appear by default in the quotation engine.

**Exception**  
Customer explicitly changes destination during consultation; lead destination is updated before quote is **SENT**.

---

### QUOTE-008 — Quoted services are locked for operations

**Description**  
What was priced (hotels category, vehicle type, duration) is what operations should deliver unless a formal change is approved.

**Validation**  
Quotation records package name, duration, traveler count, and vehicle category. Allocations must align (see HOTEL-002, VEHICLE-002).

**Example**  
Quote includes “7-seater premium” for 6 days; operations assign a vehicle in that category for 6 days.

**Exception**  
Upgrade at no extra charge (e.g. better room) is allowed with operations note; downgrade requires customer consent and price adjustment.

---

### QUOTE-009 — Quotations linked to bookings cannot be removed

**Description**  
A quotation that has been converted to a booking remains in history for finance and customer service.

**Validation**  
Quotations with an active or completed booking cannot be deleted; they may only be marked **SUPERSEDED** or archived.

**Example**  
Booking #52 references quotation #108; quotation #108 cannot be deleted.

**Exception**  
Erroneous duplicate quotations with no booking and no customer share may be cancelled by admin with audit note.

---

### QUOTE-010 — Customer receives a clear quotation document

**Description**  
Before accepting, the customer should receive a readable summary of price, inclusions, and key dates.

**Validation**  
When quotation is **SENT**, customer can view quotation summary (and PDF where available) in the portal or via shared document.

**Example**  
Customer opens “My Quotations,” downloads the PDF, and reviews inclusions before accepting.

**Exception**  
Phone-only customers receive PDF by WhatsApp/email; consultant marks **SENT** with delivery note.

---

# Booking Rules

### BOOK-001 — Booking always starts from a quotation

**Description**  
A booking is the confirmation of an accepted quotation—not a separate shortcut that bypasses the quote.

**Validation**  
Every booking references exactly one quotation. There is one standard “convert quotation to booking” process for all staff.

**Example**  
Consultant converts accepted quotation #108 to booking #52 from the quotation screen.

**Exception**  
Repeat customers (BOOK-009) may use expedited flow that still creates a quotation snapshot behind the scenes.

---

### BOOK-002 — One booking per quotation

**Description**  
Each accepted quotation may produce at most one active booking.

**Validation**  
System prevents a second booking for the same quotation while the first is active.

**Example**  
Quotation #108 already has booking #52; a second conversion is blocked.

**Exception**  
If the first booking was **CANCELLED**, a new booking may be created from a re-accepted quotation with leadership approval.

---

### BOOK-003 — Travel date must be valid

**Description**  
The trip start date must be a real, bookable date—not in the past at time of booking.

**Validation**  
Travel date is today or in the future when the booking is created.

**Example**  
On 10 June, consultant sets travel date 15 July. Valid. Setting 1 May is rejected.

**Exception**  
Same-day or retrospective bookings for emergencies require manager approval and documented reason.

---

### BOOK-004 — Advance payment within bounds

**Description**  
Advance collected at booking must be between zero and the full trip price.

**Validation**  
0 ≤ advance ≤ total booking amount. Outstanding balance equals total minus advance at creation.

**Example**  
Total ₹120,000; advance ₹30,000; outstanding ₹90,000.

**Exception**  
Full payment upfront: advance equals total; outstanding is zero.

---

### BOOK-005 — Booking must link to the originating lead

**Description**  
Every customer-facing booking must connect to the lead so the customer portal and CRM stay accurate.

**Validation**  
Booking includes lead reference when the quotation came from a lead.

**Example**  
Booking #52 shows lead #41; customer sees the trip under “My Bookings.”

**Exception**  
Direct-sale bookings link to a synthetic lead or customer profile per BOOK-009.

---

### BOOK-006 — Lead becomes “Booked” when booking is created

**Description**  
Creating a booking automatically updates the lead to **BOOKED**—staff should not need a separate manual step.

**Validation**  
Lead status is **BOOKED** on the same event as booking creation.

**Example**  
Quotation converted → booking created → lead #41 shows **BOOKED**.

**Exception**  
None for standard flow.

---

### BOOK-007 — Booking status must reflect reality

**Description**  
Booking status should be driven by payment and preparation progress, not arbitrary selection.

**Validation**  
System recommends status based on rules in Payment and Travel Readiness sections. Manual changes require reason and are logged.

**Example**  
Fully paid with hotel and vehicle complete → status **READY_FOR_TRAVEL**, not **PENDING**.

**Exception**  
Manager override for edge cases (e.g. goodwill trip before final installment) with written approval.

---

### BOOK-008 — Cancellation is a full business process

**Description**  
Cancelling a booking is more than changing a label—it triggers refund, supplier release, and lead updates.

**Validation**  
Cancellation requires: reason, refund plan (if money collected), release of hotel and vehicle holds, lead set to **LOST** or **REOPENED**, and customer notification.

**Example**  
Customer cancels 30 days before travel; booking **CANCELLED**, hotel allocation released, partial refund recorded.

**Exception**  
Force majeure (weather, strikes) may follow a separate refund policy approved by leadership.

---

### BOOK-009 — Repeat customer direct booking

**Description**  
Known repeat customers may book with a shortened process, but traceability is still required.

**Validation**  
Direct booking creates or uses a lead marked “repeat customer,” generates a quotation record, and follows payment and allocation rules.

**Example**  
Third-time customer calls; consultant creates expedited quote and booking in one session with customer profile linked.

**Exception**  
None; expedited does not mean skipping payment or allocation rules.

---

# Hotel Allocation Rules

### HOTEL-001 — One active hotel allocation per booking (single-location trips)

**Description**  
For standard single-destination packages, each booking has one active hotel assignment at a time.

**Validation**  
Only one active hotel allocation per booking; changes replace or update the existing allocation.

**Example**  
Hotel A was assigned in error; consultant updates allocation to Hotel B instead of adding a second row.

**Exception**  
Multi-city packages follow HOTEL-007 (Future Rule Candidates).

---

### HOTEL-002 — Hotel must match the booked package geography

**Description**  
Assigned hotels must be in locations covered by the customer’s package—itinerary.

**Validation**  
Selectable hotels are limited to destinations on the quotation package; assigning a hotel outside that list requires approval.

**Example**  
Sikkim–Darjeeling package: hotels must be in those regions, not Kolkata.

**Exception**  
Pre/post night extension in a hub city (e.g. Kolkata night before flight) documented as add-on.

---

### HOTEL-003 — Stay dates must be logical and aligned with travel

**Description**  
Check-in, check-out, and travel start date must make sense together.

**Validation**  
Check-out is on or after check-in. Check-in is within the agreed window of the booking travel date (default: same as travel start unless package defines otherwise). Total nights align with package duration.

**Example**  
Travel starts 10 April; check-in 10 April; check-out 15 April for a 5-night package.

**Exception**  
Early check-in or late check-out negotiated with hotel; notes added to allocation.

---

### HOTEL-004 — Room capacity must fit the party

**Description**  
The hotel assignment must accommodate all travelers in the booking.

**Validation**  
Required rooms are calculated from traveler count and room occupancy; allocation covers at least that many rooms or equivalent capacity.

**Example**  
5 travelers; rooms needed at 2 per room = 3 rooms; allocation confirms 3 rooms or family suite capacity.

**Exception**  
Children sharing beds per hotel policy; documented in booking notes.

---

### HOTEL-005 — Confirmation number required for readiness

**Description**  
A hotel is not “complete” for travel readiness until the property has confirmed the reservation.

**Validation**  
Hotel allocation marked complete only when confirmation number (or equivalent reference) is recorded.

**Example**  
Operations enters confirmation #HK-88421 from the hotel before marking hotel step complete.

**Exception**  
Guaranteed allotment contracts where confirmation batch arrives later—use “pending confirmation” with follow-up date; trip not **READY_FOR_TRAVEL** until received.

---

### HOTEL-006 — No new hotel allocation on closed bookings

**Description**  
Cancelled or completed trips should not receive new hotel assignments.

**Validation**  
Hotel allocation blocked when booking is **CANCELLED** or **COMPLETED**.

**Example**  
Trip completed in March; ops cannot assign a new hotel in April without reopening booking under exception.

**Exception**  
Booking reopened after cancellation reversal (rare); manager approval required.

---

# Vehicle Allocation Rules

### VEHICLE-001 — One active vehicle allocation per booking

**Description**  
Each booking has one active vehicle assignment for the main trip transport.

**Validation**  
Only one active vehicle allocation; upgrades replace the previous assignment.

**Example**  
Sedan replaced by Innova; single allocation updated, not duplicated.

**Exception**  
Separate local transfers (e.g. airport pickup vs sightseeing) may be Future Rule Candidates as secondary legs.

---

### VEHICLE-002 — Vehicle category must match the quotation

**Description**  
The vehicle type promised in the quote is what the customer receives.

**Validation**  
Assigned vehicle category matches quotation (e.g. 4-seater, 7-seater, premium 7-seater).

**Example**  
Quote says 7-seater premium; allocation uses a vehicle from that category.

**Exception**  
Upgrade at same price with customer notification; downgrade requires consent and price adjustment.

---

### VEHICLE-003 — Vehicle capacity must fit travelers

**Description**  
The vehicle must legally and comfortably seat the traveling party.

**Validation**  
Vehicle seating capacity ≥ number of travelers on the booking.

**Example**  
6 travelers cannot be assigned a 4-seater.

**Exception**  
Large groups use multiple vehicles—see Future Rule Candidates for multi-vehicle rules.

---

### VEHICLE-004 — Driver and vehicle details required for readiness

**Description**  
Customers and operations need actionable transfer information before departure.

**Validation**  
Vehicle allocation is complete only when driver name, driver phone, vehicle registration number, and pickup date are recorded.

**Example**  
Driver Rajesh, +91-98xxx, WB-12-AB-1234, pickup 10 April 8:00 AM at Bagdogra airport.

**Exception**  
Driver details assigned 24–48 hours before departure per standard policy; booking stays not **READY_FOR_TRAVEL** until filled.

---

### VEHICLE-005 — Pickup date aligned with travel start

**Description**  
Pickup must match when the customer actually begins travel.

**Validation**  
Pickup date equals travel start date by default; if different by more than one day, consultant or ops must confirm and note why.

**Example**  
Travel date 5 May; pickup 5 May at hotel or airport as per itinerary.

**Exception**  
Midnight arrivals or night-before airport pickup: pickup date may be travel date minus 1 with explicit time in notes.

---

# Payment Rules

### PAY-001 — Payment amounts must be valid

**Description**  
Recorded payments must be positive and cannot exceed what the customer still owes.

**Validation**  
Each installment > 0 and ≤ current outstanding balance. Overpayment is blocked unless processed as refund (PAY-006).

**Example**  
Outstanding ₹20,000; customer pays ₹20,000. Accepted. ₹25,000 is rejected unless flagged as overpayment review.

**Exception**  
Rounding differences up to ₹1 may be written off with finance note.

---

### PAY-002 — Advance is counted once

**Description**  
The advance taken at booking must not be entered again as a separate installment.

**Validation**  
Advance appears once in total collected. Duplicate “advance” payment rows are prevented.

**Example**  
₹50,000 advance at booking; finance records only future installments in payment history.

**Exception**  
Data migration from legacy spreadsheets: finance may enter opening balance once with “legacy import” tag.

---

### PAY-003 — Outstanding balance is always accurate

**Description**  
What the customer owes must match total price minus everything collected—at all times.

**Validation**  
Outstanding = total amount − (advance + sum of installments − approved refunds). Shown balance matches this calculation on admin and customer views.

**Example**  
Total ₹100,000; advance ₹40,000; installment ₹35,000; outstanding ₹25,000 everywhere.

**Exception**  
None; discrepancies trigger finance reconciliation before **READY_FOR_TRAVEL**.

---

### PAY-004 — Partial payment is visible

**Description**  
Staff and customers must see when payment has started but is not complete.

**Validation**  
When 0 < total collected < total amount, booking status shows **PARTIALLY_PAID** (or equivalent clear label).

**Example**  
50% paid; status is **PARTIALLY_PAID**, not **PENDING**.

**Exception**  
None.

---

### PAY-005 — Payment references must be unique

**Description**  
Bank and UPI reference numbers prevent accidental double posting of the same transaction.

**Validation**  
Same payment reference cannot be used twice for the same payment mode.

**Example**  
UPI ref TXN123 used once; second entry with TXN123 is rejected.

**Exception**  
Cash payments without reference use internal receipt number instead.

---

### PAY-006 — Refunds and adjustments are formal transactions

**Description**  
Returning money or correcting errors uses a defined refund or adjustment—not informal negative balances.

**Validation**  
Refunds recorded as approved refund transactions linked to booking. Overpayments resolved by refund, not left as unexplained credit.

**Example**  
Customer paid twice; finance issues refund entry for duplicate amount with approval.

**Exception**  
Credit toward future trip requires “customer credit” policy and expiry date.

---

### PAY-007 — Finance reports include all money collected

**Description**  
Reports and dashboards must include advance at booking plus all installments.

**Validation**  
Total collections = advances + installments (minus refunds) across all bookings in the report period.

**Example**  
Monthly collection report shows ₹500,000 advances + ₹200,000 installments = ₹700,000 total.

**Exception**  
None.

---

# Travel Readiness Rules

### READY-001 — Definition of “Ready to Travel”

**Description**  
A trip is **Ready to Travel** only when the customer has paid in full and both hotel and vehicle requirements are completely satisfied.

**Validation**  
**READY_FOR_TRAVEL** when: outstanding balance ≤ 0, hotel allocation complete (HOTEL-005), vehicle allocation complete (VEHICLE-004).

**Example**  
Full payment received; hotel confirmed; driver assigned → customer sees “Ready for travel.”

**Exception**  
Trusted corporate accounts on credit terms: **READY_FOR_TRAVEL** allowed with approved “payment pending” flag and manager sign-off.

---

### READY-002 — Status updates when payments or allocations change

**Description**  
Booking status must refresh whenever payment, hotel, or vehicle information changes—not only when a new payment is added.

**Validation**  
After any payment, hotel update, or vehicle update, booking status is recalculated per READY-001 and payment rules.

**Example**  
Last installment paid; hotel already assigned; status moves from **CONFIRMED** to **READY_FOR_TRAVEL** even if no new payment occurred today.

**Exception**  
None.

---

### READY-003 — Trip in progress

**Description**  
On the travel start date, the trip is considered underway.

**Validation**  
On travel date, booking moves to **IN_PROGRESS** (automatically or via daily operations checklist).

**Example**  
Travel date 15 March; on 15 March morning, status **IN_PROGRESS**.

**Exception**  
Delayed start (customer arrives day 2): consultant adjusts with note; **IN_PROGRESS** set on actual arrival.

---

### READY-004 — Trip completed

**Description**  
After the trip ends, the booking is closed so reviews and analytics can run.

**Validation**  
Booking becomes **COMPLETED** after last day of itinerary (or manual confirmation by operations within 48 hours of expected return).

**Example**  
6-day trip ending 20 March; on 21 March status **COMPLETED**.

**Exception**  
Extended stay: completion date adjusted with note.

---

### READY-005 — Customer “upcoming trip” shows the next real departure

**Description**  
Customers should see their next future trip—not a past journey.

**Validation**  
“Upcoming trip” on dashboard is the nearest booking with travel date ≥ today and status not **COMPLETED** or **CANCELLED**.

**Example**  
Past trip in January; next trip in April; dashboard highlights April.

**Exception**  
None.

---

### READY-006 — Customer payment display is consistent

**Description**  
Amount paid shown to the customer must include advance and all installments everywhere in the portal.

**Validation**  
“Total paid” on list and detail pages matches advance + installments.

**Example**  
₹30,000 advance + ₹70,000 installment displays as ₹100,000 paid on both summary and trip page.

**Exception**  
None.

---

### READY-007 — Journey timeline shows accurate dates

**Description**  
The customer timeline must reflect when things actually happened.

**Validation**  
Quotation date = when quote was created/sent; payment completed date = when balance first reached zero; ready date = when all readiness criteria were first met.

**Example**  
Quote sent 10 March (not lead date 1 March); payment completed 18 March when final installment posted.

**Exception**  
None.

---

### READY-008 — Trip documents released at the right time

**Description**  
Vouchers, tickets, and final itineraries are shared when appropriate—not while still being drafted internally.

**Validation**  
Customer-visible documents are marked for customer release; vouchers typically released at or after **READY_FOR_TRAVEL** unless consultant explicitly shares earlier.

**Example**  
Draft internal itinerary not visible; final voucher PDF released when trip is ready.

**Exception**  
Early visa or flight documents released on request with consultant approval.

---

### READY-009 — Manual status override requires accountability

**Description**  
Managers may override system-recommended status only with a reason that is stored for audit.

**Validation**  
Override captures: who, when, reason, previous and new status.

**Example**  
Manager sets **READY_FOR_TRAVEL** before final installment per signed payment plan; reason logged.

**Exception**  
None for standard staff; overrides limited to manager role.

---

### READY-010 — Customer notifications reflect real events

**Description**  
Customers are notified when something new happens—not shown a static checklist of pending items forever.

**Validation**  
Notifications created when status changes (payment received, hotel assigned, ready for travel, etc.). Pending steps appear in progress tracker, not as repeated “new” alerts.

**Example**  
Customer receives “Payment received” once on payment date; not the same alert every login.

**Exception**  
Reminder notifications for outstanding payment may repeat per collections policy (e.g. weekly).

---

### READY-011 — Operations dashboard counts ready trips correctly

**Description**  
Leadership view of “trips ready to depart” must use live payment and allocation data.

**Validation**  
Ready trip count matches bookings that satisfy READY-001 using current collections, not outdated balance figures.

**Example**  
Dashboard shows 7 trips ready; operations checklist confirms 7 with full payment and allocations.

**Exception**  
None.

---

# Review Rules

### REVIEW-001 — Reviews only after the trip is completed

**Description**  
Customers share feedback about the experience they had—not expectations before departure.

**Validation**  
Review submission enabled only when booking is **COMPLETED**, or travel end date has passed per policy grace period (e.g. 1 day).

**Example**  
Customer returns 20 March; review opens 21 March. Review blocked on 10 March before departure.

**Exception**  
None for public testimonials; internal feedback during trip goes to support channels, not public reviews.

---

### REVIEW-002 — One review per completed booking

**Description**  
Each trip receives at most one customer review.

**Validation**  
Second review attempt blocked; customer may edit review within allowed window if policy permits.

**Example**  
Booking #52 has one review; duplicate submission rejected.

**Exception**  
Admin may hide inappropriate review and invite resubmission after moderation.

---

### REVIEW-003 — Only the traveling customer may review their booking

**Description**  
Reviews must come from the customer who took the trip.

**Validation**  
Reviewer account matches booking customer (via lead/profile linkage).

**Example**  
Priya’s account reviews her booking; another user cannot review on her behalf without proxy policy.

**Exception**  
Family booking: primary booker may review for group; noted in review metadata.

---

### REVIEW-004 — Reviews reflect completed journeys in customer profile

**Description**  
Profile milestones and stats must count real trips and reviews—not unrelated activity.

**Validation**  
“Trips completed” counts **COMPLETED** bookings; “Reviews written” counts submitted trip reviews.

**Example**  
Customer completed 3 trips and wrote 2 reviews; profile shows 3 and 2—not gem likes or bookmarks.

**Exception**  
None.

---

### REVIEW-005 — Featured reviews are verified trips

**Description**  
Reviews promoted on the website or marketing must be from verified completed bookings.

**Validation**  
Featured flag only on reviews linked to **COMPLETED** bookings with moderation approval.

**Example**  
Marketing features Priya’s review after ops confirms trip **COMPLETED** and content approved.

**Exception**  
Curated editorial stories (not customer reviews) labeled separately from trip reviews.

---

# Future Rule Candidates

Rules below are **not yet formal policy** but emerged from audits and V2 planning. Business owners should prioritize and promote them into the main sections when ready.

| ID | Topic | Summary |
|----|-------|---------|
| **FUTURE-001** | Multi-leg hotel allocations | Each night or city in a multi-destination package gets its own hotel allocation leg matching the itinerary. |
| **FUTURE-002** | Multi-vehicle groups | Large parties require coordinated multiple-vehicle allocation with lead vehicle and manifest. |
| **FUTURE-003** | Quotation expiry | **SENT** quotations auto-**EXPIRE** after N days unless extended. |
| **FUTURE-004** | Consultant ownership | Each lead and booking has an assigned consultant; dashboards filter by owner. |
| **FUTURE-005** | Manual pricing approval | Quotes that bypass automated pricing require manager approval before **SENT**. |
| **FUTURE-006** | Seasonal and festival surcharges | Pricing rules for peak season, festivals, and blackout dates. |
| **FUTURE-007** | Minimum advance percentage | Bookings require minimum advance (e.g. 30%) before confirmation. |
| **FUTURE-008** | Supplier cancellation penalties | Hotel/vehicle cancellation fees calculated by days before travel. |
| **FUTURE-009** | Travel insurance and permits | Packages including permits (e.g. protected areas) cannot be **READY_FOR_TRAVEL** until permits confirmed. |
| **FUTURE-010** | AI itinerary vs operational booking | AI-generated itineraries are inspirational until converted to a formal lead and quotation. |
| **FUTURE-011** | Referral and loyalty credits | Referral rewards apply as controlled credits with expiry, not ad hoc discounts. |
| **FUTURE-012** | Corporate and group contracts | B2B bookings with separate payment terms, invoicing, and approval chain. |
| **FUTURE-013** | Post-trip dispute window | Reviews editable or disputable within 7 days; disputes routed to customer care. |
| **FUTURE-014** | Operations daily departure checklist | Auto-generated list of trips departing in next 48 hours with readiness gaps highlighted. |
| **FUTURE-015** | Pricing simulation sandbox | Test pricing scenarios without creating real quotations or affecting CRM metrics. |
| **FUTURE-016** | Unified margin policy | Standard markup rules for hotels, vehicles, and activities documented and applied consistently. |
| **FUTURE-017** | Customer change requests | Formal process to change dates, travelers, or package after **ACCEPTED** with re-quote rules. |
| **FUTURE-018** | Visa and passport readiness | International trips blocked from **READY_FOR_TRAVEL** until passport/visa checklist complete. |
| **FUTURE-019** | Emergency contact and medical notes | Optional traveler safety fields required for adventure or remote packages. |
| **FUTURE-020** | Sustainability and community impact | Optional tracking of local partners and community guidelines per package (brand policy). |

---

## Rule Traceability (Audit Sources)

For implementers and AI agents mapping rules to remediation work:

| Rule range | Primary audit source |
|------------|---------------------|
| LEAD-* | BL-001, BL-002, BL-010, BL-011, BL-049, BL-058 |
| QUOTE-* | BL-003, BL-004, BL-014, BL-015, BL-030–034, BL-050, BL-053, BL-056, BL-057 |
| BOOK-* | BL-005, BL-013, BL-016, BL-017, BL-024, BL-026, BL-028 |
| HOTEL-* | BL-007, BL-022, BL-036–039, BL-061 |
| VEHICLE-* | BL-008, BL-023, BL-040, BL-041 |
| PAY-* | BL-006, BL-035, BL-044–048 |
| READY-* | BL-012, BL-018–021, BL-025, BL-027, BL-029, BL-042, BL-043, BL-051, BL-054, BL-059 |
| REVIEW-* | BL-009, BL-027, BL-055 |
| FUTURE-* | BL-061, BL-062, Architecture Audit V2 readiness, Audit Action Plan Phases 3–4 |

---

## Document Governance

| Action | Owner |
|--------|-------|
| Approve rule changes | Business owner / head of operations |
| Propose new rules | Consultants, ops, finance, product |
| Align implementation | Product and engineering |
| Periodic review | Quarterly or before major V2 releases |

**Next steps suggested by audits:**

1. Business owners review this draft and approve or adjust rules.  
2. Approved rules become the source for `V2_ROADMAP.md` workflow workstreams.  
3. Implementation teams enforce rules consistently across all staff entry points (not only one screen).  

---

*End of Travel Business Rules (Draft)*
