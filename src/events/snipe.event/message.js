const { trim } = require('@/utils');

const replyAmountMsg = (walletBalance) => `
  ↪️ Reply with the amount you wish to Snipe (0 - ${walletBalance} SOL):
`;

const invalidAmountMsg = () => `Invalid amount. Press button and try again.`;


const transactionSentMsg = () => `
  ➡ Transaction sent. Waiting for confirmation...
`;
module.exports = {
    replyAmountMsg: (params) => trim(replyAmountMsg(params)),
    invalidAmountMsg: () => trim(invalidAmountMsg()), transactionSentMsg: ({ mode, isAuto }) =>
    trim(wrapAutoBuy(transactionSentMsg(), mode, isAuto))
  };