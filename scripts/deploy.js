const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const inheritAmount = hre.ethers.parseEther("0.001");
  const heir = process.env.HEIR; //add heir here

  const inherit = await hre.ethers.deployContract("Inheritance", [heir], {
    value: inheritAmount,
  });

  await inherit.waitForDeployment();

  const address = await inherit.target;

  console.log("Contract deployed to", address);

  console.log("Waiting 5 confirmations before verifying");

  await inherit.deploymentTransaction()?.wait(5);

  await hre.run("verify:verify", {
    address: inherit.target, //contract address
    constructorArguments: [heir],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
