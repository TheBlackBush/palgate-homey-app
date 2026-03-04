'use strict';

module.exports = {
  async init_link({ homey }) {
    try {
      return await homey.app.initLinkSession();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async confirm_link({ homey, query }) {
    try {
      const uniqueId = query?.uniqueId;
      return await homey.app.confirmLinkSession(uniqueId);
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
