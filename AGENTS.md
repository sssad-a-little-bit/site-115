# Flare Studio — Codex Project Instructions

These are working instructions for Codex and other coding agents in this repository, curated for Flare Studio. Apply them on every task in this repository, subject to the user's latest request. Do not assume the referenced libraries are already installed or that all 11 need to be used. Prefer practical outcomes over adding dependencies.

## Mission
Produce a memorable, premium, custom-designed experience specific to the actual business, never a generic generated landing page. Prioritize clear user journeys, real content, accessible interactions, fast loading, and maintainable production-quality code.

## Design workflow — before writing code
Based on Anthropic's official frontend-design skill:
https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md

1. Inspect the existing app, its assets, route structure, stack, and brief. Preserve working behavior.
2. Identify the brand's subject, target audience, most persuasive real-world quality, user goal, and conversion action. For local businesses, use provided/verified facts. Never fabricate reviews, claims, prices, services, or business photographs and present them as genuine.
3. Draft a concise design direction: 4–6 HEX palette tokens, 1–2 deliberate type families with clear roles, layout/wireframe, core visual motif, hero concept, interaction plan, and mobile plan.
4. Critique the plan for generic AI visual tropes, then revise it before implementing. Reject card-grid-by-default, indiscriminate blurred gradients, identical rounded cards, meaningless numbered sections, tiny uppercase eyebrow labels on every section, decorative em-dash metadata, black+neon or cream+terracotta defaults without brand rationale, and gratuitous italic/accented words in headings.
5. Make the hero distinctive and immediately intelligible. Let typography carry a coherent visual identity; body text should be readable, generally <80 characters per line. Use structural decoration only when it communicates information.
6. Use motion selectively: one purposeful orchestrated reveal can outperform a page full of fade-up animations. Prefer feedback to user actions over constant automatic motion; honor prefers-reduced-motion.
7. Test and visually critique desktop + mobile; fix broken layout, contrast, clipping, UI states, focus-visible, real link destinations, and accessibility before finalizing.

## Engineering workflow
- Read the existing code and package manifest before choosing technology; follow the project's framework and conventions.
- Use TypeScript thoughtfully for substantial JS apps. Keep components small and semantic, types meaningful, state understandable, and styling consistent.
- Use native CSS or existing styling first. Tailwind and shadcn/ui are optional tools, not a requirement to make every interface look the same.
- Protect performance and Core Web Vitals: lazy-load heavy 3D/video, use appropriately sized images, avoid giant JS bundles and unnecessary animation work.
- Aim for usable mobile layouts and keyboard interactions; labels, alt text, contrast, focus indication and reduced-motion behavior are non-negotiable.
- Use secure coding practices: no hard-coded tokens/secrets, validate input, avoid unsafe HTML injection, verify authorization server-side for privileged actions.
- Run available build/lint/tests when possible; distinguish what was verified from what could not be run. Don't claim real visual verification or tested code without actually checking.
- Never install packages, migrate architecture, or replace existing assets merely to demonstrate a reference library. Check current APIs and licenses.

## Visual + motion reference repos (apply selectively)
1. Microsoft TypeScript — https://github.com/microsoft/TypeScript — typed, maintainable interfaces and application code.
2. Tailwind CSS — https://github.com/tailwindlabs/tailwindcss — utility-first styling and design tokens.
3. shadcn/ui — https://github.com/shadcn-ui/ui — accessible, customizable interface building blocks; redesign for brand rather than ship defaults.
4. Motion — https://github.com/motiondivision/motion — purposeful React, JS, or Vue interactions, springs and layout transitions.
5. GSAP — https://github.com/greensock/GSAP — precisely directed timelines and scroll-based sequences when warranted.
6. Three.js — https://github.com/mrdoob/three.js — 3D/WebGL/WebGPU only with an explicit visual concept, graceful fallback and performance plan.

## Video and motion-graphics reference repos (for video requests)
7. Remotion — https://github.com/remotion-dev/remotion — code-driven React compositions, captions, timing, titles, animations, and renders.
8. MoviePy — https://github.com/Zulko/moviepy — Python clip assembly, text overlays, trimming, compositing; follow v2 APIs when using v2.
9. FFmpeg — https://github.com/FFmpeg/FFmpeg — cutting, transcoding, audio/subtitle filtering and delivery encoding.
10. Blender — https://github.com/blender/blender — 3D animation, camera, lighting, rendering, VFX and compositing when scope justifies it.
11. Anthropic frontend-design skill — https://github.com/anthropics/skills/tree/main/skills/frontend-design — design-lead mindset and design-plan → critique → build → critique workflow.

For video: establish format (9:16/16:9), duration, storyboard/shot list, source media rights, pacing, audio plan, subtitle style, and export targets. Choose Remotion for programmatic motion graphics and templates, FFmpeg/MoviePy for editing/transcoding, Blender for real 3D. Do not promise a finished rendered video unless it was actually rendered and inspected.

## Flare Studio client-site standards
- Prefer a credible, premium, visually intentional, non-generic design over empty ornamentation.
- Default Russian UI and copy for Kazakhstan clients unless requested otherwise.
- For restaurant sites: prioritize atmosphere, honest photography, food, booking, directions, and prominent mobile conversion; only use true verified details. For event-driven businesses: show capacity/services only when confirmed.
- Contact actions (WhatsApp/Telegram), maps, menus, forms and permissions must be functional, not decorative mock buttons.
- Distinguish conceptual/demo content from production facts and clearly label invented example menu items/prices when allowed.
- Keep credit/link placement unobtrusive and only when the client has approved it.

## Delivery checklist
State what changed, why it fits the brand, what was tested, what is a demo or placeholder, and any remaining blockers. Provide before/after screenshots or a live preview when a working capture is possible. If a repo is static HTML, keep it static unless there is a strong functional reason to convert it.

These instructions describe a workflow and references; they do not re-train the AI model or automatically import the repositories' complete source code.
