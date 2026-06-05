# Building a Web App with Claude Code — A Non-Coder's Playbook
*Based on a real project: Richard Vargas built a fully functional employee email signature manager for Digital Resource (~90 employees) using Claude Code — with no prior coding experience.*

---

## Table of Contents

1. [What Is Claude Code?](#1-what-is-claude-code)
2. [Installing Claude Code on a Mac](#2-installing-claude-code-on-a-mac)
3. [Setting Up Your Terminal](#3-setting-up-your-terminal)
4. [How to Start a Project the Right Way](#4-how-to-start-a-project-the-right-way)
5. [How to Communicate Without Knowing Code](#5-how-to-communicate-without-knowing-code)
6. [Staying Organized — Storing Conversations](#6-staying-organized--storing-conversations)
7. [Resuming Where You Left Off](#7-resuming-where-you-left-off)
8. [Screenshots as a Diagnostic Tool](#8-screenshots-as-a-diagnostic-tool)
9. [Claude Code vs. ChatGPT — When to Use Each](#9-claude-code-vs-chatgpt--when-to-use-each)
10. [How to Verify Claude's Work (Without Reading Code)](#10-how-to-verify-claudes-work-without-reading-code)
11. [Questions to Ask When You Hit a Roadblock](#11-questions-to-ask-when-you-hit-a-roadblock)
12. [Ask Claude to Explain What It Did](#12-ask-claude-to-explain-what-it-did)
13. [Basic Git — Saving and Deploying Your Work](#13-basic-git--saving-and-deploying-your-work)
14. [The Memory System — Claude Remembers Between Sessions](#14-the-memory-system--claude-remembers-between-sessions)
15. [Quick Reference Cheat Sheet](#15-quick-reference-cheat-sheet)

---

## 1. What Is Claude Code?

Claude Code is an AI assistant that lives inside your Mac terminal. Unlike the regular Claude.ai chat in a browser, Claude Code can:

- **Read and write actual files** on your computer
- **Run commands** (install packages, start servers, deploy code)
- **Remember your project** across conversations using memory files
- **Work inside your project folder** so it knows your entire codebase

Think of it as a senior developer sitting next to you — one that never gets frustrated, never judges your questions, and works at the speed of thought.

---

## 2. Installing Claude Code on a Mac

### What you need first
- A Mac with macOS
- A terminal app (the built-in **Terminal** app works fine)
- Either a **Claude Pro account** (claude.ai, $20/mo) or an **Anthropic API key**

### Step 1 — Install Node.js
Claude Code requires Node.js. Open Terminal and run:

```bash
node --version
```

If you see a version number (e.g., `v20.11.0`), you already have it. If not, go to **nodejs.org**, download the LTS version, and install it like any Mac app.

### Step 2 — Install Claude Code
In Terminal, run:

```bash
npm install -g @anthropic-ai/claude-code
```

This installs Claude Code globally on your Mac (the `-g` flag means "for the whole system, not just one folder").

### Step 3 — Connect your account

**Option A — Claude Pro account (recommended for beginners):**
```bash
claude
```
The first time you run it, Claude Code will open a browser window asking you to log in with your Claude account. Sign in and authorize it. Done.

**Option B — API key:**
1. Go to **console.anthropic.com** → API Keys → Create Key
2. Copy the key (it starts with `sk-ant-...`)
3. In Terminal:
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
claude
```

> **Note:** API key billing is pay-per-use. Pro account gives you a monthly quota with no per-message charges — better for heavy use.

---

## 3. Setting Up Your Terminal

The goal: open any new Terminal window, type `claude`, press Enter, and be ready to go.

### Make `claude` work in every new terminal window

Open Terminal and run:

```bash
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Now test it:

```bash
claude --version
```

If you see a version number, you're set. Every new Terminal window will now have `claude` available.

### Tip — Start Claude in your project folder
Always `cd` into your project folder before starting Claude so it knows where your files are:

```bash
cd ~/Desktop/My\ Project
claude
```

---

## 4. How to Start a Project the Right Way

This is the most important step. The more context you give Claude upfront, the fewer corrections you'll need to make later.

### The "Project Brief" message
Before asking Claude to write any code, send it a message like this:

---

*"I want to build a web app. Here is everything you need to know:*

***What it does:** [describe the purpose in plain English — e.g., "lets me manage email signatures for all my employees"]*

***Who uses it:** [e.g., "me as an admin, and employees who view their own signature"]*

***Key features I need:***
*- [feature 1]*
*- [feature 2]*
*- [feature 3]*

***What I do NOT want:** [e.g., "no login for employees, keep it simple"]*

***Technical preferences:** [e.g., "keep it simple, no complicated frameworks, just HTML and basic JavaScript"]*

***Where it will live:** [e.g., "on a server I rent, accessible from a web browser"]*

*Before writing any code, ask me any clarifying questions you have."*

---

### Why this works
Claude will ask smart follow-up questions instead of making assumptions. Every assumption it makes unchecked is a potential thing you'll need to fix later.

### Real example
Richard's opening prompt established:
- ~90 employees needing email signatures
- A master company template + individual overrides per employee
- Admin-only editing, no login required for viewing
- Simple stack (no frameworks)
- Would live on a rented VPS server

This meant Claude never suggested a complex framework or multi-user login system — it stayed in scope from day one.

---

## 5. How to Communicate Without Knowing Code

You do not need to know programming terms. Describe **behavior** — what you see, what you expected, what happened instead.

### The formula for describing a problem

> **"When I [do this action], I expected [this to happen], but instead [this happened]."**

### Examples

| Instead of... | Say this... |
|---|---|
| "The API endpoint is returning a 500" | "When I click Save, I get a red error and nothing saves" |
| "The CSS flexbox alignment is off" | "The employee photo is showing up on the wrong side — it should be on the left" |
| "The session token isn't persisting" | "Every time I refresh the page, I get logged out and have to log in again" |
| "The SQL query isn't filtering correctly" | "When I search for an employee name, it shows all employees instead of just the one I searched for" |

### Golden rule
If you can take a screenshot of the problem, do it. A screenshot is worth a thousand technical words.

---

## 6. Staying Organized — Storing Conversations

Claude Code has a built-in memory system. At the end of a work session, ask Claude to save a summary:

> *"Please save a memory of everything we built today, all the decisions we made, and the current state of the project so I can pick up right where we left off next time."*

Claude will create `.md` files (text files written in a readable format called Markdown) inside a `memory` folder linked to your project.

### Manual backup — your own notes folder
Create a dedicated folder on your Desktop for your project notes:

```
Desktop/
  My Project/          ← your actual app files
  My Project Notes/    ← your notes and summaries
    session-2026-03-24.md
    session-2026-03-25.md
    roadblocks.md
    decisions.md
```

At the end of each session, ask:

> *"Give me a plain-English summary of what we built today, what decisions we made and why, and what's left to do. I want to paste it into my notes file."*

Copy Claude's response into a new file in your Notes folder.

---

## 7. Resuming Where You Left Off

When you open a new Terminal window and start a fresh Claude session:

**Option A — Claude's built-in memory (automatic):**
Claude Code stores memory files linked to your project folder. When you `cd` into your project and type `claude`, it will have access to these. You can say:

> *"Please read your memory files and give me a summary of where we left off."*

**Option B — Your own notes file:**
If you kept your own `.md` notes file, paste the path to Claude:

> *"Please read the file at `~/Desktop/My Project Notes/session-2026-03-25.md` and use it as context. Then let's continue from where we left off."*

**Option C — Just tell Claude what you remember:**
> *"Last session we finished the employee list page. Today I want to add a search bar. Here's a screenshot of the current state."*

You don't need a perfect record. Claude is good at picking up from partial context.

---

## 8. Screenshots as a Diagnostic Tool

This was one of Richard's most effective strategies. Screenshots let you show Claude (or ChatGPT) exactly what you're seeing — no technical translation needed.

### When to use screenshots

- **Something looks broken visually** — take a screenshot of the page
- **You see an error message** — screenshot the error (especially red text in the browser or terminal)
- **The terminal shows something unexpected** — screenshot it
- **You want Claude to match a design** — screenshot the reference

### How to take a screenshot on Mac

| What | Shortcut |
|---|---|
| Full screen | `Cmd + Shift + 3` |
| Select a portion | `Cmd + Shift + 4` |
| A specific window | `Cmd + Shift + 4`, then Space, then click window |

Screenshots save to your Desktop automatically.

### How to use it with Claude Code
Drag the screenshot into the Claude Code chat in your terminal, or reference the file path:

> *"Here is a screenshot of the error I'm seeing. [attach image] What's causing this and how do we fix it?"*

### The cross-reference technique
When Claude Code is stuck or you're not getting traction:

1. Take a screenshot of the problem
2. Take a screenshot of the relevant code (Claude can show you which file and line to look at)
3. Open **ChatGPT** (or a new Claude.ai browser tab)
4. Upload both screenshots
5. Ask: *"I'm building a web app and hit this problem. Here's the error and here's the code. What's wrong and how do I fix it?"*
6. Take ChatGPT's answer back to Claude Code: *"ChatGPT suggested [paste suggestion]. Does that make sense? Can you apply it?"*

This technique is especially powerful when you're getting circular answers — a fresh AI with fresh eyes often spots what the first one missed.

---

## 9. Claude Code vs. ChatGPT — When to Use Each

These tools are complementary, not competing. Use both.

| Use **Claude Code** (terminal) when... | Use **ChatGPT** (browser) when... |
|---|---|
| Actually building / writing code | Diagnosing a problem from a screenshot |
| Making changes to your project files | Getting a plain-English explanation of something |
| Deploying or running your app | Getting a second opinion on Claude Code's answer |
| Asking Claude to remember your project | Quickly testing an idea before committing |
| Reading error logs from the terminal | You're stuck and want a fresh perspective |

### The mental model
- **Claude Code** = your developer. It has its hands on your keyboard and files.
- **ChatGPT** = a consultant you call when you want a second opinion or plain explanation.

---

## 10. How to Verify Claude's Work (Without Reading Code)

You can't read the code — that's fine. Here's how to verify Claude did the right thing:

### 1. Test the behavior in the browser
Open your app and manually click through every feature that was changed. Ask yourself:
- Does the thing I asked for now work?
- Did anything that worked before now break?

### 2. Ask Claude to explain what it changed
> *"What files did you change and what exactly did you do? Explain it like I'm not a developer."*

### 3. Ask Claude to walk you through it
> *"Can you open the relevant file and show me exactly where the change is and what it does?"*

### 4. Ask Claude to test it
> *"Can you verify this is working correctly? What should I look for in the browser to confirm?"*

### 5. Trust your eyes
If the app looks and behaves the way you described, the code is probably correct. You are the product manager — Claude is the developer. You judge the output, not the implementation.

---

## 11. Questions to Ask When You Hit a Roadblock

### When something breaks
- *"Something stopped working after the last change. Can you look at what we just changed and figure out why?"*
- *"Here is a screenshot of the error. What does this mean and how do we fix it?"*
- *"Can you check the terminal/server logs for any errors?"*
- *"Let's undo the last change and try a different approach."*

### When Claude's solution isn't working
- *"That didn't fix it. Here's what's still happening: [describe]. What else could be causing this?"*
- *"Can you try a completely different approach to this?"*
- *"I asked ChatGPT and it suggested [paste suggestion]. What do you think? Can you try that?"*

### When you don't understand what Claude is doing
- *"Before you write any code — explain in plain English what you're about to do and why."*
- *"I don't understand what [term] means. Can you explain it in plain English without assuming I know anything about coding?"*
- *"Is there a simpler way to do this?"*

### When you're not sure if something is possible
- *"Is it technically possible to [describe feature]? If yes, how complex is it? Give me a simple answer before diving in."*

### When you're stuck and going in circles
- *"Let's step back. Here is the original goal: [describe]. What's the simplest possible way to achieve this?"*
- *"Can you summarize what the real problem is in one sentence?"*

---

## 12. Ask Claude to Explain What It Did

This is how you build enough understanding to catch mistakes and have intelligent conversations about your own app.

After any significant change, ask:

> *"Explain what you just built like I'm a smart person who doesn't know how to code. What does each piece do and why did you make those choices?"*

Over time, these explanations will build a mental model of your app. You won't be able to write the code, but you'll be able to understand the architecture — and that's enough to direct Claude effectively.

### What to do with the explanation
- Save it to your notes folder
- If something doesn't sound right, say so: *"That doesn't match what I expected. I thought [your expectation]. Which one of us is right?"*

---

## 13. Basic Git — Saving and Deploying Your Work

Git is a system for saving versions of your code and sharing it with a server. You don't need to understand it deeply — just know the three commands you use most.

### The three commands you'll use

```bash
git add .
git commit -m "describe what you just built"
git push
```

**What they do:**
- `git add .` — stage all changed files ("I want to save these")
- `git commit -m "..."` — save a snapshot with a description
- `git push` — send that snapshot to GitHub (and from there, to your server)

### When to commit
At the end of every working session. Think of it like hitting Save in a document — except it saves a permanent, labeled version you can always go back to.

### Ask Claude to do it for you
> *"We're done for today. Can you commit all the changes to git with a clear message describing what we built?"*

### Deploying to your server
Once your code is on GitHub, deploying usually means SSHing into your server and pulling the latest code. Claude can write you a custom deploy command for your specific setup — ask once, save it to your notes, and reuse it every time.

---

## 14. The Memory System — Claude Remembers Between Sessions

Claude Code has a built-in memory system that stores notes about your project in `.md` files. These files are automatically loaded at the start of each session when you're in your project folder.

### How it works
- Claude writes memory files to a `memory` folder linked to your project
- The next time you open Claude in that project, it reads those files automatically
- You can also manually tell Claude to save specific things

### What to ask Claude to save
At the end of a session:
> *"Please save a memory of everything we built today, all major decisions, the current state of the project, and any known issues or next steps."*

### What makes a good memory file
- **Project state** — what exists, what doesn't yet
- **Decisions and why** — "We chose SQLite instead of PostgreSQL because it's simpler for a single-server setup"
- **Known issues** — things you know are broken or incomplete
- **Next steps** — what you planned to do next

### What NOT to put in memory
Don't save every line of code — Claude can read the actual files for that. Memory is for decisions, context, and state that isn't obvious from the code itself.

---

## 15. Quick Reference Cheat Sheet

### Getting started
```bash
cd ~/Desktop/My\ Project    # go to your project folder
claude                       # start Claude Code
```

### Starting a new project — key prompt
> *"I want to build [describe app]. Here's everything you need to know: [context]. Before writing any code, ask me any clarifying questions."*

### Describing a problem
> *"When I [action], I expected [result], but instead [what happened]. Here's a screenshot."*

### When stuck
> *"That didn't fix it. Can you try a completely different approach?"*
> *"Let's step back — what's the simplest way to achieve [original goal]?"*

### End of session
> *"Save a memory of today's session — what we built, decisions made, known issues, and next steps."*
> *"Commit all changes to git with a good description."*

### Starting a new session
> *"Read your memory files and give me a summary of where we left off."*

### Cross-referencing with ChatGPT
1. Screenshot the problem + the relevant code
2. Ask ChatGPT to diagnose
3. Bring the answer back to Claude Code

---

## Final Thought

The biggest mindset shift for non-coders working with AI is this: **you are the product manager, not the developer.** Your job is to describe what you want with clarity and test whether the result is what you expected. Claude's job is to figure out how to build it.

The more clearly you can describe desired behavior — not code — the more effective you'll be. Screenshots, plain-English problem descriptions, and iterative feedback are your primary tools. You don't need to know how to code. You need to know what good looks like.

---

*Document created: 2026-03-28*
*Based on: Richard Vargas's experience building the Digital Resource Email Signature App*
