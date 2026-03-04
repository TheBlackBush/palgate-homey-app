'use strict';

const { generateToken } = require('./token-gen');
const { getDevices, openGate, validateToken } = require('./api.raw');
const { detectMultiOutputDevices, generateGateEntries } = require('./utils/helpers');

class PalGateApi {
  constructor({ sessionToken, phoneNumber, tokenType }) {
    this.sessionToken = String(sessionToken || '').trim();
    this.phoneNumber = String(phoneNumber || '').trim();
    this.tokenType = Number(tokenType);
  }

  _tempToken() {
    const sessionBytes = Buffer.from(this.sessionToken, 'hex');
    return generateToken(sessionBytes, parseInt(this.phoneNumber, 10), parseInt(this.tokenType, 10));
  }

  async validate() {
    return validateToken(this._tempToken());
  }

  async listGates() {
    const data = await getDevices(this._tempToken());
    const devices = Array.isArray(data.devices) ? data.devices : [];

    return devices.flatMap((d) => {
      const id = d.id || d._id;
      const name = d.name1 || id;
      const outputs = detectMultiOutputDevices(d);
      return generateGateEntries(id, outputs, name, d).map((g) => ({ ...g, raw: d }));
    });
  }

  async openGate(deviceIdOrOutput) {
    return openGate(deviceIdOrOutput, this._tempToken());
  }
}

module.exports = { PalGateApi };
