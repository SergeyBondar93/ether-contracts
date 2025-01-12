import { expect } from "chai";
import { ethers } from "hardhat";
import { Counter } from "../typechain-types"; // Update the path to your typechain-types

describe("Counter", function () {
  let counter: Counter;

  beforeEach(async () => {
    const CounterFactory = await ethers.getContractFactory("Counter");
    counter = (await CounterFactory.deploy()) as Counter;
    await counter.waitForDeployment();
  });

  it("should initialize count to 0", async function () {
    const count = await counter.getCount();
    expect(count).to.equal(0);
  });

  it("should increment the count", async function () {
    await counter.increment();
    const count = await counter.getCount();
    expect(count).to.equal(1);
  });

  it("should decrement the count", async function () {
    await counter.increment(); // Ensure there's something to decrement
    await counter.decrement();
    const count = await counter.getCount();
    expect(count).to.equal(0);
  });

  it("should not allow count to go below zero", async function () {
    await expect(counter.decrement()).to.be.revertedWith(
      "Counter: count cannot go below zero"
    );
  });
});
