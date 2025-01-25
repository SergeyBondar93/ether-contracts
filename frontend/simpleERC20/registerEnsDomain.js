import { ethers, namehash } from "../../node_modules/ethers/dist/ethers.js";
import { getRegistrarControllerContract, getSigner } from "./essentials.js";

const name = "my-demo-testname-for-test-app-2";
const owner = "0xe5982F617fc8c8Bf55Ccc919F78DC6129Acb5532"; // Your Ethereum address
const duration = 31556952; // 1 year in seconds
const secret = ethers.encodeBytes32String(""); // Empty secret for simplicity

const resolver = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD"; // Sepolia PublicResolver
const data = []; // No additional records
const reverseRecord = false; // Set reverse record
const ownerControlledFuses = 0; // No specific permissions

async function getOwnerOfENS() {
  const ensRegistryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"; // Sepolia ENS Registry
  const ensRegistryABI = [
    "function owner(bytes32 node) view returns (address)",
  ];

  const ensRegistry = new ethers.Contract(
    ensRegistryAddress,
    ensRegistryABI,
    getSigner()
  );
  const node = namehash(`${name}.eth`); // Generate the namehash for the ENS name
  const owner = await ensRegistry.owner(node); // Query the owner of the ENS name
  console.log("!OWNER: ", owner);

  return owner;
}

export async function registerENSName() {
  getOwnerOfENS();
  return;

  const RegistrarControllerContract = getRegistrarControllerContract();
  try {
    // Step 1: Check if the name is available
    const isAvailable = await RegistrarControllerContract.available(name);
    if (!isAvailable) {
      console.error(`The name "${name}.eth" is not available.`);
      return;
    }
    console.log(`The name "${name}.eth" is available.`);

    // Step 2: Generate a secret for commitment
    console.log("Generated secret:", secret);

    const commitment = await RegistrarControllerContract.makeCommitment(
      name,
      owner,
      duration,
      secret,
      resolver,
      data,
      reverseRecord,
      ownerControlledFuses
    );
    console.log("Generated commitment:", commitment);

    // Step 4: Send the commitment
    const commitTx = await RegistrarControllerContract.commit(commitment);
    console.log("Commitment transaction sent:", commitTx.hash);
    await commitTx.wait();
    console.log("Commitment transaction confirmed.");

    // Step 5: Wait for the commitment to mature (minCommitmentAge)
    console.log("Waiting for the commitment to mature...");
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // Wait 1 minute (adjust if needed)

    // Step 6: Calculate rent price
    //       const rentPrice = await registrar.rentPrice(name, duration);
    // const totalRentPrice = rentPrice.base.add(rentPrice.premium); // Combine base + premium
    // console.log("Total Rent Price:", ethers.formatEther(totalRentPrice), "ETH");

    // console.log("Rent Price Object:", rentPrice);
    // console.log("Base:", ethers.formatEther(rentPrice.base));
    // console.log("Premium:", ethers.formatEther(rentPrice.premium));

    // Step 7: Register the name
    const registerTx = await RegistrarControllerContract.register(
      name,
      owner,
      duration,
      secret,
      resolver,
      data,
      reverseRecord,
      ownerControlledFuses,
      {
        value: ethers.parseEther(`0.01`), // Pay the exact rent price
      }
    );
    console.log("Registration transaction sent:", registerTx.hash);
    await registerTx.wait();
    console.log(`Successfully registered "${name}.eth"!`);
  } catch (error) {
    console.error("Error during ENS registration:", error);
  }
}

// Example usage
