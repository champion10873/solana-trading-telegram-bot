const { trim } = require('@/utils');

const LAMPORTS_PER_SOL = 1_000_000_000;
const referralsMsg = ({ code, referrals, income }) => `
  <b>REFERRALS:</b>

  🔗 Your reflink: <a href="https://t.me/${process.env.BOT_USERNAME}?start=ref_${code}">https://t.me/${process.env.BOT_USERNAME}?start=ref_${code}</a>

  👥 Referrals: <b>${referrals}</b>
  💰 Lifetime SOL earned: <b>${income / LAMPORTS_PER_SOL} SOL</b>

  <i>🔥 Rewards are updated in real-time, you receive them automatically with every new trade in your friend network.

  Refer your friends and earn <b>30</b>% of their fees!</i>
`;

module.exports = {
  referralsMsg: (params) => trim(referralsMsg(params)),
};
