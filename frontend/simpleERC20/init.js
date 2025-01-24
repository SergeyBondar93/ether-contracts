import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { loadAccounts } from "./loadAccounts.js";
import { contractAddress } from "./config.js";
import { contractABI } from "./abi.js";
import { getHistory } from "./getHistory.js";
import { getProvider, getSigner, setContract, setProvider, setSigner } from "./essentials.js";

setProvider(new ethers.BrowserProvider(window.ethereum));
// const mainnetProvider = new providers.JsonRpcProvider("https://mainnet.infura.io/v3");

async function initialize() {
  await getProvider().send("eth_requestAccounts", []);
  setSigner(await getProvider().getSigner());
  setContract(new ethers.Contract(contractAddress, contractABI, getSigner()));

  document.querySelector(
    "#contract-address"
  ).innerHTML = `Contract address: ${contractAddress}`;

  const currentAddress = await getSigner().getAddress();

  document.getElementById(
    "current"
  ).innerHTML = `Current account: ${currentAddress}`;

  if (currentAddress === "0xe5982F617fc8c8Bf55Ccc919F78DC6129Acb5532") {
    const withdrowBtn = document.createElement("button");
    withdrowBtn.innerHTML = "Withdrow all eth from account";
    document.getElementById("withdrow-block").append(withdrowBtn);

    const airdropBtn = document.createElement("button");
    airdropBtn.innerHTML = "Airdrop";
    document.getElementById("airdrop-block").append(airdropBtn);
  }

  loadAccounts();

  getHistory();

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }
}

initialize();
