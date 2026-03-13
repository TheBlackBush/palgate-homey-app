# PalGate Homey App (converted from homebridge-palgate)

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/TheBlackBush/palgate-homey-app?sort=semver)](https://github.com/TheBlackBush/palgate-homey-app/releases)
[![GitHub last commit](https://img.shields.io/github/last-commit/TheBlackBush/palgate-homey-app)](https://github.com/TheBlackBush/palgate-homey-app/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/TheBlackBush/palgate-homey-app)](https://github.com/TheBlackBush/palgate-homey-app/issues)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](./LICENSE)

## Current status

Prototype conversion (SDK v3) with:
- Pairing + gate discovery from PalGate API
- Multi-output gate support (`deviceId:outputNum`)
- Garage door tile triggers gate open (stateless pulse with auto-return to closed)
- Flow action card: **Open PalGate gate**
- App settings page for token/phone/tokenType

## Setup

1. Open app settings in Homey and set:
   - `palgate_session_token` (hex)
   - `palgate_phone_number`
   - `palgate_token_type` (0/1/2)
   - `palgate_auto_off_ms` (default 5000, range 2000-60000)
2. Pair `PalGate Gate` devices.
3. Test from device tile or Flow action card.

## Dev

```bash
npm install
homey app validate
homey app run
```

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

GPL-3.0 — see [LICENSE](./LICENSE).
