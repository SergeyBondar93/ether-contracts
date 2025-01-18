import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { adjustTransactionsHistory } from "./getHistory.js";
let isInited = false;

const addTransactionToHistory = async (
  provider,
  transaction,
  recipient,
  { reverseArgs } = {}
) => {
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

export async function loadAccounts(contract, provider) {
  const accounts = await provider.listAccounts();
  // console.log(provider);
  // console.log(contract);

  const accountsList = document.getElementById("accounts-list");
  accountsList.innerHTML = "";

  const network = await provider.getNetwork();
  if (network.name !== "sepolia") {
    console.log("Please switch your MetaMask to the Sepolia network.");
    return;
  }
  const address = await contract.getAddress();
  const contractSIMbalance = await contract.balanceOf(address);
  const contractNativeBalance = await provider.getBalance(address);
  document.getElementById("contract-sim-balance").innerHTML =
    ethers.formatEther(contractSIMbalance);
  document.getElementById("contract-eth-balance").innerHTML =
    ethers.formatEther(contractNativeBalance);

  for (const account of accounts) {
    const balance = await contract.balanceOf(account.address);
    const nativeBalance = await provider.getBalance(account);
    const ethBalance = ethers.formatEther(nativeBalance);

    const listItem = document.createElement("li");

    const btnId = `btn-all-to-${account.address}`;

    listItem.innerHTML = `
      ${account.name || "Account"}: 
     <b> ${ethBalance}  SepoliaETH. </b>
      ${ethers.formatEther(balance)} SIM 
      (${account.address})
      <button id="${btnId}">Allocate</button>
    `;
    accountsList.appendChild(listItem);

    document
      .getElementById(btnId)
      .addEventListener("click", () =>
        allocateTo(contract, account.address, provider)
      );
  }

  if (!isInited) {
    isInited = true;

    document
      .getElementById("buy-btn")
      .addEventListener("click", () => buyTokens(contract, provider));
    document
      .getElementById("sell-btn")
      .addEventListener("click", () => sellTokens(contract, provider));

    document
      .getElementById("transfer-btn")
      .addEventListener("click", () => transferTokens(contract, provider));
    document
      .getElementById("approve-btn")
      .addEventListener("click", () => approveTokens(contract, provider));

    document
      .querySelector("#withdrow-block button")
      ?.addEventListener("click", () =>
        withdrowETHToCreatorAccount(contract, provider)
      );
  }
}

async function transferTokens(contract, provider) {
  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;
  if (!recipient || !amount) return alert("Recipient and amount are required!");

  const tx = await contract.transfer(recipient, ethers.parseEther(amount));

  addTransactionToHistory(provider, tx, recipient);

  await tx.wait();
  alert("Transfer complete!");
  loadAccounts(contract, provider);
}

async function approveTokens(contract, provider) {
  const recipient = document.getElementById("spender").value;
  const amount = document.getElementById("approve-amount").value;
  if (!recipient || !amount) return alert("Spender and amount are required!");

  addTransactionToHistory(provider, tx, recipient);
  const tx = await contract.approve(recipient, ethers.parseEther(amount));
  await tx.wait();
  alert("Approval complete!");
}

async function allocateTo(contract, account, provider) {
  const amount = prompt("Enter amount to allocate:");
  if (!amount) return;
  const tx = await contract.transfer(account, ethers.parseEther(amount));

  addTransactionToHistory(provider, tx, account);

  await tx.wait();
  alert(`Allocated ${amount} SIM to ${account}`);
  loadAccounts(contract, provider);
}

async function buyTokens(contract, provider) {
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

  addTransactionToHistory(provider, tx, await contract.getAddress(), {
    reverseArgs: true,
  });

  await tx.wait();
  alert(`You have bought tokens`);
  loadAccounts(contract, provider);
}

async function sellTokens(contract, provider) {
  const value = Number(document.getElementById("sell-value").value);

  if (Number.isNaN(value)) {
    alert("Please enter a valid number.");
    return;
  }
  const formattedValue = ethers.parseEther(`${value}`);

  const tx = await contract.sellTokens(formattedValue);

  addTransactionToHistory(provider, tx, await contract.getAddress());

  await tx.wait();
  alert(`You have sold tokens`);
  loadAccounts(contract, provider);
}

async function withdrowETHToCreatorAccount(contract, provider) {
  const tx = await contract.withdrawEther();
  await tx.wait();
  alert(`You have sold tokens`);
}
