---
title: 'I turned Claude Code into a 7-stage content pipeline — and the whole "database" is just Markdown files'
description: "How I built a seven-stage content pipeline out of Claude Code Skills and dated Markdown files — no database, no backend, just a plain-text trail with a human checkpoint in the middle."
date: 2026-07-07
tags: [seo, content-strategy, claude-code, ai-workflows]
draft: false
---

# I turned Claude Code into a 7-stage content pipeline — and the whole "database" is just Markdown files

I write content for a few sites, and the part I hate isn't the writing — it's everything around it. Finding what already ranks. Checking what I've said elsewhere on my own site so I don't contradict myself or miss an internal link. Building an outline that argues something instead of restating the SERP. Then formatting the final thing for a CMS with metadata, a slug, and schema.

So I built a pipeline for it. Not an app — a set of **Claude Code Skills** that take a single topic through seven small, deliberate stages to a publish-ready article. No database, no backend, no dashboard. Just a folder of dated Markdown files that each stage reads from and writes to.

## The shape of it

Every run leaves the same trail:

	content-briefs/2026-05-11-how-to-structure-a-workout.md
	content-research/2026-05-11-how-to-structure-a-workout-serp.md
	content-research/2026-05-11-how-to-structure-a-workout-internal.md
	content-outlines/2026-05-11-how-to-structure-a-workout-outline.md
	content-drafts/2026-05-11-how-to-structure-a-workout/
	  intro.md
	  section-01-why-structure-matters.md
	  ...
	  faq.md
	  conclusion.md
	  full-draft.md
	  full-draft-reviewed.md
	  publish-package.md

Each of those files is the *entire* interface between stages. No shared memory, no state object passed around — Stage 4 just reads the newest file in `content-briefs/` and `content-research/`, and writes a new one when it's done. It sounds too simple to work, and that's the point: at any moment I can open a file in a normal editor, change something, and the next stage picks up my edit without noticing. The pipeline has no opinion about who wrote the last file — me or the model.

## The seven stages

**1. Intake** — I give it a keyword or rough idea ("how to structure a workout") plus, optionally, one sentence of direction ("focus on beginners, skip supplements"). No research, no drafting. Its only job is to capture intent cleanly before automation touches it — because that one human sentence is what keeps everything downstream from defaulting to generic.

**2. SERP research** — pulls the top 5–7 ranking pages, reads them, and extracts headings, recurring points, and FAQ questions verbatim. It's explicitly *not* judging quality or forming a strategy here — just gathering raw material so Stage 4 has something real to work from.

**3. Internal reference** — searches my own site for anything on adjacent topics and comes back with a specific note per page: not "this page covers payments" but "this page has a worked example from a coffee shop." It flags linking opportunities in both directions, before the outline even exists.

**4. Outline** — where the article's argument gets locked in, and the stage I'm most opinionated about. The human-context sentence from Stage 1 is the dominant lens, not the SERP. If my context says "focus on operational simplicity" and every competitor runs a technical deep-dive, the outline leads with simplicity anyway. Competitors inform structure; they don't dictate it. The output: a thesis, a hook brief, 4–7 H2s each with specific (not generic) key points, and a shortlist of FAQs.

**5. Draft** — writes section by section, saving each as its own file before assembling `full-draft.md`. Deliberately un-clever: no single 2,000-word generation pass. A 300-word section written with full attention beats the same section pulled out of one long stream — the difference shows up as fewer generic transitions and less padding.

**6. Human review** — the one stage that isn't automation. It hands me a fixed checklist — does this article argue something, does it sound like me, are the examples real and specific, are the claims accurate, does every section earn its place — and waits. I edit `full-draft.md` directly, say "done," and it runs a sanity pass (orphaned links, sections that grew or shrank too far in editing, abrupt endings) before saving `full-draft-reviewed.md`.

**7. Publish** — takes the *reviewed* file, never the raw draft, and produces a title tag, meta description, slug, cleaned and formatted body, an Article JSON-LD block, and a flagged list of whatever's still missing (author name, a link that never got added). One file, ready to paste into a CMS.

