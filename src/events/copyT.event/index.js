const { prisma } = require('@/configs/database');
const{starttrack,findpa,showChannelss}=require('@/controllers/copy.controller');
const {
  findWallet
} = require('@/controllers/wallet.controller');
async function track(bot,msg,name){
  
  const chatId = msg.chat.id;
  const wallet = findWallet(chatId);
  add=wallet.publicKey
  console.log()
  await starttrack(bot,{ name: name, address: add, userId: chatId.toString() });

  //await bot.sendMessage(chatId, "channel is being tracked");

}
async function showChannels(bot, msg, params) {
  try {
    // Assuming showChannelss() returns an array of channel names
    const channelNames = await showChannelss() // Example channel names

    // Function to generate the keyboard
    const channelKeyboard = () => {
        const keyboard = {
            reply_markup: {
                inline_keyboard: []
            }
        };

        // Chunk the channel names into groups of three
        const chunks = channelNames.reduce((acc, _, index) => {
            if (index % 3 === 0) acc.push([]);
            acc[acc.length - 1].push(channelNames[index]);
            return acc;
        }, []);

        // Create buttons for each chunk of channel names
        chunks.forEach(chunk => {
            const row = chunk.map(channelName => ({ text: channelName, callback_data: `selectChannel ${channelName}` }));
            keyboard.reply_markup.inline_keyboard.push(row);
        });

        return keyboard;
    };

    // Replace 'YOUR_CHAT_ID' with the actual chat ID
    const chatId = msg.chat.id;

    // Send the message with the keyboard
    bot.sendMessage(chatId, 'Please select a channel to track:', channelKeyboard());

} catch (error) {
    console.error('Error:', error);
}
}


  
async function selectChannel(bot, msg, channelname) {
  let checks="❌ Disabled"
  let checkb="❌ Disabled"
  let checkab=false;
  let checkas=false;
  let sellhigh='Default (+100)'
  let selllow='Default (+100)'
  let max= "Global (Disabled)"
  let min='Global (Disabled)'
  let amounts='disabled'
  let check='❌'
  try{
  param = await findpa(bot,msg.chat.id,channelname)
  
  

  if(param.autobuy==1){checkb="✅ enabled"}
  else{checkb="❌ Disabled"}
  if(param.autosell==1){checks="✅ enabled"}
  else{checks="❌ Disabled"}
  if(param.sellhigh!=null){sellhigh=param.sellhigh}
  if(param.selllow!=null){selllow=param.selllow}
  if(param.maxliqui!=null){max=param.maxliqui}
  if(param.minliqui!=null){min=param.minliqui}
  if(param.amount!=null){amounts=param.amount}
  check="✅"
  console.log(sellhigh)}
  catch (e) {console.log("pass")}
 
  let messageText=`
   ${check} Tracking
  __${channelname}__
  📌 Buy:
Auto Buy: ${checkb} Disabled  - Global Disabled ⚠️
Amount: ${amounts} SOL
Slippage: Default (10%)

Min Liquidity: ${min}
Max Liquidity: ${max})


📌 Sell
Auto Sell: ${checks}  - Global Disabled ⚠️
 
Auto Sell (high): ${sellhigh}

Auto Sell (low): ${selllow}`
  chatId = msg.chat.id 
  try {
      // Define the keyboard with buttons
      const keyboard = {
          reply_markup: {
              inline_keyboard: [
                  [{text: ` 🐱‍🏍 Track channel`, callback_data: `track ${channelname}`},{text: `Buy amount`, callback_data: `amounts ${channelname}`}],


                  [
                      { text: `🤖 Auto Buy`, callback_data: `abuy ${channelname}` },
                      { text: `🤖 Auto Sell`, callback_data: `asell ${channelname}` },
                      
                  ],
                  [
                    { text: `💹 max liquidity Default Global `, callback_data: `maxli ${channelname}`},
                    { text: ` ⚡Auto sell (HIGH) `, callback_data: `sellhigh ${channelname}` },
                  ],
                  [
                    { text: `➖ min liquidity Global `, callback_data: `minli ${channelname}` },
                    { text: `👇 Auto sell (lOW) Default `, callback_data: `selllow ${channelname}` },
                  ]
              ]
          }
      };

      // Send the message with buttons\
      
      await bot.sendMessage(chatId, messageText, keyboard);
  } catch (error) {
      console.error('Error:', error);
  }
}
module.exports={showChannels,selectChannel,track};