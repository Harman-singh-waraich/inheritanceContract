const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Inheritance", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployInherit() {
    // Contracts are deployed using the first signer/account by default
    const [owner, heir, otherAccount] = await ethers.getSigners();
    const inheritAmount = "1000000000000000000"; //1 ETH

    const Inheritance = await ethers.getContractFactory("Inheritance");
    const inherit = await Inheritance.deploy(heir.address, {
      value: inheritAmount,
    });

    return { inherit, inheritAmount, owner, heir, otherAccount };
  }

  describe("Deployment", function () {
    it("Should receive and store the inherit amount", async function () {
      const { inherit, inheritAmount } = await loadFixture(deployInherit);

      expect(await ethers.provider.getBalance(inherit.target)).to.equal(
        inheritAmount
      );
    });

    it("Should set the right owner", async function () {
      const { inherit, owner } = await loadFixture(deployInherit);

      expect(await inherit.owner()).to.equal(owner.address);
    });

    it("Should set the right heir", async function () {
      const { inherit, heir } = await loadFixture(deployInherit);

      expect(await inherit.heir()).to.equal(heir.address);
    });
  });

  describe("Functionality", function () {
    describe("Validations", function () {
      it("Should revert with the right error if no ETH to withdraw", async function () {
        const { inherit, inheritAmount } = await loadFixture(deployInherit);

        await inherit.withdraw(inheritAmount);

        await expect(inherit.withdraw(inheritAmount)).to.be.revertedWith(
          "Not enough ETH to withdraw"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { inherit, inheritAmount, heir } = await loadFixture(
          deployInherit
        );

        await expect(
          inherit.connect(heir).withdraw(inheritAmount)
        ).to.be.revertedWith("Only owner can execute this");
      });

      it("Should revert with the right error if take control called too soon", async function () {
        const { inherit, heir, otherAccount } = await loadFixture(
          deployInherit
        );

        await expect(
          inherit.connect(heir).takeControl(otherAccount.address)
        ).to.be.revertedWith("Contract not stale yet!");
      });

      it("Should revert with the right error if take someone else tries to inherit except heir", async function () {
        const { inherit, otherAccount } = await loadFixture(deployInherit);

        await expect(
          inherit.connect(otherAccount).takeControl(otherAccount.address)
        ).to.be.revertedWith("Only heir can execute this");
      });
    });

    describe("Transfers", async function () {
      it("Should transfer correct amount to the owner when witdhrawn", async function () {
        const { inherit, owner } = await loadFixture(deployInherit);

        await expect(inherit.withdraw(1)).to.changeEtherBalances(
          [owner, inherit],
          [1, -1]
        );
      });

      it("Should transfer ownership to heir when after 1 month", async function () {
        const { inherit, heir, otherAccount } = await loadFixture(
          deployInherit
        );
        //increase time to 1 month
        await time.increase(2592000);

        await inherit.connect(heir).takeControl(otherAccount.address);

        await expect(await inherit.owner()).to.be.equal(heir.address);
      });

      it("Should set new heir after ownership transfer", async function () {
        const { inherit, heir, otherAccount } = await loadFixture(
          deployInherit
        );
        //increase time to 1 month
        await time.increase(2592000);

        await inherit.connect(heir).takeControl(otherAccount.address);

        await expect(await inherit.heir()).to.be.equal(otherAccount.address);
      });

      it("Should reset counter on withdrawal", async function () {
        const { inherit } = await loadFixture(deployInherit);
        const previousTime = await inherit.lastUpdate();

        await inherit.withdraw("0");

        await expect(await inherit.lastUpdate()).not.to.be.equal(previousTime);
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { inherit, inheritAmount, owner } = await loadFixture(
          deployInherit
        );

        await expect(inherit.withdraw(inheritAmount))
          .to.emit(inherit, "Withdrawal")
          .withArgs(owner.address, inheritAmount);
      });

      it("Should emit an event on heir change", async function () {
        const { inherit, otherAccount, owner } = await loadFixture(
          deployInherit
        );

        await expect(inherit.setHeir(otherAccount.address))
          .to.emit(inherit, "NewHeir")
          .withArgs(otherAccount.address, owner.address);
      });

      it("Should emit an event on ownership transfer", async function () {
        const { inherit, heir, otherAccount } = await loadFixture(
          deployInherit
        );

        await time.increase(2592000);

        await expect(inherit.connect(heir).takeControl(otherAccount.address))
          .to.emit(inherit, "OwnershipChanged")
          .withArgs(heir.address, otherAccount.address);
      });
    });
  });
});
