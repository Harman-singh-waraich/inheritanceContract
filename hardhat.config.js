require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API}`,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 3000000000,
    },
  },
  etherscan: {
    apiKey: { goerli: process.env.ETHERSCAN_KEY },
  },
};
