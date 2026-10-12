# PalGate Homey App (converted from homebridge-palgate)

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/TheBlackBush/palgate-homey-app?sort=semver&style=for-the-badge)](https://github.com/TheBlackBush/palgate-homey-app/releases)
[![GitHub last commit](https://img.shields.io/github/last-commit/TheBlackBush/palgate-homey-app?style=for-the-badge)](https://github.com/TheBlackBush/palgate-homey-app/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/TheBlackBush/palgate-homey-app?style=for-the-badge)](https://github.com/TheBlackBush/palgate-homey-app/issues)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](./LICENSE)
[![Ko-fi](https://img.shields.io/badge/support_me_on_ko--fi-F16061?style=for-the-badge&logo=kofi&logoColor=f5f5f5)](https://ko-fi.com/M4M11W3R7J)

## Features

- Link your PalGate account from the app settings by scanning a QR code with the PalGate app (no password or SMS code needed)
- Pairing and gate discovery from the PalGate API
- Multi-output gate support: each enabled output becomes its own Homey device (`deviceId:outputNum`)
- Garage door tile opens the gate (stateless pulse that returns to closed after a configurable delay)
- Works with Homey's built-in garage door Flow cards and voice assistants

**User guide:** [PalGate Control on the homey-apps-support wiki](https://github.com/TheBlackBush/homey-apps-support/wiki/PalGate-Control). Report problems and request features in [homey-apps-support issues](https://github.com/TheBlackBush/homey-apps-support/issues/new/choose).

## Setup

1. In Homey, open **Settings → Apps → PalGate Control → Configure**.
2. Tap **Link with PalGate App** and scan the QR code from the PalGate app (**Device Linking → Link a Device**). The connection is saved automatically. Alternatively, open **Connect with a session token** and enter the phone number, account type and session token; they are tested before saving.
3. Use **Test connection** to confirm how many gates the account can open.
4. Add devices with **Devices → + → PalGate Control → PalGate Gate**.

The app stores these app-level settings: `palgate_session_token` (hex), `palgate_phone_number`, `palgate_token_type` (0 SMS, 1 primary, 2 linked device) and `palgate_auto_off_ms` (2000 to 60000, default 5000).

## Dev

```bash
npm install
npm run release-check   # lint + publish-level validation
homey app run
```

App Web API (used by the settings page): `GET /init_link`, `GET /confirm_link?uniqueId=...`, `POST /test_connection`.

## Release automation

- PRs and pushes to `main` run Homey app validation.
- Publishing a new GitHub Release triggers automatic Homey App Store publish.
- Required repo secret for publish workflow: `HOMEY_PAT`.

## Notes

- This app triggers gate open; it does not provide reliable physical open/closed state from PalGate.
- Verify legal/ToS compliance before public distribution.

## Credits

Original plugin created by [@RoeiOfri](https://github.com/RoeiOfri).

API logic discovered by [@DonutByte](https://github.com/DonutByte).

Rewrite and platform migration by [@Knilo](https://github.com/Knilo).

Homey app conversion by [@TheBlackBush](https://github.com/TheBlackBush).

## License

GPL-3.0: see [LICENSE](./LICENSE).
