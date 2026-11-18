---
title: "How to Reconcile Local Services Ads Calls With Restoration Dispatch Records"
description: "Use a weekly worksheet to match Local Services Ads calls with restoration intake and dispatch records, then assign each exception to an owner."
author: Matt Pugh
date: 2026-11-17T12:00:00.000-05:00
image: src/assets/images/blog/local-services-ads-call-reconciliation-restoration-companies.webp
imageAlt: A desk phone, headset, and paper call log on a clipboard
tags:
  - post
---

A charged Local Services Ads call and a booked restoration job are different events. A caller may hang up, speak with an answering service, call back, or be entered in dispatch under another time. A weekly reconciliation gives the intake manager and account owner a shared list of exceptions to resolve before considering a budget or vendor change.

Use this worksheet with your existing records. It is an operating method, not a promise that every charge will become a job or receive a credit.

## Set the review window and gather three records

Choose one complete week and write its start and end, account time zone, reviewer, and review date at the top of the sheet. Google’s [Local Services reports](https://support.google.com/localservices/answer/6226265) let you select a date range and show charged leads and spend by call, message, or booking, a filterable lead list, and lead credits. Use the lead list as the call-level starting point and the report as a period-level cross-check; the report’s credit period need not be the same as the original lead period.

Gather the Google lead list and report, the phone or answering-service log, and the dispatch or CRM results for that window. Google’s [API reference](https://developers.google.com/google-ads/api/fields/v26/local_services_lead) specifies that its lead creation timestamp uses the Google Ads account time zone. Convert the other systems’ timestamps to that same zone and agree on day boundaries before matching, including any daylight-saving change.

Keep names, numbers, recordings, and other customer information in the authorized systems where they already belong. The worksheet can use controlled references and links accessible only to appropriate staff; it does not require copying recordings or importing leads.

## Match calls to handling and dispatch

Start one row per originating lead reference, not one row per phone event. Google’s [lead API](https://developers.google.com/google-ads/api/fields/v26/local_services_lead) identifies each lead with an ID. Use an available source ID first; if systems do not share one, compare normalized time and contact details inside the authorized systems. Record the match as confirmed, probable, or unresolved. Do not merge ambiguous records until someone checks them.

Google says [same-number or same-email follow-ups](https://support.google.com/localservices/answer/7195435) after a charged lead are not billed again while interaction continues within 15 days. Link a callback to the original lead where the records support it, while retaining its own handling time. If the link is uncertain, flag it rather than assuming a duplicate or a second charge.

## Copy the weekly exception worksheet

For each originating lead, record: **lead reference; normalized time and zone; handling result; charge status and credit snapshot with date; dispatch reference; booked status; unresolved owner; next review date.** Keep the platform booked marker and the dispatch result separately. Add a match-confidence note when needed. Use links or controlled IDs rather than customer details.

The four examples below use invented records and illustrate how to track exceptions. Verify billing and credits in your own account.

1. **L-101 / Mon 09:12 ET.** In-hours missed call. No completed handoff found. Charged. No credit shown as of Mon. No dispatch record found. Booking unknown. The intake manager checks the log and follow-up on Tue.
2. **L-102 / Tue 10:04 ET.** Callback at 10:30 matched to original lead. Charged. Callback retained on same row. D-202. Appointment booked. The intake manager confirms the handoff on Wed.
3. **L-103 / Wed 14:20 ET.** Answered. Disposition logged. Charged at first review. Credited at next snapshot. D-203. Not booked. The account owner reconciles the credit with the report at the next weekly review.
4. **L-104 / Thu 11:15 ET.** Answered. Dispatcher logged inquiry. Charged. No credit shown at review. D-204 says not booked. The platform marker says booked. The intake manager establishes the actual outcome. The account owner checks the marker on Fri.

For L-101, “no dispatch record found” is an exception, not proof that nobody worked the call. Check the answering-service log and authorized notes for a callback, alternate spelling, or an entry outside the selected window. Record the result and next owner even if the match remains open.

## Interpret billing without confusing it with intake

Google lists a conversation with a potential customer on an answered call or callback as a situation that can produce a valid lead in its [lead rules](https://support.google.com/localservices/answer/7195435). A conversation is not the same as a booked job, so check dispatch separately.

Google also identifies an unanswered call during the business’s hours lasting more than 20 seconds as a situation that can produce a valid lead in the same [lead rules](https://support.google.com/localservices/answer/7195435). For a keypress phone menu, Google says an unanswered caller who hangs up before pressing a key is not charged under that menu rule; its timer starts at the first keypress and later selections do not reset it. Check available records before concluding which situation applies.

For an answered call, Google evaluates the conversation rather than treating a ring longer than 20 seconds as a standalone reason to charge, according to its [lead rules](https://support.google.com/localservices/answer/7195435). If timing or call handling cannot be established from existing logs, mark the case unresolved and assign it to the account owner for review.

Google’s [credit documentation](https://support.google.com/localservices/answer/15100654?hl=en) distinguishes Not charged, Charged, In review, and Credited lead statuses. Record both the status and the date observed: a later credited status is different from a lead that was never charged. Google says credits are generally applied to the account balance within 30 days, while the original charge remains on the invoice; compare both entries before closing the exception, as described in its [credit documentation](https://support.google.com/localservices/answer/15100654?hl=en).

Google says it no longer supports credits for job types or geographic areas not serviced in its [credit guidance](https://support.google.com/localservices/answer/15100654?hl=en). Do not label either outcome an assured reimbursement. Google also offers individual lead-quality feedback from the Leads page, described in the same [guidance](https://support.google.com/localservices/answer/15100654?hl=en); feedback does not guarantee a credit.

## Resolve the booking mismatch and repeat

Google’s [reporting guide](https://support.google.com/localservices/answer/6226265) says its Mark Booked feature is available in the U.S. and Canada and can include job details for later filtering. A platform marker is useful context, but the dispatch owner should confirm the actual appointment or job record when the two disagree. The account owner can then investigate the platform marker using the established workflow.

At the weekly review, reconcile the call rows to the period report, then sort unresolved items by owner and next review date. The intake manager checks missed handoffs, callbacks, and dispatch outcomes. The account owner checks charge states, credits, and platform questions. Capture what was checked, the result, and the next checkpoint; carry unresolved cases forward and close only when the responsible owner has documented the resolution. Review totals and open exceptions again next week, including later credits.

For broader channel context, see our [Local Services Ads guide](/resources/local-services-ads-for-restoration-companies/). If you need help connecting source and operational outcomes across your marketing, explore our [lead tracking service](/services/lead-tracking/). Reuse the worksheet for several reviews to understand the handoff before considering a budget or vendor decision.
