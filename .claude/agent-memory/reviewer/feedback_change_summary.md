---
name: feedback-change-summary-completeness
description: Coders sometimes omit bundled-but-unrelated changes from the Change Summary; always run a full git diff
metadata:
  type: feedback
---

Always run `git diff` on every affected repo before trusting the coder's Change Summary. The June 2026 OTP-leak fix also bundled undeclared changes: `chat.py` (new `lang` query param), `chat_ai.py` (lang forwarding to AI backend), and `vedagya-react-1/.env` (VITE_API_BASE_URL → `https://api.dev.vedagya.in`).

**Why:** These changes were correct but not called out. A reviewer who only read the Change Summary would miss the lang feature entirely and not verify the AI backend contract.

**How to apply:** Phase 1 of every review must be `git diff` in all repos, compared against the declared scope. Undeclared diffs are flagged as MEDIUM suggestions even if code is correct.
