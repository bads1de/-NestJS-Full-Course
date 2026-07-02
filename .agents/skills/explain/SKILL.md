---
name: explain
description: Walk through existing code to teach what it does, why it was built that way, and how the pieces fit together. Useful for onboarding, code review learning, or whenever a developer wants to understand unfamiliar code.
---

Use this when a developer wants to understand existing code — not to build or fix anything.

This skill teaches the implementation as a senior engineer would explain it to a teammate.

## Step 1 — Ask what to explain

If the developer didn't specify what they want explained, ask: *Which file, feature, or concept do you want explained?*

## Step 2 — Read everything relevant

Read the code the developer is asking about plus any related files that help tell the full story.

What to look for:
- **The file itself** — its exports, its imports, its public API
- **Callers / consumers** — who uses this code, what does it enable
- **Configuration** — environment variables, module registration, middleware setup
- **Tests** — what behaviors are tested (tests are a form of documentation)
- **Related context files** — `AGENTS.md`, `memory.md`, other skill files, `.env.example`
- **Dependencies** — library docs or patterns this code relies on

Use the Explore agent to gather this context if the search is broad.

## Step 3 — Structure the explanation

Organise the answer into sections that build understanding incrementally.

Do **not** read the code aloud line by line. Instead explain:

### 1. What this code does (30-second summary)
A single paragraph. If someone asked "what does this file do?" — this is the answer.

### 2. Why it exists
What problem was being solved. What alternatives were considered (if known). Why this approach was chosen over the alternatives.

### 3. How it works
Walk through the key mechanisms, not every line. Focus on:
- Entry points and flow of data
- Important types / interfaces
- How it connects to the rest of the system
- Error handling strategy
- Testing strategy

### 4. Key concepts
For any unfamiliar library, pattern, or architectural decision, explain it briefly so the developer can look it up later.

### 5. What to know before changing this code
Things that are subtle, easy to break, or important invariants. If a future developer was about to touch this code, what should they be warned about?

## Step 4 — Offer next steps

After the explanation, offer to:
- Explain another part of the codebase
- Draw a diagram (text-based) of the architecture
- Point to external resources for deeper learning

## Tone and style

- Teach, don't lecture. Assume the developer is competent but new to this codebase.
- Use analogies when helpful ("a Guard is like a bouncer at a club — it checks the ID before letting the request in").
- Default to Japanese for explanations unless the user asks for English.
- Keep it concise. Prefer 3-5 clear paragraphs over a wall of text.
