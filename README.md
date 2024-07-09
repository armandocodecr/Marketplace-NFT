# NFT Marketplace

This project is an NFT marketplace that integrates both smart contracts and the user interface to interact with them. It allows creating NFTs, with metadata stored on Pinata Cloud (https://www.pinata.cloud/). The minting and listing of smart contracts are done directly with Solidity. Users can create and view all NFTs available for purchase, as well as see the NFTs they have created and sold, those still for sale, and those they have bought.

## Project Description

The main purpose of this project is to provide a platform for creating, selling, and buying NFTs. The functionalities include:

- Creating NFTs with metadata stored on Pinata Cloud.
- Listing NFTs available for purchase.
- Viewing NFTs created and sold by the user.
- Viewing NFTs purchased by the user.

## Prerequisites

To run this project locally, you need to have the following tools installed:

- Node.js
- npm (Node Package Manager)
- Ganache (for local Ethereum blockchain setup)

You can download Ganache from [here](https://www.trufflesuite.com/ganache).

## Installation and Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nft-marketplace.git
cd nft-marketplace
```


2. **Install dependencies**
```bash
npm install
```

3. **Start ganache**
- Open Ganache and start a new workspace. Ensure that it is running on the default port (7545).

4. **Deploy the smart contract**
```bash
npx hardhat run scripts/deploy.js --network ganache
```

5. **Run the application**
```bash
npm run dev
```

6. **Open the application**
- Open your browser and navigate to http://localhost:5173/ to view the application.

## Usage
The application provides a simple interface to interact with the NFT marketplace smart contracts. Users can:
- Create NFTs with metadata stored on Pinata Cloud.
- Buy NFTs using the user interface.
- View NFTs created and sold by the user.
- View NFTs purchased by the user.

## Smart Contracts
This project includes the following smart contracts:

## Marketplace.sol
The Marketplace contract manages the creation and purchase of items (NFTs) in the marketplace. Details of the contract can be found in the Marketplace.sol file.

## NFT.sol
The NFT contract manages the minting of new NFTs. Details of the contract can be found in the NFT.sol file.

## Video Demonstration
For a detailed walkthrough of the project, please refer to the following video: [Demo video](https://www.youtube.com/watch?v=4DNIQTnrJjA)
