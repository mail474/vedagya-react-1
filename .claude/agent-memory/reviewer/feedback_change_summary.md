---
name: feedback-change-summary-completeness
description: Coders sometimes omit bundled-but-unrelated changes from the Change Summary; always run a full git diff
metadata:
  type: feedback
---

Always run `git diff` on every affected repo before trusting the coder's Change Summary. Bundled-but-undeclared changes have appeared repeatedly:

- June 2026 OTP-leak fix: bundled `chat.py` (new `lang` param), `chat_ai.py` (lang forwarding), and `vedagya-react-1/.env` change — not mentioned in summary.
- June 2026 T&C page PR: declared only `TermsConditionPage.tsx` + `router/index.tsx`; actually also included `admin/api.ts` (new `MuhuratHistoryItem` interface + `listUserMuhuratHistory`), `admin/screens/Payments.tsx` (muhurat product label), `admin/screens/Users.tsx` (`MuhuratHistorySection` component), and new test file `api.muhurat.test.ts`. Code was correct; just undisclosed.

**Why:** Changes were correct but not called out. A reviewer who only read the Change Summary would miss the feature entirely and not verify backend contracts.

**How to apply:** Phase 1 of every review must be `git diff` in all repos, compared against the declared scope. Undeclared diffs are flagged as MEDIUM suggestions even if code is correct.
