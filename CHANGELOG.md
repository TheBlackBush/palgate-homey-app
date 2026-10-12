# Changelog

## 0.5.0 (2026-10-12)
- Redesigned the app settings page on the Homey Style Library: connection status badge, numbered linking steps, and a QR code with a countdown and "Get a new code" when it expires.
- Linking with the PalGate app now saves the connection by itself (no Save step).
- New Test connection button that checks the account with PalGate and shows how many gates it can open; new Link again and Disconnect buttons.
- The gate open time is now picked in seconds and saves on change.
- Manual entry moved to a collapsed "Connect with a session token" section that checks the phone number and token format and tests the details before saving.
- New app API endpoint `POST /test_connection`.

## 0.4.4 (2026-10-11)
- App Store support link now opens the PalGate Control user guide (homey-apps-support wiki).
- Homepage and bug report links now point to the homey-apps-support repository.

## 0.4.3 (2026-03-16)
- Updated app metadata repository links in `app.json` (`source`, `bugs.url`, `support`) to `TheBlackBush/palgate-homey-app`.
- Updated README badges to `for-the-badge` style.
- Added Ko-fi support badge to README.

## 0.4.2 (2026-03-13)
- Added missing Homey changelog entries required for headless publish flow.
- Prepared follow-up release to re-trigger automatic Homey publish.

## 0.4.1 (2026-03-13)
- Updated `.gitignore` with additional build artifact ignore (`dist/`).
- Updated README with release automation details and required publish secret.
- Bumped app/package version to `0.4.1`.

## 0.4.0 (2026-03-13)
- Updated app and driver visual assets for improved Homey App Store compliance.
- Updated repository references in README to the new GitHub owner/repo.
- Extended `.gitignore` with additional temporary/test artifact patterns.
- Bumped app/package version to `0.4.0`.

## 0.3.5 (2026-03-05)
- Removed custom Flow cards (`open_gate`, `gate_opened`).
- Switched to Homey built-in capability triggers/actions for gate control automation.
- Simplified app runtime by removing custom flow card registration and trigger dispatching.

## 0.3.2 (2026-03-04)
- Prepared for initial App Store publication.
- Updated manifest with required image assets and brand colors.
- Improved Hebrew translations for pairing and flow cards.
- Enhanced settings UI with mobile linking flow and polling.

## 0.3.1
- Improved gate status polling and link persistence.
- Added support for gate-opened triggers.

## 0.3.0
- Initial beta version of the PalGate Homey integration.
