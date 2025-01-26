import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { getContract, getProvider } from "./essentials.js";
import { fetchEnsAvatar } from "./ens/fetchEnsAvatar.js";
import { addTransactionToHistory } from "./history/addTransactionToHistory.js";
import { addActionsHandlers, allocateTo } from "./addActionsHandlers.js";

let isInited = false;

const highlightAmount = (element, oldBalance, newBalance) => {
  if (newBalance > oldBalance) {
    element.classList.remove("blink-red");
    element.classList.add("blink-green");
  } else if (newBalance < oldBalance) {
    element.classList.remove("blink-green");
    element.classList.add("blink-red");
  }
};

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
    highlightAmount(contractETHbalanceElement, oldETHbalance, ethBalance);
    highlightAmount(contractSIMbalanceElement, oldSIMbalance, simBalance);
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

    const allocateBtnId = `allocate-to-${account.address}-btn`;

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
      <button id="${allocateBtnId}">Allocate</button>
    `;

    if (!existingElement) {
      accountsList.appendChild(listItem);
    } else {
      const ethBlock = existingElement.querySelector(".eth-balance");
      const simBlock = existingElement.querySelector(".sim-balance");

      highlightAmount(ethBlock, oldETHBalance, ethBalance);
      highlightAmount(simBlock, oldSIMBalance, simBalance);
    }

    document
      .getElementById(allocateBtnId)
      .addEventListener("click", () => allocateTo(account.address));
  }

  if (!isInited) {
    addActionsHandlers();
  }

  isInited = true;
}
