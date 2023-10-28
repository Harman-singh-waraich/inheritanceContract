// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Inheritance {
    address public owner;
    address public heir;

    uint public constant STALE_TIME = 30 days;
    uint public lastUpdate;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    modifier onlyHeir() {
        require(msg.sender == heir, "Only heir can execute this");
        _;
    }

    event Withdrawal(address by, uint amount);

    event NewHeir(address newHeir, address appointedBy);

    event OwnershipChanged(address newOwner, address newHeir);

    constructor(address _heir) payable {
        heir = _heir;
        owner = msg.sender;
        lastUpdate = block.timestamp;
    }

    /**
     * @dev Allows the owner to withdraw ETH from the contract.
     * @param _amount The amount of ETH to withdraw.
     */
    function withdraw(uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Not enough ETH to withdraw");

        payable(msg.sender).transfer(_amount);

        lastUpdate = block.timestamp;

        emit Withdrawal(msg.sender, _amount);
    }

    /**
     * @dev Sets a new heir for the contract.
     * @param _heir The address of the new heir.
     */
    function setHeir(address _heir) public onlyOwner {
        heir = _heir;

        emit NewHeir(_heir, msg.sender);
    }

    /**
     * @dev Allows the current heir to take control if the contract is stale.
     * @param _heir The address of the new owner.
     */
    function takeControl(address _heir) public onlyHeir {
        require(
            block.timestamp - lastUpdate > STALE_TIME,
            "Contract not stale yet!"
        );

        owner = msg.sender;
        heir = _heir;
        lastUpdate = block.timestamp;

        emit OwnershipChanged(msg.sender, _heir);
    }
}
