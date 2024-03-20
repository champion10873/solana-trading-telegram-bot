const { Connection, clusterApiUrl } = require('@solana/web3.js');
//const web3 = require("@solana/web3.js");

//const endpoint = clusterApiUrl(process.env.CLUSTER_ENDPOINT);
const endpoint = 'https://api.mainnet-beta.solana.com';
//const endpoint = "https://go.getblock.io/cb5190cbb9d3491295f96afec5180a4f";
const connection = new Connection(endpoint, 'confirmed');

module.exports = connection;
