const { trim } = require('@/utils');

const LAMPORTS_PER_SOL = 1_000_000_000;
const referralsMsg = ({ code, referrals, income }) => `
  <b>REFERRALS:</b>

  🔗 Your reflink: <a href="https://t.me/tonksniper_bot?start=ref_${code}">https://t.me/tonksniper_bot?start=ref_${code}</a>

  👥 Referrals: <b>${referrals}</b>
  💰 Lifetime SOL earned: <b>${income / LAMPORTS_PER_SOL} SOL</b>

  <i>🔥 Rewards are updated at real time and rewards are automatically deposited to your Tonk Sniper balance.

  Refer your friends and earn <b>30</b>% of their fees!</i>
`;

module.exports = {
  referralsMsg: (params) => trim(referralsMsg(params)),
};
