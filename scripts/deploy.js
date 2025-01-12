const fs = require("fs");

async function main() {
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();

  await counter.waitForDeployment();

  const address = await counter.getAddress();
  console.log(`Counter deployed to: ${address}`);

  // Save address to a file
  fs.writeFileSync(
    "./frontend/config.js",
    `export const contractAddress = "${address}";`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
