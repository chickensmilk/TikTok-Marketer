---
name: feedback-canva-confirm-before-save
description: "Always confirm before saving/committing a design to the user's Canva account"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 604f6cc7-f7af-4046-b86d-23c00ce8b06a
---

Always ask for confirmation before calling `create-design-from-candidate` or any Canva tool that commits a design to the user's account.

**Why:** User interrupted the `create-design-from-candidate` call mid-session — signal that auto-saving to Canva without explicit approval is unwanted.

**How to apply:** After generating Canva design candidates and the user picks one, present the choice and wait for a clear "go ahead" before calling `create-design-from-candidate`. Treat it like a destructive/irreversible action.
