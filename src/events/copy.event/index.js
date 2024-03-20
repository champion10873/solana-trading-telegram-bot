const bs58 = require('bs58');
const { Keypair, PublicKey } = require('@solana/web3.js');
const connection = require('@/configs/connection');
const { WalletNotFoundError } = require('@/errors/common');
const { createTrade } = require('@/controllers/trade.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const { findSettings } = require('@/controllers/settings.controller');
const { coverFee } = require('@/features/fee.feature');
const { initiateSwap, swapToken } = require('@/features/swap.feature');
const { confirmTransaction } = require('@/services/solana');
const { getPair } = require('@/services/dexscreener');
const { tokenKeyboard } = require('./keyboard');
const { getBalance } = require('@/services/solana');
const { getTokenMetadata } = require('@/services/metaplex');
const { findStrategy } = require('@/controllers/strategy.controller');
const { getTrade } = require('@/features/trade.feature');
const { findUser } = require('@/controllers/user.controller');
const {
  getTokenAccountByIndex,
  getTokenAccountByMint,
} = require('@/features/token.feature');
const { positionMessage, noOpenPositionsMessage } = require('../manage.event/messages.js');
const { positionKeyboard, noOpenPositionsKeyboard } = require('../manage.event/keyboards.js');

const {
  transactionInitiateMsg,
  transactionBuildFailedMsg,
  transactionConfirmedMsg,
  transactionFailedMsg,tokenMsgs,
} = require('./messages');

const parseTransaction = async (bot, msg, { copyWalletAddress }, autobuy, autosell, amounts) => {
  const chatId = msg
  
  const settings = await findSettings(chatId);
  try {
    
    if (settings === null) {
      console.error(SettingsNotFoundError);
      return;
    }

    const signatures = await connection.getSignaturesForAddress(new PublicKey(copyWalletAddress));
    const transaction = await connection.getTransaction(signatures[0].signature, {
      maxSupportedTransactionVersion: 0
    });
    console.log("here I am")
    const meta = transaction.meta;
    if (meta.err) return;

    const postTokenBalances = meta.postTokenBalances;
    const preTokenBalances = meta.preTokenBalances;
    if (postTokenBalances.length === 0 || preTokenBalances.length === 0) return;

    let inputMint, outputMint, slippage, amount, mode;
    const isAuto = true;

    const targetTokenBalances = postTokenBalances.filter(one => one.owner === copyWalletAddress);
    console.log("targetTokenBalances => ", targetTokenBalances);
    if (targetTokenBalances.length <= 0) return;

    const postAmount = targetTokenBalances[0].uiTokenAmount.uiAmount;
    const preAmount = preTokenBalances.find(one => one.accountIndex === targetTokenBalances[0].accountIndex)?.uiTokenAmount.uiAmount || 0;

    const pair = await getPair(targetTokenBalances[0].mint);
    const priceSol = parseFloat(pair.priceNative);
    amount = (postAmount - preAmount) * priceSol * Math.pow(10, 9);
    
    if (postAmount === preAmount) return;
   

    if (postAmount > preAmount && autobuy == 1 && (amounts > (postAmount - preAmount) * priceSol || amounts==null)) {
      console.log("here I am")
      inputMint = 'So11111111111111111111111111111111111111112';
      outputMint = targetTokenBalances[0].mint;
      slippage = settings.autoBuySlippage;
      amount = parseInt(amount * 0.99);
      mode = 'buy';
    } else if (postAmount < preAmount && autosell == 1) {
      inputMint = targetTokenBalances[0].mint;
      outputMint = 'So11111111111111111111111111111111111111112';
      slippage = settings.autoSellSlippage;
      amount = parseInt(-amount / preAmount);
      mode = 'sell';
    } else {
      console.log("Disabled");
      return { disabled: true };
    }

    const timer = setTimeout(async () => {
      const result = await copyTrade(bot, msg, {
        inputMint,
        outputMint,
        amount,
        slippage,
        mode,
        isAuto
      });
      
      if (result === 'success') clearTimeout(timer);
    }, 1000);
    
    if (postAmount > preAmount && amount!=null) {
      return { remainingAmount: amounts - (postAmount - preAmount) * priceSol };}
  } catch (error) {
    console.error("Error in parseTransaction:", error);
    
  }
};


const copyTrade = async (bot, id, params) => {
  const chatId = id;
  const { inputMint, outputMint, amount, slippage, mode, isAuto } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  let txid, quoteResponse;
  const payer = Keypair.fromSecretKey(bs58.decode(wallet.secretKey));

  bot.sendMessage(chatId, await transactionInitiateMsg({ mode, isAuto }), {
    parse_mode: 'HTML',
  }).then(async ({ message_id }) => {
    try {
      const res = await initiateSwap({
        inputMint,
        outputMint,
        amount: mode === 'buy' ? parseInt(amount * 0.99) : parseInt(amount),
        slippageBps: slippage,
        payer,
      });
      quoteResponse = res.quoteResponse;
      txid = await swapToken(res.swapTransaction, payer);

      await confirmTransaction(txid);

      bot.editMessageText(transactionConfirmedMsg({ mode, isAuto, txid }), {
        chat_id: chatId,
        message_id,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });

      createTrade({
        userId: chatId.toString(),
        inputMint: quoteResponse.inputMint,
        inAmount: amount,
        outputMint: quoteResponse.outputMint,
        outAmount: parseInt(
          quoteResponse.outAmount * (mode === 'buy' ? 1 : 0.99)
        ),
      });

      if (quoteResponse.inputMint === 'So11111111111111111111111111111111111111112') {
        await coverFee(chatId, amount / 100);
      } else {
        await coverFee(chatId, quoteResponse.outAmount / 100);
      }
      return 'success';
    } catch (e) {
      console.error(e); 
      bot.sendMessage(chatId, transactionFailedMsg({ mode, isAuto, txid }), {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
      return 'fail';
    }
  });
};
const parseTransactions = async (bot, chatId, { copyWalletAddress }, name) => {
  try {
    const settings = await findSettings(chatId);
    if (settings === null) {
      console.error(SettingsNotFoundError);
      return null;
    }

    console.log(copyWalletAddress);

    const signatures = await connection.getSignaturesForAddress(new PublicKey(copyWalletAddress));
    const transaction = await connection.getTransaction(signatures[0].signature, {
      maxSupportedTransactionVersion: 0
    });

    const meta = transaction.meta;
    if (meta.err) return null;

    const postTokenBalances = meta.postTokenBalances;
    const preTokenBalances = meta.preTokenBalances;
    if (postTokenBalances.length === 0 || preTokenBalances.length === 0) return null;

    let inputMint, outputMint, slippage, amount, mode;
    const isAuto = true;

    const targetTokenBalances = postTokenBalances.filter(one => one.owner === copyWalletAddress);
    if (targetTokenBalances.length <= 0) return null;

    const postAmount = targetTokenBalances[0].uiTokenAmount.uiAmount;
    const preAmount = preTokenBalances.find(one => one.accountIndex === targetTokenBalances[0].accountIndex)?.uiTokenAmount.uiAmount || 0;

    const pair = await getPair(targetTokenBalances[0].mint);
    const priceSol = parseFloat(pair.priceNative);
    amount = (postAmount - preAmount) * priceSol;

    if (isNaN(amount)) return null;

    
    let message,keyboard

    console.log(keyboard);
    console.log("yy");

    if (parseFloat(amount) < 0) {
      // Check if token account exists
      console.log('yaaay')  
      wallet =findWallet(chatId)
      const walletAddress = wallet.publicKey;
      const walletBalance = await getBalance(walletAddress);
      
      const tokenAccounts = await getTokenAccountByMint(
        walletAddress,
        targetTokenBalances[0].mint,
        amount
      );
      index=tokenAccounts.index;
      let tokenAccount=await getTokenAccountByIndex(walletAddress, index);

      
      

      if (tokenAccount === null) {
        
        // Handle case where token account does not exist
        const noOpenPositionsMessage = "No open positions message";
        const noOpenPositionsKeyboard = "No open positions keyboard";
        // You need to define these two functions or constants
        message = noOpenPositionsMessage;
        keyboard = noOpenPositionsKeyboard;
        
      } else {
        console.log("exists")
        console.log(tokenAccount)
        // Handle case where token account exists
        console.log(chatId)
        const trade = await getTrade({
          userId:chatId,
          mint: tokenAccount.mint,
          decimals: tokenAccount.decimals,
          priceNative: tokenAccount.priceNative,
        });
        console.log(trade)
        const settings = await findSettings(chatId);
        message = positionMessage({
          tokenAccount,
          trade,
          walletBalance,
        });

        keyboard = positionKeyboard({
          tokenAccount,
          index,
          settings,
        });
      }
    }else if(amount>0){
      console.log("waaaaw")
      
      let priceUsd, priceChange, liquidity, pooledSol;

      priceUsd = parseFloat(pair.priceUsd);
      priceChange = pair.priceChange;
      liquidity = pair.liquidity.usd / 2;
      pooledSol = pair.liquidity.quote;
  
      const metadata = await getTokenMetadata(targetTokenBalances[0].mint);
        message = tokenMsgs({
        channelname: name,
        amount: amount,
        mint: targetTokenBalances[0].mint,
        name: metadata.name,
        symbol: metadata.symbol,
        priceUsd,
        priceChange,
        mcap: (priceUsd * metadata.mint.supply.basisPoints.toString()) / 10 ** metadata.mint.decimals,
        liquidity,
        pooledSol,
        walletBalance: 451,
      });
  
      keyboard = tokenKeyboard({ mintAddress: targetTokenBalances[0].mint, settings, amount });}
      
    // Send the message and keyboard
    
    await bot.sendMessage(chatId, message, { parse_mode: 'HTML', reply_markup: { inline_keyboard: keyboard } });
  } catch (error) {
    console.error(`Error sending message to user ${chatId}:`, error);
  }
};


module.exports = {
  parseTransaction,
  copyTrade,
  parseTransactions
};
