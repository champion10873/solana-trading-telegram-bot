const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addItemToChannelTable() {
  try {
    // Define the data for the new item
    const newItemData = {
      name: 'channel 1',
      address: 'N/A',
      // Add other fields as needed
    };

    // Use Prisma Client to create a new record in the Channel table
    const newItem = await prisma.channel.create({
      data: newItemData,
    });

    console.log('Item added to Channel table:', newItem);
  } catch (error) {
    console.error('Error adding item to Channel table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the function to add the item to the Channel table
addItemToChannelTable();