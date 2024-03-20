const { prisma } = require('../configs/database');
const connection = require('@/configs/connection');
const {PublicKey } = require('@solana/web3.js');
const { parseTransactions,parseTransaction } = require('../events/copy.event');
const store = require('@/store');

const findCopyTrade = async (address) => {
  const copyTrades = await prisma.copyTrade.findMany({
    where: {
      copyWalletAddress: address.toString(),
    },
  })
  return copyTrades
};

const starttrack = async (bot,params) => {
  
  
  try {
    const channels = await prisma.channel.findFirst({
      where: {
        userId: params.userId.toString(),
        name: params.name
      },
    });
  
    if (channels) {
      // If a channel with the specified user ID and name exists
      if (channels.address === params.address && channels.name === params.name) {
        
        bot.sendMessage(chatId,"track Disbaled ❌")
        
        await prisma.channel.delete({
          where: {
            id: channels.id // Use channels.id instead of item.id
          },
        });
      }
    } else {
      // If no channel with the specified user ID and name exists
     
      bot.sendMessage(chatId,"track Enabled ✅")
      trackall(bot);
      await prisma.channel.create({
        data: params
      });
    }
    trackall(bot);
  
    return "Success"; // Indicate success
  } catch (error) {
    console.error(error);
    console.log("Error occurred, creating new channel...");
    bot.sendMessage(chatId,"track Enabled ✅")

   
    await prisma.channel.create({
      data: params
    });
    return null;
  }
};
const trackall = async (bot) => {
  console.log("copy feature working")
  try {
    const channels = await prisma.channel.findMany();
    
    const addresses = channels
      .map((channel) => channel.address)
      .filter((address) => address !== 'N/A');
      
    for (const address of addresses) {
      
      connection.onAccountChange(new PublicKey(address), async () => {
        const channels = await prisma.channel.findMany({
          where: { address },
        });
        const channelNames = channels.map((channel) => channel.name);
        const uniqueChannelNames = Array.from(new Set(channelNames));

        for (const channelName of uniqueChannelNames) {
          try {
            const channelsWithSameName = await prisma.channel.findMany({
              where: { name: channelName },
            });
            const userIds = channelsWithSameName
              .map((channel) => channel.userId)
              .filter((userId) => userId !== null);

              for (const userId of userIds) {
                const add = store.getWallet(userId.toString());
                
                // Check if the address matches the publicKey
                if (address != add.publicKey) {
                    parseTransactions(bot, userId, { copyWalletAddress: address }, channelName)
                        .then(() => {
                            console.log(`Message sent to user ${userId}`);
                        })
                        .catch((error) => {
                            console.error(`Error sending message to user ${userId}:`, error);
                        });
            
                    const userData = await prisma.channel.findFirst({
                        where: { name: channelName, userId: userId.toString() },
                    });
            
                    if (!userData) {
                        console.log(`User ${userId} data not found`);
                        continue;
                    }
            
                    const { autobuy, autosell, amount } = userData;
                    if (autobuy === 0 || autobuy === null) {
                        console.log('autobuy disabled')
                    } else {
                        newamount = parseTransaction(bot, userId, { copyWalletAddress: add.publicKey }, autobuy, autosell, amount);
                        updatecopy(userId, channelName, { amount: newamount, bot })
                    }
            
                    if (autosell === 0 || autosell === null) {
                        console.log('autosell disabled')
                    } else {
                        parseTransaction(bot, userId, { copyWalletAddress: add.publicKey }, autobuy, autosell, amount);
                    }
                } else {
                    console.log(".");
                }
            }
          } catch (error) {
            console.error(`Error fetching addresses for channel "${channelName}":`, error);
          }
        }
      });
    }

    return "success";
  } catch (error) {
    console.error("Error in trackall:", error);
    return "failure";
  }
};

const showChannelss = async (bot, chatId) => {

  try {
    const channels = await prisma.channel.findMany();
    const channelNames = channels.map(channel => channel.name);
    console.log(channelNames)
    
    // Remove duplicates by creating a Set and converting it back to an array
    const uniqueChannelNames = Array.from(new Set(channelNames));
    
    return uniqueChannelNames;
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
};

async function findpa( add,userID,channelname) {
  try {
    const channel = await prisma.channel.findFirst({
      where: {
        userId: userID.toString(),
      name: channelname

      }
    });

    if (channel) {
      // Access the values of sellhigh, selllow, maxliqui, and minliqui
      const { sellhigh, selllow, maxliqui, minliqui,autobuy,autosell,amount } = channel;
      return { sellhigh, selllow, maxliqui, minliqui,autobuy,autosell,amount };
    } else {
      console.log('No channel found with the provided address.');
      return null; // or throw an error if needed
    }
  } catch (error) {
    console.error('Error fetching channel values:', error);
    throw error; // Throw the error to handle it in the caller function
  }
}

const createCopyTrade = async (params) => {
  try {
    const copyTrades = await prisma.copyTrade.findMany({
      where: {
        userId: params.userId.toString(),
      },
    })
    if (copyTrades.length > 0) {
      copyTrades.map(async (item) => {
        if (item.copyWalletAddress === params.copyWalletAddress)
          await prisma.copyTrade.delete({
            where: {
              id: item.id,
            },
          })
      })
    }
    
    await prisma.copyTrade.create({
      data: params
    });
  } catch (error) {
    console.log(error.message)
    return null;
  }
};
const addToChannel = async (channelName, address) => {
  try {
    // Check if the channel exists
    const existingChannel = await prisma.channel.findFirst({
      where: {
        name: channelName,
      },
    });

    if (!existingChannel) {
      throw new Error(`Channel '${channelName}' not found.`);
    }

    // Add the address to the channel
    await prisma.address.create({
      data: {
        channelId: existingChannel.id,
        address: address,
      },
    });

    console.log(`Address '${address}' added to channel '${channelName}' successfully.`);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
const updateCopyTrade = async (id, params) => {
  await prisma.copyTrade.update({
    where: {
      id,
    },
    data: params,
  });
  const copyTrades = await findCopyTrade(id);
  return copyTrades;
};
const updatecopy = async (id, name,params,bot) => {
  try {
    
    // Find the channel to update based on the user ID and name
    const channelToUpdate = await prisma.channel.findFirst({
      where: {
        userId: id.toString(),
        name: name
      }
    });
  
   
  
    // If the channel is found, update its data
    if (channelToUpdate) {
      // Update the channel using its ID and the provided parameters
      await prisma.channel.update({
        where: {
          id: channelToUpdate.id,
        },
        data: params,
      });
  
      

    } else {
      
      await bot.sendMessage(id, "Please start tracking the channel to enable .")
    }
  } catch (error) {
    console.error("Error updating channel:", error);
    // If an error occurs during the update operation, send a message to the user
    ;
  }
};
module.exports = {
  findCopyTrade,
  createCopyTrade,
  updatecopy,
  updateCopyTrade,
  addToChannel,
  showChannelss,
  trackall,
  findpa,
  starttrack
};
