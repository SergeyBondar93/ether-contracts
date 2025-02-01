import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { loadAccounts } from "./loadAccounts.js";
import { contractAddress } from "./config.js";
import { contractABI } from "./abi.js";
import {
  getProvider,
  setContract,
  setProvider,
  setSigner,
} from "./essentials.js";
import { setENSContracts } from "./ens/setENSContracts.js";
import { getHistory } from "./history/getHistory.js";
import { addContractOwnerActions } from "./addContractOwnerActions.js";
import { graphFetchTransactions } from "./history/getTransactionsFromTheGraph.js";

const provider = new ethers.BrowserProvider(window.ethereum);

setProvider(new ethers.BrowserProvider(window.ethereum));

async function initialize() {
  await getProvider().send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  setSigner(signer);
  setContract(new ethers.Contract(contractAddress, contractABI, signer));

  document.querySelector(
    "#contract-address"
  ).innerHTML = `Contract address: ${contractAddress}`;

  const currentAddress = await signer.getAddress();

  document.getElementById(
    "current"
  ).innerHTML = `Current account: ${currentAddress}`;

  addContractOwnerActions();

  loadAccounts();

  getHistory();

  graphFetchTransactions();

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }
}

initialize();
