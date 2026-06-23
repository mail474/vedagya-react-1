---
name: feedback-env-tracked-in-git
description: Both repos have .env in .gitignore but the files are already tracked in git — real credentials are in history
metadata:
  type: feedback
---

Both `Vedagya-AI/backend/.env` and `vedagya-react-1/.env` appear in `.gitignore` but were committed before that entry was added. They are tracked and show in `git diff`. Real secrets are present (MSG91 authkey, Razorpay live key ID).

**Why:** Pre-existing situation; not introduced by any single change. Flagging changes to `.env` files is still warranted because each commit embeds the secrets again.

**How to apply:** When `.env` changes appear in a diff, always note the pre-existing tracking issue, but treat it as LOW severity since it's not new. Focus on whether the specific change (key rotation, flag value) is correct.
