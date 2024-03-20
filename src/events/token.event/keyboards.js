const buyTokenKeyboard = () => [[{ text: 'Close', callback_data: 'close' }]];

const tokenKeyboard = ({ mintAddress, settings }) => [
  [{ text: '❌ Cancel', callback_data: 'close' }],
  [
    { text: '🌐 Explorer', url: `https://solscan.io/account/${mintAddress}` },
    {
      text: '🐦 Birdeye',
      url: `https://birdeye.so/token/${mintAddress}?chain=solana`,
    },
    { text: '🔎 Scan', url: `https://t.me/ttfbotbot?start=sol-${mintAddress}` },
    { text: '📈 Chart', url: `https://t.me/ttfbotbot?start=solc-${mintAddress}` },
  ],
  [
    { text: '(1%) Tip SOL Amount', callback_data: `tipSOLAmount` },
  ],
  [
    {
      text: `💲 Buy ${settings.leftBuyAmount} SOL`,
      callback_data: `buyAmount ${mintAddress} ${settings.leftBuyAmount}`,
    },
    {
      text: `💲 Buy ${settings.rightBuyAmount} SOL`,
      callback_data: `buyAmount ${mintAddress} ${settings.rightBuyAmount}`,
    },
    { text: '💲 Buy X SOL', callback_data: `buyX ${mintAddress}` },
  ],
  [{ text: '🔄 Refresh', callback_data: `refreshToken ${mintAddress}` }],
];
const snipeKeyboard = ({ mintAddress, settings }) => [
  [{ text: '❌ Cancel', callback_data: 'close' }],
  [
    { text: '🌐 Explorer', url: `https://solscan.io/account/${mintAddress}` },
    {
      text: '🐦 Birdeye',
      url: `https://birdeye.so/token/${mintAddress}?chain=solana`,
    },
    { text: '🔎 Scan', url: `https://t.me/ttfbotbot?start=sol-${mintAddress}` },
    { text: '📈 Chart', url: `https://t.me/ttfbotbot?start=solc-${mintAddress}` },
  ],
  [
    { text: '(1%) Tip SOL Amount', callback_data: `tipSOLAmount` },
  ],
  [
    {
      text: `💲 snipe ${settings.leftBuyAmount} SOL`,
      callback_data: `snipeamount ${mintAddress} ${settings.leftBuyAmount}`,
    },
    {
      text: `💲 snipe ${settings.rightBuyAmount} SOL`,
      callback_data: `snipeamount ${mintAddress} ${settings.rightBuyAmount}`,
    },
    { text: '💲 snipe X SOL', callback_data: `snipex ${mintAddress} ` },
  ],
  [{ text: '🔄 Refresh', callback_data: `refreshToken ${mintAddress}` }],
];

module.exports = {
  snipeKeyboard,
  buyTokenKeyboard,
  tokenKeyboard,
};
