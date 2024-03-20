
const { trim, convertToShort, roundPrice, formatNumber } = require('@/utils');

const autoBuyMessage = ``;

const transactionInitiateMsg = (mode) => `
  Initiating ${mode}...
`;

const transactionBuildFailedMsg = () => `
  Building transaction failed, please try again.
`;

const transactionSentMsg = () => `
  Transaction sent. Waiting for confirmation...
`;

const transactionConfirmedMsg = (txid) => `
  Swap Successful
  https://solscan.io/tx/${txid}
`;

const transactionFailedMsg = (txid) => `
  Swap failed
  https://solscan.io/tx/${txid}
`;

const wrapAutoBuy = (msg, mode, isAuto) => {
  if (mode === 'buy' && isAuto) {
    return `
      ${msg}
      <i>This trade was triggered with Auto Buy enabled. To enable confirmations or change the buy amount go to Settings (press /settings).</i>
    `;
  }
  if (mode === 'sell' && isAuto) {
    return `
      ${msg}
      <i>This trade was triggered with Auto Sell enabled. To enable confirmations or change the sell percent go to Settings (press /settings).</i>
    `;
  }
  return msg;
};


const tokenMsgs = ({
  channelname,
  address,
  name,
  symbol,
  mint,
  priceUsd,
  priceChange,
  mcap,
  liquidity,
  pooledSol,
  walletBalance,
}) => {
  return `
    New call  from  __${channelname}__
    

    📌 <b>${name}</b> | <b>${symbol}</b>
    
    🪅 CA: <code>${mint}</code>

    💵 Token Price: <b>$${roundPrice(priceUsd)}</b>
    💥 5m: <b>${formatNumber(priceChange.m5)}%</b>, 1h: <b>${formatNumber(
    priceChange.h1
  )}%</b>, 6h: <b>${formatNumber(priceChange.h6)}%</b> 24h: <b>${formatNumber(
    priceChange.h24
  )}%</b>
    🔼 Market Cap: <b>$${convertToShort(mcap)}</b>
    💧 Liquidity: <b>$${convertToShort(liquidity)}</b>
    💰 Pooled SOL: <b>${pooledSol.toFixed(2)} SOL</b>

    💳 Wallet Balance: <b>${walletBalance.toFixed(4)} SOL</b>
    👇 To buy press one of the buttons below.
  `;
};
module.exports = {
  transactionInitiateMsg: ({ mode, isAuto }) =>
    trim(wrapAutoBuy(transactionInitiateMsg(mode), mode, isAuto)),

  transactionBuildFailedMsg: ({ mode, isAuto }) =>
    trim(wrapAutoBuy(transactionBuildFailedMsg(), mode, isAuto)),

  transactionSentMsg: ({ mode, isAuto }) =>
    trim(wrapAutoBuy(transactionSentMsg(), mode, isAuto)),

  transactionConfirmedMsg: ({ mode, isAuto, txid }) =>
    trim(wrapAutoBuy(transactionConfirmedMsg(txid), mode, isAuto)),

  transactionFailedMsg: ({ mode, isAuto, txid }) =>
    trim(wrapAutoBuy(transactionFailedMsg(txid), mode, isAuto)),tokenMsgs

};