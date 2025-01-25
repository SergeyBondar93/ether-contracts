import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { getContract, getProvider } from "./essentials.js";
import { fetchEnsAvatar } from "./fetchEnsAvatar.js";
import { adjustTransactionsHistory } from "./getHistory.js";
let isInited = false;


const addTransactionToHistory = async (
  transaction,
  recipient,
  { reverseArgs } = {}
) => {
  const provider = getProvider();
  let args = [transaction.from, recipient];

  if (reverseArgs) {
    args.reverse();
  }

  adjustTransactionsHistory({
    transactionHash: transaction.hash,
    args,
    fragment: { name: "" },
  });
  console.log(transaction);

  return new Promise((res) => {
    console.log("Transaction Hash:", transaction.hash);
    const interval = setInterval(async () => {
      const txReceipt = await provider.getTransactionReceipt(transaction.hash);
      if (txReceipt) {
        console.log("Transaction Receipt:", txReceipt);
        res(txReceipt);
        clearInterval(interval);
      } else {
        console.log("Transaction is still pending...");
      }
    }, 1000);
  });
};

let initial = true;

export async function loadAccounts() {
  const provider = getProvider();
  const contract = getContract();
  const accounts = await provider.listAccounts();
  // console.log(provider);
  // console.log(contract);

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

  if (!initial) {
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
  } else {
    initial = false;
  }

  for (const account of accounts) {
    const balance = await contract.balanceOf(account.address);
    const nativeBalance = await provider.getBalance(account);
    const ethBalance = ethers.formatEther(nativeBalance);
    const simBalance = ethers.formatEther(balance);

   
    fetchEnsAvatar(account.address)

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

      // setTimeout(() => {
      //   ethBlock.classList.remove("blink-green", "blink-red");
      //   simBlock.classList.remove("blink-green", "blink-red");
      // }, 3000);
    }

    document
      .getElementById(btnId)
      .addEventListener("click", () => allocateTo(account.address));
  }

  if (!isInited) {
    isInited = true;

    document
      .getElementById("buy-btn")
      .addEventListener("click", () => buyTokens());
    document
      .getElementById("sell-btn")
      .addEventListener("click", () => sellTokens());

    document
      .getElementById("transfer-btn")
      .addEventListener("click", () => transferTokens());
    document
      .getElementById("approve-btn")
      .addEventListener("click", () => approveTokens());

    document
      .querySelector("#withdrow-block button")
      ?.addEventListener("click", () => withdrowETHToCreatorAccount());

    document
      .querySelector("#airdrop-block button")
      ?.addEventListener("click", () => performAirdrop());
  }
}

async function transferTokens() {
  const provider = getProvider();
  const contract = getContract();
  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;
  if (!recipient || !amount) return alert("Recipient and amount are required!");

  const tx = await contract.transfer(recipient, ethers.parseEther(amount));

  addTransactionToHistory(tx, recipient);

  await tx.wait();
  alert("Transfer complete!");
  loadAccounts();
}

async function approveTokens() {
  const provider = getProvider();
  const contract = getContract();
  const recipient = document.getElementById("spender").value;
  const amount = document.getElementById("approve-amount").value;
  if (!recipient || !amount) return alert("Spender and amount are required!");

  addTransactionToHistory(tx, recipient);
  const tx = await contract.approve(recipient, ethers.parseEther(amount));
  await tx.wait();
  alert("Approval complete!");
}

async function allocateTo(account) {
  const provider = getProvider();
  const contract = getContract();
  const amount = prompt("Enter amount to allocate:");
  if (!amount) return;
  const tx = await contract.transfer(account, ethers.parseEther(amount));

  addTransactionToHistory(tx, account);

  await tx.wait();
  alert(`Allocated ${amount} SIM to ${account}`);
  loadAccounts();
}

async function buyTokens() {
  const provider = getProvider();
  const contract = getContract();
  const value = Number(document.getElementById("buy-value").value);

  if (Number.isNaN(value) || value > 1) {
    alert(
      "Please enter a valid number. max number = 1. You need to enter value in ETH"
    );
    return;
  }

  const tx = await contract.buyTokens({
    value: ethers.parseUnits(String(value), "ether"),
  });

  addTransactionToHistory(tx, await contract.getAddress(), {
    reverseArgs: true,
  });

  await tx.wait();
  alert(`You have bought tokens`);
  loadAccounts();
}

async function sellTokens() {
  const provider = getProvider();
  const contract = getContract();
  const value = Number(document.getElementById("sell-value").value);

  if (Number.isNaN(value)) {
    alert("Please enter a valid number.");
    return;
  }
  const formattedValue = ethers.parseEther(`${value}`);

  const tx = await contract.sellTokens(formattedValue);

  addTransactionToHistory(tx, await contract.getAddress());

  await tx.wait();
  alert(`You have sold tokens`);
  loadAccounts();
}

async function withdrowETHToCreatorAccount() {
  const provider = getProvider();
  const contract = getContract();
  const tx = await contract.withdrawEther();
  await tx.wait();
  alert(`You have withdrown tokens`);
}

function waitForUserChoice(accounts) {
  console.log(accounts);
  const value = accounts.map((acc) => acc.address);
  return new Promise((resolve) => {
    const dialogOverlay = document.getElementById("dialog");
    const input = document.getElementById("dialog-input");
    const cancelButton = document.getElementById("cancel-button");
    const confirmButton = document.getElementById("confirm-button");
    console.log(value);

    input.value = JSON.stringify(value, null, 2);

    dialogOverlay.style.display = "flex";

    dialogOverlay.onclick = (event) => {
      console.log(event.target, dialogOverlay, event.target === dialogOverlay);

      if (event.target === dialogOverlay) {
        console.log("!INSIDE", event.target);

        dialogOverlay.style.display = "none";
        resolve([false, null]);
      }
    };

    cancelButton.onclick = () => {
      dialogOverlay.style.display = "none";
      resolve([false, null]);
    };

    confirmButton.onclick = () => {
      try {
        const value = input.value.trim();
        const parsed = JSON.parse(value);
        dialogOverlay.style.display = "none";
        resolve([true, parsed]);
      } catch (error) {
        alert("Incorrect JSON of addresses");
        return;
      }
    };
  });
}

async function performAirdrop() {
  const provider = getProvider();
  const contract = getContract();
  const accounts = await provider.listAccounts();
  const [continueChoice, addresses] = await waitForUserChoice(accounts);

  if (!continueChoice) return;

  const tx = await contract.airdrop(addresses, 5);

  addTransactionToHistory(tx, "");

  await tx.wait();
  console.log(`Airdrop has done successfully`);
  loadAccounts();
}

