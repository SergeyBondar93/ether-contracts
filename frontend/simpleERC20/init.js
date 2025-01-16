import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { loadAccounts } from "./loadAccounts.js";
import { contractAddress } from "./config.js";
import { contractABI } from "./abi.js";
import { getHistory } from "./getHistory.js";

const provider = new ethers.BrowserProvider(window.ethereum);
let signer;
let contract;

async function initialize() {
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  document.querySelector(
    "#contract-address"
  ).innerHTML = `Contract address: ${contractAddress}`;

  const currentAddress = await signer.getAddress();

  document.getElementById(
    "current"
  ).innerHTML = `Current account: ${currentAddress}`;

  if (currentAddress === "0xe5982F617fc8c8Bf55Ccc919F78DC6129Acb5532") {
    const withdrowBtn = document.createElement("button");
    withdrowBtn.innerHTML = "Withdrow all eth from account";

    document.getElementById("withdrow-block").append(withdrowBtn);
  }

  loadAccounts(contract, provider);

  getHistory(contract);

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }
}

initialize();
