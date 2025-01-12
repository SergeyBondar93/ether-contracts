const fs = require("fs");

async function main() {
  const Counter = await hre.ethers.getContractFactory("SimpleERC20");
  const counter = await Counter.deploy(1_000_000);

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
