---
name: project-otp-sms-live
description: SMS OTP delivery via MSG91 is now live in production; dev_otp is only echoed when DEBUG=True
metadata:
  type: project
---

As of the June 2026 OTP-leak fix, MSG91 SMS is the production delivery path for OTPs.

**Why:** OTP code was leaking in the HTTP response via `dev_otp`; the fix gates that field on `settings.DEBUG`.

`Vedagya-AI/backend/app/api/v1/auth.py:49`: `data = {"dev_otp": code} if settings.DEBUG else None`

`CLAUDE.md:69` is stale — still says "SMS provider integration is a TODO". Must be updated.

**How to apply:** When reviewing auth or OTP-related code, note that `dev_otp` is never present in production responses. Scripts or tests that do `data["dev_otp"]` (e.g., `scripts/test_chat.py:48`) will crash with `DEBUG=False` (the current `.env` default).
