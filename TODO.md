# Next product experiments

## 1. First-minute value

Show the prototype to 5–8 native Hebrew readers on their phones without explanation. Give them three minutes. Ask which idea they remember and whether the time felt worthwhile. Observe hesitation around the first card and topic chips. Keep a simple interview sheet; no analytics infrastructure is needed.

Decision: improve hooks or shorten the first card if fewer than five of eight readers can recall a useful idea without reopening the app.

## 2. Feed rhythm and readability

Time 10 representative cards with readers. Compare the current mixed feed against a version with shorter bodies and fewer repeated takeaway blocks. Test topic chips on small phones and at enlarged text. Ask whether `לקחתי משהו` feels natural or like homework.

Decision: choose text length and interaction frequency based on comprehension and enjoyment, not scroll distance.

## 3. Five-card session versus discovery

Give each participant both modes in alternating order. Record completion, voluntary saves, one recalled idea, and whether the session felt like a useful five-minute pause. Check whether people find the mobile session entry point naturally.

Decision: prioritize sessions only if they improve perceived value without adding pressure.

## 4. Real Hebrew audio

Produce one 4–7 minute MP3 using NotebookLM or another service outside this app. Review pronunciation, claims, attribution, and rights. Add its `audioUrl`, and test play/pause, seek, speed, backgrounding, phone interruptions, and network errors on physical iOS and Android devices. Add a transcript if listeners need it.

Decision: invest in an audio workflow only after people choose and finish a real episode.

## 5. Saved ideas after a week

Ask readers to use Saved over seven days. Interview them about retrieval and reuse. No notifications are required. Test whether topical organization is enough before adding folders, search, or reminders.

Decision: add sync only if device-local collections are a demonstrated obstacle.

## 6. Editorial quality before expansion

Have a native Hebrew editor review every card and a second reader verify each external claim against the exact source. Check the remaining research references, paywalls, reading estimates, balanced topic appeal, and whether original editorial suggestions dominate too much. Replace weak ideas before expanding past 40 cards.

## Implementation follow-ups driven by these results

- Verify VoiceOver/TalkBack, 200% browser zoom, and source-link behavior on physical devices.
- Test a real MP3 with autoplay restrictions and media interruptions. Current browser QA exercises silent demos.
- Consider preserving quiz answers within a resumed session if re-answering feels confusing.
- Consider browser-history-aware feed scroll restoration; view changes currently return to the top.
- If topic preferences prove useful, persist them and explain personalization honestly.
- If content distribution becomes necessary, introduce an async content repository and loading/error states.
- If sync becomes necessary, design Supabase tables and access policies then migrate the progress adapter.

No backend, auth, recommendation engine, payment flow, or notification system is scheduled ahead of product evidence.
