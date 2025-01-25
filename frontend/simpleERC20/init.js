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
import { registerENSName } from "./registerEnsDomain.js";

const provider = new ethers.BrowserProvider(window.ethereum);

setProvider(new ethers.BrowserProvider(window.ethereum));



async function initialize() {
  await getProvider().send("eth_requestAccounts", []);
  const signer = await provider.getSigner()
  setSigner(signer);
  setContract(new ethers.Contract(contractAddress, contractABI, signer));

  setENSRegistryContract(
    new ethers.Contract(
      ENS_SEPOLIA_ADDRESSES.ENSRegistry,
      ENSRegistryABI,
      signer
    )
  );
  setPublicResolverContract(
    new ethers.Contract(
      ENS_SEPOLIA_ADDRESSES.PublicResolver,
      PublicResolverABI,
      signer
    )
  );
  
  setRegistrarControllerContract(
    new ethers.Contract(
      ENS_SEPOLIA_ADDRESSES.ETHRegistrarController,
      RegistrarControllerABI,
      signer
    )
  );

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

  /**
   * one-time action
   */
  registerENSName();
}

initialize();


