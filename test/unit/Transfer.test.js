const { ethers, waffle } = require("hardhat");
const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");
use(solidity)
describe("TokenTransfer", async function () {
  //getting public keys to deploy the conrtract
  const amt = ethers.parseEther("1"); // 1 eth

  it("should only allow the Owner to transfer the funds", async () => {
    const [owner, acc1, acc2] = await ethers.getSigners();
    const token_trans = await ethers.getContractFactory("TokenTransfer");
    const contract = await token_trans.connect(owner).deploy();
    console.log(
      `Contract is initially deployed by ${await contract.tra()}`
    );
    expect(await contract.connect(acc2).getOwner()).to.be.reverted();
  });

  it("correctly transfers funds between accounts", async () => {
    const [owner, acc1, acc2] = await ethers.getSigners();
    const token_trans = await ethers.getContractFactory("TokenTransfer");
    const contract = await token_trans.connect(owner).deploy();

    const startPayerBalance = await contract.provider.getBalance(
      await owner.getAddress()
    );
    const startPayeeBalance = await contract.provider.getBalance(await acc1.getAddress());

    
    const transactionResponse = await contract.transfer(await acc1.getAddress(), amt);
    const transactionReceipt = await transactionResponse.wait();
    const { gasUsed, effectiveGasPrice } = transactionReceipt;
    const gasCost = gasUsed.mul(effectiveGasPrice);

    const endPayeeBalance = await contract.provider.getBalance(
      await acc1.getAddress()
    );
    const endPayerBalance = await contract.provider.getBalance(await owner.getAddress());

    // Assert
    // Maybe clean up to understand the testing
    assert.equal(endPayerBalance, startPayerBalance.subtract(endPayerBalance.subtract(gasCost)));
    assert.equal(
      endPayeeBalance.toString(),
      startPayeeBalance.add(endPayeeBalance).toString()
    );

    
  });
});

/*
test a few things 1) only owner is able to transfer the tokens 2) tokens are indeed transferred correctly
*/
