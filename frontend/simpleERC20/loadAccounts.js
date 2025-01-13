import { ethers } from "../../node_modules/ethers/dist/ethers.js";

let isInited = false;

export async function loadAccounts(contract, provider) {
  const accounts = await provider.listAccounts();
  console.log(provider);

  const accountsList = document.getElementById("accounts-list");
  accountsList.innerHTML = "";

  const network = await provider.getNetwork();
  if (network.name !== "sepolia") {
    console.log("Please switch your MetaMask to the Sepolia network.");
    return;
  }

  const contractSIMbalance = await contract.balanceOf(
    "0x0a080953a00794Bb9b69eEdd4c3B4028076D4134"
  );
  const contractNativeBalance = await provider.getBalance(
    "0x0a080953a00794Bb9b69eEdd4c3B4028076D4134"
  );
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
  }
}

async function transferTokens(contract, provider) {
  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;
  if (!recipient || !amount) return alert("Recipient and amount are required!");

  const tx = await contract.transfer(recipient, ethers.parseEther(amount));
  await tx.wait();
  alert("Transfer complete!");
  loadAccounts(contract, provider);
}

async function approveTokens(contract, provider) {
  const spender = document.getElementById("spender").value;
  const amount = document.getElementById("approve-amount").value;
  if (!spender || !amount) return alert("Spender and amount are required!");

  const tx = await contract.approve(spender, ethers.parseEther(amount));
  await tx.wait();
  alert("Approval complete!");
}

async function allocateTo(contract, account, provider) {
  const amount = prompt("Enter amount to allocate:");
  if (!amount) return;

  const tx = await contract.transfer(account, ethers.parseEther(amount));
  await tx.wait();
  alert(`Allocated ${amount} SIM to ${account}`);
  loadAccounts(contract, provider);
}

async function buyTokens(contract, provider) {
  const value = Number(document.getElementById("buy-value").value);

  if (Number.isNaN(value)) {
    alert("Please enter a valid number. max number = 1");
    return;
  }

  const tx = await contract.buyTokens({
    value: ethers.parseUnits(String(value), "ether"),
  });
  await tx.wait();
  alert(`You have bought tokens`);
  loadAccounts(contract, provider);
}

async function sellTokens(contract, provider) {
  const tx = await contract.buyTokens({
    value: ethers.utils.parseUnits("0.001", "ether"),
  });
  await tx.wait();
  alert(`You have sold tokens`);
  loadAccounts(contract, provider);
}
