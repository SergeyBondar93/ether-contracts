import { ethers, namehash } from "../../../node_modules/ethers/dist/ethers.js";
import { getSigner } from "../essentials.js";
import { getRegistrarControllerContract } from "./contracts.js";

const owner = "0xe5982F617fc8c8Bf55Ccc919F78DC6129Acb5532"; // Your Ethereum address
const duration = 31556952; // 1 year in seconds
const secret = ethers.encodeBytes32String(""); // Empty secret for simplicity

const resolver = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD"; // Sepolia PublicResolver
const data = []; // No additional records
const reverseRecord = false; // Set reverse record
const ownerControlledFuses = 0; // No specific permissions

async function getOwnerOfENS(ensName) {
  const ensRegistryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"; // Sepolia ENS Registry
  const ensRegistryABI = [
    "function owner(bytes32 node) view returns (address)",
  ];

  const ensRegistry = new ethers.Contract(
    ensRegistryAddress,
    ensRegistryABI,
    getSigner()
  );
  const node = namehash(`${ensName}.eth`); // Generate the namehash for the ENS name
  const owner = await ensRegistry.owner(node); // Query the owner of the ENS name
  console.log("!OWNER: ", owner);

  return owner;
}

export async function registerENSName(ensName) {
  getOwnerOfENS(ensName);
  // return;

  const RegistrarControllerContract = getRegistrarControllerContract();
  try {
    // // Step 1: Check if the name is available
    const isAvailable = await RegistrarControllerContract.available(ensName);
    if (!isAvailable) {
      console.error(`The name "${ensName}.eth" is not available.`);
      return;
    } else {
      console.log("!Name ", ensName, "is available :)");
    }
    // console.log(`The name "${ensName}.eth" is available.`);

    // // Step 2: Generate a secret for commitment
    // console.log("Generated secret:", secret);

    // const commitment = await RegistrarControllerContract.makeCommitment(
    //   name,
    //   owner,
    //   duration,
    //   secret,
    //   resolver,
    //   data,
    //   reverseRecord,
    //   ownerControlledFuses
    // );
    // console.log("Generated commitment:", commitment);

    // // Step 4: Send the commitment
    // const commitTx = await RegistrarControllerContract.commit(commitment);
    // console.log("Commitment transaction sent:", commitTx.hash);
    // await commitTx.wait();
    // console.log("Commitment transaction confirmed.");

    // // Step 5: Wait for the commitment to mature (minCommitmentAge)
    // console.log("Waiting for the commitment to mature...");
    // await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // Wait 1 minute (adjust if needed)

    // Step 6: Calculate rent price
    //       const rentPrice = await registrar.rentPrice(name, duration);
    // const totalRentPrice = rentPrice.base.add(rentPrice.premium); // Combine base + premium
    // console.log("Total Rent Price:", ethers.formatEther(totalRentPrice), "ETH");

    // console.log("Rent Price Object:", rentPrice);
    // console.log("Base:", ethers.formatEther(rentPrice.base));
    // console.log("Premium:", ethers.formatEther(rentPrice.premium));

    // Step 7: Register the name
    const rentPrice = await getRegistrarControllerContract().rentPrice(
      ensName,
      duration
    );
    console.log(
      "Rent price (in ETH):",
      rentPrice,
      ethers.formatEther(rentPrice[0])
    );

    const registerTx = await RegistrarControllerContract.register(
      ensName,
      owner,
      duration,
      secret,
      resolver,
      data,
      reverseRecord,
      ownerControlledFuses,
      {
        value: ethers.parseEther(`0.1`), // Pay the exact rent price
      }
    );
    console.log("Registration transaction sent:", registerTx.hash);
    await registerTx.wait();
    console.log(`Successfully registered "${ensName}.eth"!`);
  } catch (error) {
    console.error("Error during ENS registration:", error);

    if (error.data) {
      try {
        const revertReason = ethers.utils.toUtf8String(error.data);
        console.error("Revert reason:", revertReason);
      } catch {
        console.error("Unable to decode revert data.");
      }
    }
  }
}

// Example usage
