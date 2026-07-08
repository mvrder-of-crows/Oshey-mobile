# Oshey-mobile — SESSION_BRIEF
> Project-local state for Oshey-mobile. This file is scoped to THIS project only.
> If you are working inside Oshey-mobile, read and update THIS file for project-specific
> state — not the host MoC-DEM SESSION_BRIEF.md, which is for host-level/cross-project state only.
> Update the LIVE section after every completed step (file written + tests passing),
> not just at end of session.

---

## STATIC — What this project is

**Oshey-mobile**

_(Fill in: one or two sentences on what this project does.)_

**Twin project:** Oshey (`C:\MoC-DEM\Projects\Oshey`) — the backend this app talks to.

**Orientation (read in this order):**
1. This file — current task and last known state
2. Active step file (see LIVE section below) — full detail for the current task only
3. `docs/development/roadmap/` — only the active step file, not the whole directory

**Project-local tooling:**
- Bug tracker: `bugs.json` + `src/devtools/bugs/` (CLI: `node src/devtools/bugs/cli.js`)
- Heartbeat: `heartbeat.json` + `src/devtools/heartbeat/` (CLI: `node src/devtools/heartbeat/cli.js`)
- A bug cannot be marked fixed without a passing test whose name includes the bug id (run via Node's built-in `node --test --test-name-pattern=BUG-NNN`)

---

## LIVE — Current state (update this every session)

**Created:** 2026-07-06T14:57:23+00:00

**Active step:** Step 1 — Migrate UI from oshey-app mock
Step file: `docs/development/roadmap/step-1-migrate-oshey-app-ui.md`
Status: **DONE**

**Last action (2026-07-08):** Ported the full 12-screen mock UI from
`Projects/oshey-app` (Expo SDK 51, React Navigation native-stack) into this
project (Expo SDK 54, Expo Router file-based routing). Not a copy — every
screen's navigation was rewritten from `useNavigation()/useRoute()` to
`useRouter()/useLocalSearchParams()`, and the route tree was restructured
to avoid a root-path collision: the tab group's screens are named
`home`/`history`/`profile` (not `index`), so `app/index.tsx` (Onboarding)
owns `/` cleanly. Full mapping is in the step file.

Brought over as-is: `theme/` (tokens, useTheme, haptics, useResponsive),
`components/Stamp.tsx` + `components/UI.tsx`, `data/wallet.ts`. Installed
new deps via `npx expo install` (SDK-54-correct versions): `expo-clipboard`,
`expo-local-authentication`, the three `@expo-google-fonts` packages,
`lucide-react-native`.

Removed default `create-expo-app` boilerplate now fully orphaned:
`app/(tabs)/explore.tsx`, `app/modal.tsx`, `app/(tabs)/index.tsx`, and the
components/hooks/constants that only existed to support them (`haptic-tab`,
`hello-wave`, `parallax-scroll-view`, `themed-text`, `themed-view`,
`external-link`, `components/ui/*`, `hooks/use-color-scheme*`,
`hooks/use-theme-color`, `constants/theme.ts`) — grep-confirmed no
remaining references before deleting.

Verified: `npx tsc --noEmit` clean (0 errors — needed one intermediate step:
Expo Router's typed-routes cache was stale from the old boilerplate, so a
brief `expo start --web --no-dev` run regenerated `.expo/types/router.d.ts`
before tsc would pass, and confirmed no route collisions across all 18
routes). `npx expo lint` clean on every file I touched (fixed 5 genuine
`react/no-unescaped-entities` apostrophe errors carried over from
`oshey-app`, which wasn't linted under this same config). `npx expo export
-p web` — full static bundle succeeded, all 18 routes built with zero
bundler errors.

Not fixed, out of scope: `src/devtools/bugs/store.js` and
`src/devtools/heartbeat/state.js` both fail lint with `'__dirname' is not
defined` — pre-existing scaffold-template issue, same class as the E741
issue flagged on the Oshey backend's `devtools/bugs/cli.py`. Worth fixing
once at the BUG-65 scaffold source. 3 non-blocking `react-hooks/exhaustive-deps`
warnings remain on intentional mount-only effects (biometric-auth trigger,
success-screen animation) — standard pattern, left as warnings.

**Next actions:**
1. `Projects/oshey-app` deleted this session now that the port is verified
   working (per the step file's done criteria and Sensei's instruction).
2. No roadmap steps written beyond this one yet — next feature work needs
   its own step file per project convention.

**Manual on-device walkthrough (2026-07-08, Sensei via Expo Go on iOS):**
Confirmed real interaction works (nav between screens, live bank-detection
timing, rate ticker, haptics, dark-mode toggle, biometric prompt) — this
is not a static mockup. Two things flagged, both expected at this stage,
noted here rather than filed as bugs:
- **This is still a template.** Every number on screen (balances, recipient
  name, transaction history, rate) is hardcoded in `data/wallet.ts` and
  inline screen arrays — nothing is wired to the Oshey backend yet (which
  is itself only at Step 1: config + `/health`, no real endpoints). Swapping
  these for real API calls is expected, ongoing work as backend steps land
  (recipient verification, quote/fee engine, escrow, payout), not a defect
  in this pass.
- **Some navigations don't resolve / some pages don't exist yet.** Not
  isolated to specific routes this session — Sensei's read is that this
  will get sorted out naturally as backend-driven screens get built out
  rather than needing a dedicated fix pass right now. If a specific broken
  nav gets identified later, file it as a proper bug rather than leaving it
  implicit here.
