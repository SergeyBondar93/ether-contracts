import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { loadAccounts } from "./loadAccounts.js";
import { contractAddress } from "./config.js";
import { contractABI } from "./abi.js";
import { getHistory } from "./getHistory.js";
import {
  getProvider,
  setContract,
  setProvider,
  setSigner,
} from "./essentials.js";
import { setENSContracts } from "./ens/setENSContracts.js";
import { getController } from "./ens/getControllerOfENS.js";
import { registerENSName } from "./ens/registerEnsDomain.js";

const provider = new ethers.BrowserProvider(window.ethereum);

setProvider(new ethers.BrowserProvider(window.ethereum));

const ensName = "my-demo-testname-for-test-app";

async function initialize() {
  await getProvider().send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  setSigner(signer);
  setContract(new ethers.Contract(contractAddress, contractABI, signer));

  setENSContracts();

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
