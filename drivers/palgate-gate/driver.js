'use strict';

const Homey = require('homey');
const { PalGateApi } = require('../../lib/palgate-api');

class PalGateGateDriver extends Homey.Driver {
  async _listDevices() {
    this.log('[pair] listing devices...');

    const sessionToken = String(this.homey.settings.get('palgate_session_token') || '').trim();
    const phoneNumber = String(this.homey.settings.get('palgate_phone_number') || '').trim();
    const tokenType = Number(this.homey.settings.get('palgate_token_type'));

    if (!sessionToken || !phoneNumber || Number.isNaN(tokenType)) {
      this.error('[pair] missing settings', { hasToken: !!sessionToken, hasPhone: !!phoneNumber, tokenType });
      throw new Error('Missing PalGate credentials in app settings. Open app settings and save token/phone/type first.');
    }

    const api = new PalGateApi({ sessionToken, phoneNumber, tokenType });
    await api.validate();
    const gates = await api.listGates();
    this.log(`[pair] found ${gates.length} gate entries`);

    return gates.map((g) => ({
      name: g.name,
      data: { id: g.deviceId },
      settings: { palgate_device_id: g.deviceId },
    }));
  }

  async onPair(session) {
    session.setHandler('list_devices', async () => {
      try {
        return await this._listDevices();
      } catch (e) {
        this.error('[pair] failed listing gates', e);
        throw new Error(`Failed loading gates from PalGate API: ${e.message}`);
      }
    });
  }

  async onPairListDevices() {
    return this._listDevices();
  }
}

module.exports = PalGateGateDriver;
