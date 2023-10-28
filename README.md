# Inheritance Contact

This smart contract allows the owner to withdraw ETH.
If the owner does not withdraw ETH within 1 month , the heir can inherit the ETH and designate a new heir.

## Deployment

You can change the network in hardhat.config.js file.

    npm run deploy

This deploys the contract to the network set in hardhat.config.js and automatically verifies it on Etherscan.

### Test

I have written several tests to test the contract's functionality.

    npm run test

### Example

An example has been deployed to [0x851Cc013657826A87B428e59fc0850B008B8F6e1](https://goerli.etherscan.io/address/0x851cc013657826a87b428e59fc0850b008b8f6e1)
on Goerli.
