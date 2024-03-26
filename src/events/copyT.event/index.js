const{channelKeyboard}= require('./keyboard');
const { prisma } = require('@/configs/database');
const { isChannel } = require('./verifier');
const showChannel= async(bot,chatId) =>{
  const channels = await prisma.channels.findMany();
  console.log(channels)
    message=`Select call channels you'd like to subscribe to! 🔔`
    bot.sendMessage(chatId, message, {
        
        reply_markup: {
          inline_keyboard: await channelKeyboard(chatId,channels),
        },
      });
    };
  
const showsh=async(bot,chatId,chid,codename,chname)=>{
  let amount="disabled"
  try{
    found=await prisma.UserChannel.findFirst({
      where: {
        channel_id: parseInt(chid),
        user_id:chatId.toString()
      },
    })
    if(found.amount!=0&& found.amount!=null&&found.amount){amount=found.amount}
   
  }catch(e){
    console.error(e)
  }
  message=`
  ${await isChannel(chatId.toString(),parseInt(chid))} tracking
  username: @${codename}
  name: __${chname}__
 
  📌 Auto Buy:

  Amount: ${amount}




  ℹ️ Please Enable autosell in you wallet and setup your selling strategy.
  ℹ️ Channel slippage settings will use your wallet settings.`
  keyboard=[[{text: `📍 track `,callback_data: `track ${chid} ${codename} ${chname}`},{text: `🛒 autobuy `,callback_data: `autobuy ${chid}`}]]
  bot.sendMessage(chatId, message, {

        
    reply_markup: {
      inline_keyboard:keyboard ,
    },
  });
}
module.exports={showChannel,showsh}