import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { loadAccounts } from "./loadAccounts.js";
import { contractAddress, ENS_SEPOLIA_ADDRESSES } from "./config.js";
import {
  contractABI,
  ENSRegistryABI,
  PublicResolverABI,
  RegistrarControllerABI,
} from "./abi.js";
import { getHistory } from "./getHistory.js";
import {
  getProvider,
  getSigner,
  setContract,
  setENSRegistryContract,
  setProvider,
  setPublicResolverContract,
  setRegistrarControllerContract,
  setSigner,
} from "./essentials.js";
import { register } from "./registerEnsDomain.js";

const provider = new ethers.BrowserProvider(window.ethereum);

setProvider(new ethers.BrowserProvider(window.ethereum));

setENSRegistryContract(
  new ethers.Contract(
    ENS_SEPOLIA_ADDRESSES.ENSRegistry,
    ENSRegistryABI,
    provider
  )
);
setPublicResolverContract(
  new ethers.Contract(
    ENS_SEPOLIA_ADDRESSES.PublicResolver,
    PublicResolverABI,
    provider
  )
);

setRegistrarControllerContract(
  new ethers.Contract(
    ENS_SEPOLIA_ADDRESSES.ETHRegistrarController,
    RegistrarControllerABI,
    provider
  )
);

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


register();
