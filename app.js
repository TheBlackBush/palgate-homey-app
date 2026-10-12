'use strict';

const Homey = require('homey');
const axios = require('axios');
const crypto = require('crypto');
const { PalGateApi } = require('./lib/palgate-api');

class PalGateApp extends Homey.App {
  async onInit() {
    this.log('PalGate app initialized');
    this._linkSessions = new Map();

  }

  async initLinkSession() {
    const uniqueId = crypto.randomUUID();
    this._linkSessions.set(uniqueId, {
      createdAt: Date.now(),
      done: false,
      phoneNumber: null,
      sessionToken: null,
      tokenType: null,
    });

    const qrPayload = JSON.stringify({ id: uniqueId });
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrPayload)}&size=300`;

    return {
      success: true, uniqueId, qrPayload, qrUrl,
    };
  }

  async confirmLinkSession(uniqueId) {
    if (!uniqueId) throw new Error('No uniqueId provided');

    const session = this._linkSessions.get(uniqueId);
    if (!session) throw new Error(`No link session for uniqueId: ${uniqueId}`);

    if (session.done) {
      return {
        success: true,
        phoneNumber: session.phoneNumber,
        sessionToken: session.sessionToken,
        tokenType: session.tokenType,
      };
    }

    const endpoint = `https://api1.pal-es.com/v1/bt/un/secondary/init/${uniqueId}`;
    const { data } = await axios.get(endpoint, { timeout: 15000 });

    if (!data?.user || data?.secondary === undefined || data?.secondary === null) {
      return { success: false, waiting: true };
    }

    session.done = true;
    session.phoneNumber = String(data.user.id || '');
    session.sessionToken = String(data.user.token || '');
    session.tokenType = Number(data.secondary);

    // Store the credentials right away so the user does not have to press Save.
    this.homey.settings.set('palgate_session_token', session.sessionToken);
    this.homey.settings.set('palgate_phone_number', session.phoneNumber);
    this.homey.settings.set('palgate_token_type', session.tokenType);

    return {
      success: true,
      phoneNumber: session.phoneNumber,
      sessionToken: session.sessionToken,
      tokenType: session.tokenType,
    };
  }

  // Checks credentials against PalGate and returns how many gates they can open.
  // Uses the given credentials when present, otherwise the stored ones.
  async testConnection({ sessionToken, phoneNumber, tokenType } = {}) {
    const creds = {
      sessionToken: sessionToken ?? this.homey.settings.get('palgate_session_token'),
      phoneNumber: phoneNumber ?? this.homey.settings.get('palgate_phone_number'),
      tokenType: tokenType ?? this.homey.settings.get('palgate_token_type'),
    };
    if (!creds.sessionToken || !creds.phoneNumber || creds.tokenType === null || creds.tokenType === undefined) {
      throw new Error('Not connected');
    }

    const api = new PalGateApi(creds);
    await api.validate();
    const gates = await api.listGates();
    return { success: true, gates: gates.length };
  }
}

module.exports = PalGateApp;
