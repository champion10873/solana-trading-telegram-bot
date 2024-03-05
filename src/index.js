require('dotenv').config();
require('module-alias/register');

// require('@/seeds');

const bot = require('@/configs/bot');
const router = require('@/routes');
const store = require('@/store');
const { initStore } = require('@/store/utils');

(async () => {
  await initStore(store);

  /* const log = store.getAllUsers();
  console.log("logs", log) */

  router(bot);
})();

console.log("\n Sniper bot is running... \n");