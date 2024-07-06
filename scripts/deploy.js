// scripts/deploy.ts
// import ethers from "hardhat";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy lottery
  const Loteria = await ethers.getContractFactory("loteria");
  const loteria = await Loteria.deploy(deployer.address);
  await loteria.deployed();
  console.log("Loteria deployed to:", loteria.address);

  // Save the address of contract in a JSON fiedl to the frontend
  const addresses = { loteria: loteria.address };
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'contracts', 'addresses.json'), JSON.stringify(addresses, null, 2));

  // Verify balance
  const balance = await loteria.balanceOf(deployer.address);
  console.log(`Balance of deployer: ${ethers.utils.formatUnits(balance, 18)} AR`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
