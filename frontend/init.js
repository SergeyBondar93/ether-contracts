import { ethers } from "../node_modules/ethers/dist/ethers.js";
import { contractAddress } from "./config.js";
import { contractABI } from "./abi.js";
import { getHistory } from "./getHistory.js";
import {
  incrementCount,
  decrementCount,
  updateCount,
} from "./contractInteractions.js";
import {
  estimateTransactionGas,
  calculateTransactionCost,
  getGasPrice,
} from "./estimateTransactionGas.js";

let provider;
let signer;
let contract;

// Initialize the app
async function initialize() {
  console.log("!Start init");

  if (typeof window.ethereum !== "undefined") {
    // Connect to MetaMask
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum); // Updated for ethers.js v6

    const network = await provider.getNetwork();

    console.log("Connected Network:", network);
    signer = await provider.getSigner();

    // Connect to the contract with both provider and signer
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Fetch and display the current count
    await updateCount(contract, provider);

    // Attach event listeners
    document
      .getElementById("increment")
      .addEventListener("click", () => incrementCount(contract, provider));
    document
      .getElementById("decrement")
      .addEventListener("click", () => decrementCount(contract, provider));

    const getCosts = async () => {
      const incGas = await estimateTransactionGas(contract, "increment");
      const decGas = await estimateTransactionGas(contract, "decrement");
      const gasPrice = await getGasPrice(provider);

      const incTransactionCost = await calculateTransactionCost(
        incGas,
        provider
      );
      const decTransactionCost = await calculateTransactionCost(
        decGas,
        provider
      );

      document.getElementById("inc-gas-for-transaction").innerHTML = incGas;
      document.getElementById("dec-gas-for-transaction").innerHTML = decGas;

      document.getElementById("inc-cost-for-transaction").innerHTML =
        incTransactionCost;
      document.getElementById("dec-cost-for-transaction").innerHTML =
        decTransactionCost;
      document.getElementById(
        "gas-price"
      ).innerHTML = `${gasPrice} (${ethers.formatEther(gasPrice)})`;
    };

    setInterval(getCosts, 3000);

    getHistory(contract);
  } else {
    alert("Please install MetaMask!");
  }
}

initialize();
window.ethers = ethers;

export { provider, signer, contract };
