const { findSettings } = require('@/controllers/settings.controller');
const { SettingsNotFoundError } = require('@/errors/common');
const { swap } = require('@/events/swap.event');
const { getAccount } = require('@/services/solscan');
const { replyAmountMsg, invalidAmountMsg } = require('./messages');

const sellX = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { ata } = params;

  bot
    .sendMessage(chatId, replyAmountMsg(), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const percent = parseFloat(reply.text);
        if (isNaN(percent) || percent < 0 || percent > 100) {
          bot.sendMessage(chatId, invalidAmountMsg());
          return;
        }
        sellPercent(bot, msg, { ata, percent });
      });
    });
};

const sellPercent = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { ata, percent } = params;
  const { tokenInfo } = await getAccount(ata);

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  swap(bot, msg, {
    inputMint: tokenInfo.tokenAddress,
    outputMint: 'So11111111111111111111111111111111111111112',
    amount: parseInt((tokenInfo.tokenAmount.amount * percent) / 100),
    slippage: settings.sellSlippage,
    mode: 'sell',
  });
};

module.exports = {
  sellX,
  sellPercent,
};
