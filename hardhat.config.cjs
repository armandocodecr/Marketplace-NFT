require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const fs = require('fs');
const path = require('path');

module.exports = {
  solidity: "0.8.22",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
    },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      network_id: "*", // cualquier id de red
    },
  }
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${process.env.INFURUA_SEPOLIA_ID}`,
    //   network: "11155111",
    //   accounts: [privateKey]
    // },
    // etherscan: {
    //   apiKey: process.env.ETHERSCAN_API_KEY // Para la verificación del contrato en Sepolia
    // }
  }
