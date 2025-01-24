import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { getRegistrarControllerContract } from "./essentials.js";

const name = "my-demo-testdadasdname";
const owner = "0xe5982F617fc8c8Bf55Ccc919F78DC6129Acb5532"; // Your Ethereum address
const duration = 31556952; // 1 year in seconds
const secret = ethers.encodeBytes32String (""); // Empty secret for simplicity

export const register = async () => {
  const tx = await getRegistrarControllerContract().register(name, owner, duration, secret, {
    value: ethers.parseEther("0.01"), // Adjust based on Sepolia registrar pricing
  });
  await tx.wait();
  console.log("Domain registered:", name + ".eth");
};
