// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const inheritAmount = hre.ethers.parseEther("0.001");
  const heir = "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db";
  const inherit = await hre.ethers.deployContract("Inheritance", [heir], {
    value: inheritAmount,
  });

  await inherit.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
