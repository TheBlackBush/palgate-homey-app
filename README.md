# PalGate Homey App (converted from homebridge-palgate)

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

## Notes

- This app triggers gate open; it does not provide reliable physical open/closed state from PalGate.
- Verify legal/ToS compliance before public distribution.
