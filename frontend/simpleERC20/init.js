import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { loadAccounts } from "./loadAccounts.js";
import { contractAddress } from "./config.js";
import { contractABI } from "./abi.js";

const provider = new ethers.BrowserProvider(window.ethereum);
let signer;
let contract;

async function initialize() {
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  document.getElementById(
    "current"
  ).innerHTML = `Current account: ${await signer.getAddress()}`;

  loadAccounts(contract, provider);
}

initialize();
