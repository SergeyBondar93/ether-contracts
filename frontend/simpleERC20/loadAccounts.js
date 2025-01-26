import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { getContract, getProvider } from "./essentials.js";
import { fetchEnsAvatar } from "./ens/fetchEnsAvatar.js";
import { addTransactionToHistory } from "./history/addTransactionToHistory.js";
import { addActionsHandlers, allocateTo } from "./addActionsHandlers.js";

let isInited = false;

export async function loadAccounts() {
  const provider = getProvider();
  const contract = getContract();
  const accounts = await provider.listAccounts();

  const accountsList = document.getElementById("accounts-list");

  const network = await provider.getNetwork();
  if (network.name !== "sepolia") {
    console.log("Please switch your MetaMask to the Sepolia network.");
    return;
  }
  const address = await contract.getAddress();
  const contractSIMbalance = await contract.balanceOf(address);
  const contractNativeBalance = await provider.getBalance(address);

  const contractETHbalanceElement = document.getElementById(
    "contract-eth-balance"
  );
  const contractSIMbalanceElement = document.getElementById(
    "contract-sim-balance"
  );

  const ethBalance = ethers.formatEther(contractNativeBalance);
  const simBalance = ethers.formatEther(contractSIMbalance);

  const oldETHbalance = +contractETHbalanceElement.innerText;
  const oldSIMbalance = +contractSIMbalanceElement.innerText;

  contractETHbalanceElement.innerHTML = ethers.formatEther(
    contractNativeBalance
  );
  contractSIMbalanceElement.innerHTML = ethers.formatEther(contractSIMbalance);

  if (isInited) {
    if (ethBalance > oldETHbalance) {
      contractETHbalanceElement.classList.remove("blink-red");
      contractETHbalanceElement.classList.add("blink-green");
    } else if (ethBalance < oldETHbalance) {
      contractETHbalanceElement.classList.remove("blink-green");
      contractETHbalanceElement.classList.add("blink-red");
    }

    if (simBalance > oldSIMbalance) {
      contractSIMbalanceElement.classList.remove("blink-red");
      contractSIMbalanceElement.classList.add("blink-green");
    } else if (simBalance < oldSIMbalance) {
      contractSIMbalanceElement.classList.remove("blink-green");
      contractSIMbalanceElement.classList.add("blink-red");
    }
  }

  for (const account of accounts) {
    const balance = await contract.balanceOf(account.address);
    const nativeBalance = await provider.getBalance(account);
    const ethBalance = ethers.formatEther(nativeBalance);
    const simBalance = ethers.formatEther(balance);

    fetchEnsAvatar(account.address);

    // console.log('!!ENS', account.address, ensName);

    const existingElement = document.getElementById(account.address);
    const listItem = existingElement || document.createElement("li");

    listItem.id = account.address;

    const btnId = `allocate-to-${account.address}-btn`;

    let oldETHBalance = 0;
    let oldSIMBalance = 0;

    if (existingElement) {
      oldETHBalance = Number(
        existingElement.querySelector(".eth-balance").innerText
      );
      oldSIMBalance = Number(
        existingElement.querySelector(".sim-balance").innerText
      );
    }

    listItem.innerHTML = `
      ${account.name || "Account"}: 
     <b> <span class="eth-balance" >${ethBalance}</span>  SepoliaETH. </b>
       <span class="sim-balance" > ${simBalance}</span> SIM 
      (${account.address})
      <button id="${btnId}">Allocate</button>
    `;

    if (!existingElement) {
      accountsList.appendChild(listItem);
    } else {
      const ethBlock = existingElement.querySelector(".eth-balance");
      const simBlock = existingElement.querySelector(".sim-balance");
      if (ethBalance > oldETHBalance) {
        ethBlock.classList.remove("blink-red");
        ethBlock.classList.add("blink-green");
      } else if (ethBalance < oldETHBalance) {
        ethBlock.classList.remove("blink-green");
        ethBlock.classList.add("blink-red");
      }

      if (simBalance > oldSIMBalance) {
        simBlock.classList.remove("blink-red");
        simBlock.classList.add("blink-green");
      } else if (simBalance < oldSIMBalance) {
        simBlock.classList.remove("blink-green");
        simBlock.classList.add("blink-red");
      }
    }

    document
      .getElementById(btnId)
      .addEventListener("click", () => allocateTo(account.address));
  }

  if (!isInited) {
    addActionsHandlers();
  }

  isInited = true;
}