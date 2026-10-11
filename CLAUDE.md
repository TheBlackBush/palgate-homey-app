# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Homey Pro app (Apps SDK v3, app id `com.pal-es`) that opens PalGate gates. It is a port of the `homebridge-palgate` plugin: the PalGate API client and the temporary-token algorithm were carried over from there.

## Commands

```bash
npm install
npm run lint            # eslint (athom config)
npm run validate        # homey app validate --level=publish
npm run release-check   # lint + validate; run before any release
homey app run           # run on the local Homey with live logs
```

There is no test suite.

## Architecture

**Credential flow.** All PalGate credentials are app-level Homey settings, not per-device: `palgate_session_token` (hex, 16 bytes), `palgate_phone_number`, `palgate_token_type` (0 = SMS, 1 = primary, 2 = secondary), plus `palgate_auto_off_ms`. They are written by the custom settings page `settings/index.html`, either manually or via the "link device" QR flow:
- Settings page calls `GET /init_link` (`api.js` → `app.js#initLinkSession`), which creates an in-memory session keyed by a random UUID and returns a QR code (rendered through quickchart.io).
- The user scans it with the PalGate mobile app; the settings page polls `GET /confirm_link`, which hits `api1.pal-es.com/v1/bt/un/secondary/init/{uuid}` until PalGate returns the user id, token and token type.
- Link sessions live only in memory (`this._linkSessions`); an app restart loses them.

**API layering.**
- `lib/api.raw.js`: axios client for `https://api1.pal-es.com/v1/bt/`; every call sends a freshly generated token in the `x-bt-token` header.
- `lib/token-gen.js` + `lib/utils/{aes,constants,helpers}.js`: derives the per-request temporary token from session token, phone number, token type and current time, using a hand-rolled AES implementation. Treat this as a verified port; don't "simplify" it into Node `crypto` without checking byte-for-byte output.
- `lib/palgate-api.js`: `PalGateApi` wrapper used by the driver and device (`validate`, `listGates`, `openGate`). A new instance is constructed from settings on every operation.

**Multi-output gates.** `listGates` expands a PalGate device with multiple outputs into separate Homey devices whose id is `deviceId:outputNum`. `openGate` in `api.raw.js` splits that back into device id and `outputNum`. Single-output devices use the bare id (output 1).

**Device behavior** (`drivers/palgate-gate/`). Class `garagedoor` with only `garagedoor_closed`. The gate is stateless: setting `garagedoor_closed` to `false` sends the open command, then the device flips back to closed after `palgate_auto_off_ms` (clamped 2000 to 60000, default 5000). API failures also reset to closed. There are no custom Flow cards (removed in 0.3.5); automation uses Homey's built-in garage door cards. The README's mention of an "Open PalGate gate" action card is stale.

**Manifest.** There is no `.homeycompose/` directory, so `app.json` is the source of truth and is edited directly. `drivers/palgate-gate/driver.compose.json` duplicates the driver block; keep the two in sync if you change the driver.

## Releases

Follow `.claude/release/release-rules.md`. In short, a version bump means all of:
1. Same version in `app.json` and `package.json`.
2. New top section in `CHANGELOG.md`.
3. Matching key in `.homeychangelog.json` (`en` required, `he` preferred). It is required for the headless App Store publish.
4. `npm run release-check` passes.
5. Commit, push to `main`, tag `vX.Y.Z`, push the tag, create a GitHub Release with notes matching the changelog.

The remote is GitHub (`TheBlackBush/palgate-homey-app`), not GitLab. Publishing a GitHub Release triggers `.github/workflows/homey-publish.yml`, which publishes to the Homey App Store using the `HOMEY_PAT` secret. Pushes and PRs to `main` run publish-level validation.

## Local docs and user support

`.claude/` (gitignored) holds the local working docs; see `.claude/README.md`. The user guide lives at `.claude/support/palgate-guide.md` and is published as `palgate/README.md` in `TheBlackBush/homey-apps-support`, whose wiki page (`/wiki/PalGate-Control`) is the app's `support` URL. Issues go to that repo, not this one. Update the guide there when user-facing behavior changes.
