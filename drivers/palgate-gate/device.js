'use strict';

const Homey = require('homey');
const { PalGateApi } = require('../../lib/palgate-api');

class PalGateGateDevice extends Homey.Device {
  async onInit() {
    // Ensure default "closed" state for stateless trigger behavior.
    await this.setCapabilityValue('garagedoor_closed', true).catch(() => {});

    this.registerCapabilityListener('garagedoor_closed', async (value) => {
      this.log(`[gate] garagedoor_closed => ${value}`);
      // User opens gate from UI by setting "closed" to false.
      if (value !== false) return true;
      this.openGate().catch((err) => this.error('[gate] openGate failed', err));
      return true;
    });
  }

  async openGate() {
    try {
      await this._api().openGate(this.getData().id);
      this.log('[gate] open command sent');

      // Stateless UX: show open pulse then revert to closed after 5s (configurable).
      const autoOffMsRaw = Number(this.homey.settings.get('palgate_auto_off_ms'));
      const autoOffMs = Number.isFinite(autoOffMsRaw) ? Math.max(2000, Math.min(60000, Math.round(autoOffMsRaw))) : 5000;

      await this.setCapabilityValue('garagedoor_closed', false).catch(() => {});
      this.homey.setTimeout(() => {
        this.setCapabilityValue('garagedoor_closed', true).catch(this.error);
      }, autoOffMs);

      if (this.homey?.app?.triggerGateOpened) {
        await this.homey.app.triggerGateOpened(this);
      }
    } catch (err) {
      this.error('PalGate openGate error:', err?.message || err);
      // Always return UI to closed on API failure.
      await this.setCapabilityValue('garagedoor_closed', true).catch(() => {});
    }
  }

  _api() {
    const sessionToken = this.homey.settings.get('palgate_session_token');
    const phoneNumber = this.homey.settings.get('palgate_phone_number');
    const tokenType = this.homey.settings.get('palgate_token_type');
    if (!sessionToken || !phoneNumber || tokenType === null || tokenType === undefined) {
      throw new Error('Missing PalGate app credentials in settings');
    }
    return new PalGateApi({ sessionToken, phoneNumber, tokenType });
  }
}

module.exports = PalGateGateDevice;
