import { ethers } from "../../node_modules/ethers/dist/ethers.js";
import { getContract, getProvider, getSigner } from "./essentials.js";
import { addTransactionToHistory } from "./history/addTransactionToHistory.js";
import { loadAccounts } from "./loadAccounts.js";

export const addActionsHandlers = async () => {
  document.getElementById("buy-value").addEventListener("input", async (e) => {
    console.log(e.target.value);
  });

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
    .getElementById("claim-airdrop-btn")
    .addEventListener("click", () => claimAirdrop());
};

async function transferTokens() {
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
  const contract = getContract();
  const recipient = document.getElementById("spender").value;
  const amount = document.getElementById("approve-amount").value;
  if (!recipient || !amount) return alert("Spender and amount are required!");

  addTransactionToHistory(tx, recipient);
  const tx = await contract.approve(recipient, ethers.parseEther(amount));
  await tx.wait();
  alert("Approval complete!");
}

async function buyTokens() {
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
  const contract = getContract();
  const value = Number(document.getElementById("sell-value").value);

  if (Number.isNaN(value)) {
    alert("Please enter a valid number.");
    return;
  }
  const formattedValue = ethers.parseEther(`${value}`);
  console.log(formattedValue);

  const tx = await contract.sellTokens(formattedValue);

  addTransactionToHistory(tx, await contract.getAddress());

  await tx.wait();
  alert(`You have sold tokens`);
  loadAccounts();
}

export async function allocateTo(account) {
  const contract = getContract();
  const amount = prompt("Enter amount to allocate:");
  if (!amount) return;
  const tx = await contract.transfer(account, ethers.parseEther(amount));

  addTransactionToHistory(tx, account);

  await tx.wait();
  alert(`Allocated ${amount} SIM to ${account}`);
  loadAccounts();
}

async function claimAirdrop() {
  const contract = getContract();

  const result = confirm("Do you really want to claim airdrop?");
  if (!result) return;

  const tx = await contract.claimAirdrop();

  addTransactionToHistory(tx, "");

  await tx.wait();
  console.log("Airdrop has been claimed");

  loadAccounts();
}