## What the stages actually buy you

Stages are easy to describe in the abstract, so here's the difference on paper. Ask Claude for "a blog post about how to structure a workout" in one shot and the intro comes out like this:

> **Before — one-shot prompt**
>
> In today's fitness world, structuring your workout properly is more important than ever. A well-structured workout can help you achieve your fitness goals faster and more effectively. In this article, we'll explore the key elements of a good workout structure, including warm-ups, exercise selection, and cool-downs.

Not wrong, exactly. Just generic — no claim, no tension, nothing that couldn't have been written about any topic by swapping two nouns. Here's what the pipeline produced for the same keyword, after Stage 2 found what competitors were table-staking, Stage 3 checked what my own site already said, and Stage 4 locked in a thesis before a word of prose got written:

> **After — Stage 5 output, `intro.md`**
>
> Most people build workouts the same way. They think of exercises they like, remember a few they've seen on social media, and string them together in whatever order feels right. Then they wonder why they've been training for months without much to show for it.
>
> The problem isn't the exercises. It's the lack of structure behind them. A workout isn't a collection of movements — it's a deliberate sequence designed to create a specific adaptation. Get the structure wrong and you leave results on the table. Get it right and every session compounds on the last.
>
> This guide covers the framework that makes workouts work: the session template, the logic behind exercise order, how to organise your training around movement patterns, and the one principle that ties it all together.

Same topic, same model. The difference is that this version had a thesis to write toward — structure matters more than exercise selection — before it generated a single sentence. That thesis came from Stage 4's outline, not from the drafting prompt getting lucky.

The gap shows up inside sections too. One-shot warm-up/cooldown copy reads like:

> **Before:** "Warming up is important before exercise. You should also cool down afterward to help your muscles recover. Make sure to include a variety of exercises in your main workout."

Working from Stage 4's specific key points (dynamic vs. static, 5–15 minutes, scaled to session length), Stage 5 wrote:

> **After:** "A proper warm-up raises your body temperature, increases blood flow to working muscles, and primes your nervous system for the effort ahead. Use dynamic movements — leg swings, hip circles, light bodyweight squats, shoulder rotations — not static stretching. Save the long holds for after."

Neither "before" is false. They're placeholders for information rather than the information itself — and closing that gap is the entire job of Stages 2 through 4, before drafting starts.

## Why files instead of a "real" system

The obvious question is why this isn't a database with a status column. A few reasons it stayed as folders of Markdown:

- **Every checkpoint is a plain-text diff.** I can `git diff` an outline edit the same way I'd review code.
- **The human review stage isn't bolted on** — it's just me opening a file. No export/import step between "AI drafted this" and "I'm editing this."
- **Nothing is hidden.** If Stage 5's output looks off, I read Stage 4's outline and Stage 2's research directly — the inputs that produced it are sitting right there, not buried in a prompt log.
- **It's trivially resumable.** Each skill finds "the most recent file in `content-X/`" rather than tracking a run ID, so I can stop after Stage 3, come back a week later, and Stage 4 still knows where to pick up.

## What I'd tell someone building the same thing

Split by responsibility, not convenience. Every one of these stages could have been one mega-prompt — "research, outline, and draft this article" — and early on that's what I tried. It produced outlines that mirrored the SERP instead of arguing anything, and drafts that read fine paragraph by paragraph but never added up to a point. A hard boundary fixed it: research extracts, it doesn't synthesise; the outline synthesises, it doesn't draft. Each prompt only had one job to be good at.

And the human-review stage isn't a courtesy — it's the constraint the rest of the pipeline is built around. AI drafts state wrong things confidently, and no amount of upstream research fixes that; a person still has to read it. That's the same reason Stage 4 weights my one sentence of context over everything already ranking. The machine handles what it's good at, and the judgment stays with me.

Seven skills, a few Markdown conventions, no infrastructure. But it turned "I should write about this" into a repeatable path with a real checkpoint for judgment in the middle — instead of either a blank page or an unreviewed wall of AI text.