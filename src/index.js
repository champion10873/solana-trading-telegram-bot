require('dotenv').config();
require('module-alias/register');

const bot = require('@/configs/bot');
const router = require('@/routes');
const store = require('@/store');
const { initStore } = require('@/store/utils');

(async () => {
  await initStore(store);

  router(bot);
})();

console.log("\n Sniper bot is running... \n");