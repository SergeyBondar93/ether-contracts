import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleERC20 } from "../typechain-types";

describe("SimpleERC20", function () {
    let SimpleERC20: any, contract: SimpleERC20, owner: any, addr1: any, addr2: any;
    const initialSupply = ethers.parseUnits("1000", 18);
    const expectedTotalSupply = initialSupply * BigInt(10 ** 18);

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        SimpleERC20 = await ethers.getContractFactory("SimpleERC20");
        contract = (await SimpleERC20.deploy(initialSupply)) as SimpleERC20;
        await contract.waitForDeployment();
    });

    it("should set correct initial values", async function () {
        const deployedSupply = await contract.totalSupply();
        console.log("Expected:", expectedTotalSupply.toString());
        console.log("Actual:", deployedSupply.toString());
        
        expect(await contract.name()).to.equal("Simple Token");
        expect(await contract.symbol()).to.equal("SIM");
        expect(await contract.decimals()).to.equal(18);
        expect(deployedSupply).to.equal(expectedTotalSupply);
        expect(await contract.balanceOf(owner.address)).to.equal(expectedTotalSupply);
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("should transfer tokens between accounts", async function () {
        const amount = ethers.parseUnits("100", 18);
        await contract.transfer(addr1.address, amount);
        expect(await contract.balanceOf(addr1.address)).to.equal(amount);
    });

    it("should fail transfer if sender doesn't have enough balance", async function () {
        const amount = ethers.parseUnits("100", 18);
        await expect(contract.connect(addr1).transfer(addr2.address, amount)).to.be.revertedWith("Insufficient balance");
    });

    it("should approve and allow transferFrom", async function () {
        const amount = ethers.parseUnits("100", 18);
        await contract.approve(addr1.address, amount);
        expect(await contract.allowance(owner.address, addr1.address)).to.equal(amount);

        await contract.connect(addr1).transferFrom(owner.address, addr2.address, amount);
        expect(await contract.balanceOf(addr2.address)).to.equal(amount);
    });

    it("should fail transferFrom if allowance is insufficient", async function () {
        const amount = ethers.parseUnits("100", 18);
        await expect(contract.connect(addr1).transferFrom(owner.address, addr2.address, amount)).to.be.revertedWith("Allowance exceeded");
    });

    it("should allow token burning", async function () {
        const amount = ethers.parseUnits("50", 18);
        await contract.burn(amount);
        expect(await contract.totalSupply()).to.equal(expectedTotalSupply - amount);
        expect(await contract.balanceOf(owner.address)).to.equal(expectedTotalSupply - amount);
    });

    it("should allow buying tokens", async function () {
        const buyAmount = ethers.parseUnits("1", "ether"); // Sending 1 ETH
        const buyRate = 1000; // Number of tokens per ETH
        const expectedTokens = buyAmount * BigInt(buyRate); // Tokens to receive

        // Ensure the contract has enough tokens to sell
        await contract.transfer(contract.target, expectedTokens);

        // Buy tokens using the contract's function
        await contract.connect(addr1).buyTokens({ value: buyAmount });

        // Check if addr1 received the correct number of tokens
        expect(await contract.balanceOf(addr1.address)).to.equal(expectedTokens);
    });

    it("should allow selling tokens", async function () {
        const sellAmount = ethers.parseUnits("100", 18);
        await contract.transfer(addr1.address, sellAmount);
        await owner.sendTransaction({ to: contract.target, value: ethers.parseUnits("1", "ether") });
        await contract.connect(addr1).sellTokens(sellAmount);
        expect(await contract.balanceOf(addr1.address)).to.equal(0);
    });

    it("should allow owner to withdraw Ether", async function () {
        const depositAmount = ethers.parseUnits("2", "ether");
        await owner.sendTransaction({ to: contract.target, value: depositAmount });
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
        await contract.withdrawEther();
        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
        expect(finalOwnerBalance).to.be.greaterThan(initialOwnerBalance);
    });

    it("should allow airdrop claims", async function () {
        await contract.transfer(addr1.address, ethers.parseUnits("100", 18));
        await contract.connect(addr1).claimAirdrop();
        expect(await contract.balanceOf(addr1.address)).to.be.greaterThan(ethers.parseUnits("100", 18));
    });
});
