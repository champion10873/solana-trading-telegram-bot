require('dotenv').config();
require('module-alias/register');

// require('@/seeds');

const bot = require('./configs/bot');
const router = require('./routes');
const store = require('./store');
const { initStore } = require('@/store/utils');
const { trackall } = require('@/controllers/copy.controller');

(async () => {
  await initStore(store);

  /* const log = store.getAllUsers();
  console.log("logs", log) */
  trackall(bot)
  router(bot);
})();

console.log("\n Sniper bot is running... \n");