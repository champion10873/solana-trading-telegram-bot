const { buyX, buyAmount } = require('@/events/buy.event');
const{snipeX,snipeamount}=require('@/events/snipe.event');
const{showChannels,selectChannel,track}=require('@/events/copyT.event');
const{updatecopy,findpa}=require('@/controllers/copy.controller');

const buyRouter = (bot) => {
  bot.on('callback_query', async(query) => {
    let checkab=false;
    let checkas=false;
   
    chatId=query.message.chat.id
    const sendMessageAndAskForAmount = () => {
      return new Promise((resolve, reject) => {
        // Send a message asking the user to input an amount
        bot.sendMessage(chatId, 'Please input the amount:', { reply_markup: { force_reply: true } })
          .then(({ message_id }) => {
            // Set up a listener for the reply to this message
            bot.onReplyToMessage(chatId, message_id, async (reply) => {
              const sniperTokenMint = reply.text;
              const params = { mintAddress: sniperTokenMint };
              // Resolve the Promise with the user's input
              resolve(sniperTokenMint);
            });
          })
          .catch(reject); // Reject the Promise if there's an error sending the message
      });
    };
    const data = query.data.split(' ');
    
    
    switch (data[0]) {
      case 'buyX':
        buyX(bot, query.message, { mintAddress: data[1] });
        break;
      case 'buyAmount':
        console.log("lol")
        buyAmount(bot, query.message, {
          mintAddress: data[1],
          amount: parseFloat(data[2]),
        });
        break;
      case 'snipeamount': // Handle snipeamount callback
        // Call the appropriate function for snipeamount
        
        snipeamount(bot, query.message, {
          mintAddress: data[1],
          amount: parseFloat(data[2]),
        });
        break;
      case 'snipex': // Handle snipex callback
        // Call the appropriate function for snipex
        
        snipeX(bot, query.message, { mintAddress: data[1] });
        break;
        case 'showChannels': // Handle snipex callback
        // Call the appropriate function for snipex
        
        showChannels(bot, query.message);
        break;
        case 'selectChannel': // Handle snipex callback
        // Call the appropriate function for snipex
        const startIndex = 1; // Starting index (inclusive)
        const concatenatedString = data.slice(startIndex).join(' ');
        selectChannel(bot, query.message,concatenatedString );
        console.log(concatenatedString);
        break;
        case `track`:
          
          const startIndex1 = 1; // Starting index (inclusive)
         
          
          let concatenatedString1 = data.slice(startIndex1).join(' ');
          
          
          track(bot,query.message,concatenatedString1);
          
        break;
        
      case 'abuy':
        
        console.log(data)
        let concatenatedString61 = data.slice(1).join(' ');
        try{
          lol=await findpa(bot,chatId,concatenatedString61)
          if(lol.autobuy==1){checkab=true}
          if(lol.autosell==1){checkas=true}
        }catch(e){ console.log(e)}
        console.log(checkab)
        if(checkab==true){updatecopy(chatId, concatenatedString61, { autobuy: 0 },bot);bot.sendMessage(chatId, 'Auto Buy disabled');}
        else{updatecopy(chatId, concatenatedString61, { autobuy: 1 },bot);bot.sendMessage(chatId, 'Auto Buy enabled')}
        
        setTimeout(() => {
          selectChannel(bot, query.message, concatenatedString61);
        }, 2000);
        break;
      case 'asell':
        let concatenatedString60 = data.slice(1).join(' ');
        try{
          lol=await findpa(bot,chatId,concatenatedString60)
          if(lol.autobuy==1){checkab=true}
          if(lol.autosell==1){checkas=true}
        }catch(e){ console.log(e)}
        console.log(checkas)
        if(checkas==true){updatecopy(chatId, concatenatedString60, { autosell: 0 },bot);bot.sendMessage(chatId, 'Auto Sell disabled');}
        
        else{updatecopy(chatId, concatenatedString60, { autosell: 1 },bot);bot.sendMessage(chatId, 'Auto Sell enabled')}

        setTimeout(() => {
          selectChannel(bot, query.message, concatenatedString60);
        }, 2000);
        break;
      case 'maxli':
  let concatenatedString4 = data.slice(1).join(' ');
  // Handle max liquidity
  sendMessageAndAskForAmount()
    .then(amount => {
      updatecopy(chatId, concatenatedString4, { maxliqui: amount });
      setTimeout(() => {
        selectChannel(bot, query.message, concatenatedString4);
      }, 2000);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  break;
case 'sellhigh':
  let concatenatedString5 = data.slice(1).join(' ');
  // Handle Auto sell (HIGH)
  sendMessageAndAskForAmount()
    .then(amount => {
      updatecopy(chatId, concatenatedString5, { sellhigh: amount });
      setTimeout(() => {
        selectChannel(bot, query.message, concatenatedString5);
      }, 2000);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  break;
  
case 'minli':
  let concatenatedString6 = data.slice(1).join(' ');
  // Handle min liquidity
  sendMessageAndAskForAmount()
    .then(amount => {
      updatecopy(chatId, concatenatedString6, { minliqui: amount });
      setTimeout(() => {
        selectChannel(bot, query.message, concatenatedString6);
      }, 2000);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  break;
  
case 'selllow':
  // Handle Auto sell (LOW)
  let concatenatedString7 = data.slice(1).join(' ');
  sendMessageAndAskForAmount()
    .then(amount => {
      updatecopy(chatId, concatenatedString7, { selllow: amount });
      setTimeout(() => {
        selectChannel(bot, query.message, concatenatedString7);
      }, 2000);
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
    case 'amounts':
      // Handle Auto sell (LOW)
      let concatenatedString20 = data.slice(1).join(' ');
      sendMessageAndAskForAmount()
        .then(amount => {
          updatecopy(chatId, concatenatedString20, { amount: parseFloat(amount) });
          setTimeout(() => {
            selectChannel(bot, query.message, concatenatedString20);
          }, 2000);
          
        })
        .catch(error => {
          console.error('Error:', error);
        });
    
   
  break;
      default:
          
        
        
    }
   });
  };



module.exports = buyRouter;
