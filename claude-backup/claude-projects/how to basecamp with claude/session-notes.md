# How to Use Basecamp with Claude

## Session Date: 2026-03-28

---

## What We Learned

### 1. Open Basecamp in Chrome
Claude can open a URL directly in Chrome using a terminal command.

**What works:**
- `open -a "Google Chrome" "https://basecamp.com"` — opens basecamp.com in a new Chrome tab

---

### 2. Clicking Buttons via Claude
Claude attempted to click the "Sign In" button using JavaScript through AppleScript.

**What blocked it:**
- Chrome has JavaScript from Apple Events **disabled by default**
- To enable it: **View > Developer > Allow JavaScript from Apple Events**

---

### 3. Navigating to Your Dashboard (Already Logged In)
Instead of clicking the sign-in button, Claude can navigate directly to the Basecamp login/dashboard URL.

**What works:**
- `open -a "Google Chrome" "https://launchpad.37signals.com/signin"`
  - If you're already logged in, this redirects straight to your dashboard ✓

**Backup option:**
- `open -a "Google Chrome" "https://3.basecamp.com"`
  - Goes directly to Basecamp 3 dashboard

---

## Key Takeaway
If you're already logged into Basecamp, skip the homepage and go directly to:
**https://launchpad.37signals.com/signin**

Claude can open this for you anytime by asking:
> "Open my Basecamp dashboard"

