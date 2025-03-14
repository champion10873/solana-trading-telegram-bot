const startKeyboard = () => [
  [
    { text: '✨ Buy', callback_data: 'buyToken' },
    { text: '📍 Token Sniper', callback_data: 'tokenSniper' },
    { text: '✨ Sell & Manage', callback_data: 'managePositions' },
  ],
  [
    { text: '💳 Wallet', callback_data: 'showWallet' },
    { text: '🎮 Copy Trades', callback_data: 'copyTrades' },
    { text: '🛠️ Settings', callback_data: 'showSettings' },
  ],
  [
    { text: '🧢 Refer Friends', callback_data: 'showReferrals' },
    { text: '🔄 Refresh', callback_data: 'refreshStart' },
    { text: '© Copy channels', callback_data: 'copyT' }
  ],
];

module.exports = {
  startKeyboard,
};
