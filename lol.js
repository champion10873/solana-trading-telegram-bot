const fetchTokenPriceByMint = async (mintAddress) => {
    const solMint = 'SOL'; // SOL mint address
    const tokenPair = `TOKEN/${solMint}`; // Replace TOKEN with the desired token's mint address
    const apiUrl = `https://api.dexlab.space/v2/markets/${tokenPair}/trades`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Filter trades by token mint address
        const tokenTrades = data.filter(trade => trade.makerMint === mintAddress || trade.takerMint === mintAddress);

        // Assuming the response contains an array of trades, get the price from the latest trade
        const latestTrade = tokenTrades[0];
        const tokenPrice = latestTrade.price;

        console.log(`Price of token with mint address ${mintAddress}: ${tokenPrice} SOL`);
    } catch (error) {
        console.error('Error fetching token price:', error);
    }
};

const tokenMintAddress = 'TOKEN_MINT_ADDRESS'; // Replace TOKEN_MINT_ADDRESS with the actual mint address of the token
fetchTokenPriceByMint('5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC');