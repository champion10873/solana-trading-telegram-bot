const { trim } = require('@/utils');

const helpMsg = () => `
  Help:

  Which tokens can I trade?
  Any SPL token that is a Sol pair, on Jupiter. Jupiter will pick up non sol pairs within around 15 minutes

  How can I see how much money I've made from referrals?
  Check the referrals button or type /referrals to see your payment in Tonk Sniper !

  I want to create a new wallet on Tonk Sniper bot.
  Type /wallet, and you will be able to configure your new wallets.

  Is Tonk Sniper bot free? How much do i pay for transactions?
  Tonk Sniper bot is completely free! We charge 1% on transactions, and keep the bot free so that anyone can use it.
`;

module.exports = {
  helpMsg: (params) => trim(helpMsg(params)),
};
