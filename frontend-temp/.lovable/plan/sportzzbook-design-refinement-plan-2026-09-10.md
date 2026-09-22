# Sportzzbook design refinement plan

## Goal
Apply the requested cleaner, more confident visual system across every Sportzzbook screen while preserving the dark green background, existing content, routes, and overall layout.

## Changes
- Standardize typography: Space Grotesk at 600–700 for headings and large statistics; Inter at 400 for body copy and descriptions.
- Replace every tracked, uppercase eyebrow or statistic label with sentence-case text, stronger weight, and no letter spacing.
- Remove arrow suffixes from action links while keeping navigation meaning clear.
- Convert Explore athlete/coach results into unboxed divider-separated rows.
- Convert the Feed sidebar’s Explore and Academies entries into divider-separated rows, retaining the surrounding section organization.
- Keep Matchday, academy, and opportunity cards; preserve existing functional post and profile containers where needed for the established layout.
- Change academy initial badges to a consistent 4px rounded-square shape on academy list, Explore, and academy detail views.
- Restrict orange to primary actions and active navigation indicators. Move ratings, badges, filters, dates, decorative highlights, and secondary metadata to green or muted neutral styling.
- Replace the footer copy with: “Built for athletes who'd rather be training than filling out forms.”
- Update desktop and mobile active navigation to use an orange underline/indicator instead of orange text or filled tabs.

## Technical details
- Update global font tokens and the root font stylesheet request.
- Replace the existing `eyebrow` utility with a sentence-case section-heading treatment and revise any direct uppercase/tracking utilities in routes.
- Revise semantic class usage across Feed, Explore, Academies, Opportunities, Profiles, Create Post, Login, shared navigation, and post cards.
- Remove decorative orange background effects so orange remains action-focused.
- Verify all routes render, then check representative desktop and mobile screens for typography, row dividers, navigation indicators, and overflow.
