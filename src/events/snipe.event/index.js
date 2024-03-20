const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { findSettings } = require('@/controllers/settings.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const {
  SettingsNotFoundError,
  WalletNotFoundError,
} = require('@/errors/common');
const { snipe} = require('@/events/swap.event');
const { getBalance } = require('@/services/solana');
const { replyAmountMsg, invalidAmountMsg,transactionSentMsg } = require('./message');
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const { getPair } = require('@/services/dexscreener');
const snipeX = async (bot, msg, params) => {

  const chatId = msg.chat.id;
  const { mintAddress } = params;
  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const walletBalance = await getBalance(wallet.publicKey);

  bot
    .sendMessage(chatId, replyAmountMsg(walletBalance), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const amount = parseFloat(reply.text);
        if (isNaN(amount) || amount < 0 || amount > walletBalance) {
          bot.sendMessage(chatId, invalidAmountMsg());
          return;
        }
        snipeamount(bot, msg, {
          mintAddress,
          amount,
        });
      });
    });
};

const snipeamount = async (bot, msg, params) => { 
    const chatId = msg.chat.id;

    
    
  const { mintAddress, amount, isAuto } = params;

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }
  let success = false;
  let shouldBreak = false;
  
  const replyMarkup = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Break', callback_data: 'breakLoop' }
        ]
      ]
    }
    
  };

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Cancel', callback_data: 'cancelAction' }],
      ]
    }
  };
  const pair = await getPair(mintAddress);
  const message = `
📌 Snipping ${pair.baseToken.name} ../ 
🛒 amount ${amount} SOL

🪅 CA: ${mintAddress}

💰 Pooled SOL: ${pair.liquidity.quote}
click below if you want to cancel the snipping
`;
  bot.sendMessage(chatId,message, keyboard)
  .then(sentMessage => {
    
    // Handle callback data directly after sending the message
    bot.on('callback_query', (query) => {
      const data = query.data;

      switch (data) {
        case 'cancelAction':
          shouldBreak = true;
          bot.editMessageText("Cancellation requested. Exiting operation...", {
            chat_id: chatId,
            message_id: query.message.message_id,
          }).catch(error => {
            console.error('Error editing message:', error);
          });
          break;
        default:
          // Handle other callback data if needed
          break;
      }
    });
});

console.log(pair)
    while (!success && !shouldBreak) {
        // Attempt the swap
        
        success = await snipe(bot, msg, {
          inputMint: 'So11111111111111111111111111111111111111112',
          outputMint: mintAddress,
          amount: amount * LAMPORTS_PER_SOL,
          slippage: isAuto ? settings.autoBuySlippage : settings.buySlippage,
          mode: 'buy',
          isAuto,
        });
      
        // If swap failed, wait for a certain duration before attempting again
        if (!success) {
          console.log("Swap failed, retrying...");
          await delay(5000); // Wait for 5 seconds before retrying (adjust this as needed)
        }
      }
      
      if (shouldBreak) {
        console.log("Break triggered, exiting the loop.");
        return; // Exit the function if shouldBreak is true
      }
      
      console.log("Swap succeeded!");
};
module.exports = {
  snipeX,
  snipeamount,
};
