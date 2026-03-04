# PalGate → Homey App Migration Plan

## מה הומר מהריפו homebridge-palgate

- לוגיקת API ל־PalGate (`devices`, `open-gate`, `check-token`)
- אלגוריתם יצירת temporary token
- תמיכה ב־multi-output devices (`deviceId:outputNum`)
- התנהגות stateless להפעלה (כפתור/סוויץ׳ שמופעל וחוזר ל־off)

## ארכיטקטורה ב־Homey SDK v3

- `app.js` – bootstrap
- `lib/palgate-api.js` – לקוח API
- `lib/token-gen.js` + `lib/utils/*` – יצירת token
- `drivers/palgate-gate/driver.js` – Pairing + discovery
- `drivers/palgate-gate/device.js` – פתיחת שער בפועל

## מה עדיין צריך להשלים לפני publish

1. **מסך הגדרות App**
   - שדות: `session token`, `phone number`, `tokenType`
   - כפתור Validate מול `user/check-token`

2. **Pair UI מתקדם**
   - הצגת שמות שערים, hide/rename
   - אפשרות map עבור שערים מרובי יציאות

3. **Flow cards**
   - Action: Open gate
   - Condition (אופציונלי): last trigger success

4. **אבטחה**
   - masking לוגים
   - מניעת הדפסת token מלא

5. **קשיחות תפעולית**
   - retry/backoff
   - טיפול rate-limit / timeout

6. **בדיקות**
   - unit עבור token-gen
   - unit עבור multi-output parser
   - integration mock ל־API

## הערות חשובות

- אין אינדיקציה אמינה למצב פיזי פתוח/סגור מה־API, לכן האפליקציה בנויה כטריגר פתיחה (stateless).
- יש לבדוק תאימות משפטית/ToS מול PalGate לפני הפצה פומבית ב־Homey App Store.
