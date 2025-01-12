import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { loadAccounts } from "./loadAccounts.js";
import { contractAddress } from "./config.js";
import { contractABI } from "./abi.js";

const provider = new ethers.BrowserProvider(window.ethereum);
let signer;
let contract;
let contractETH;

async function initialize() {
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);
  contractETH = new ethers.Contract(
    "0x2e5221B0f855Be4ea5Cefffb8311EED0563B6e87",
    contractABI,
    signer
  );

  loadAccounts(contract, provider, contractETH);
}

initialize();
