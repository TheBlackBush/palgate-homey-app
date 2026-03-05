'use strict';

const Homey = require('homey');
const axios = require('axios');
const crypto = require('crypto');

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

    return {
      success: true,
      phoneNumber: session.phoneNumber,
      sessionToken: session.sessionToken,
      tokenType: session.tokenType,
    };
  }
}

module.exports = PalGateApp;
