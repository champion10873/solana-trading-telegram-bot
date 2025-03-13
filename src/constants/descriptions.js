const { trim } = require('@/utils');

const description = () => `
🐶 Welcome to Tonk Sniper(Solana Version)

🚀 Solana’s fastest bot to trade any coin (SPL token), and Tonk Sniper official Telegram Sniper Bot.

🤌 Blazingly-fast trading at your fingertips. Use /start to open the main menu and start using all our features - fast swaps, new token alerts, trade tracking and PNL.

Developer: @champion923
`;

const shortDescription = () => `
  Tg: https://t.me/tonkinu_official
  X: https://x.com/tonkinubot
  Doc: https://docs.tonk.bot
  Site: https://tonk.bot
`;

module.exports = {
  description: () => trim(description()),
  shortDescription: () => trim(shortDescription()),
};
