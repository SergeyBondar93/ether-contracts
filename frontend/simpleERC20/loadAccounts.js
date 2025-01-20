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
    const simBalance = ethers.formatEther(balance);

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

    document
      .querySelector("#airdrop-block button")
      ?.addEventListener("click", () => performAirdrop(contract, provider));
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

async function performAirdrop(contract, provider) {
  const accounts = await provider.listAccounts();
  const [continueChoice, addresses] = await waitForUserChoice(accounts);
  console.log("User choice:", continueChoice);
  console.log("Addresses:", addresses);

  if (!continueChoice) return;

  const tx = await contract.airdrop5Percent(addresses, 10);

  addTransactionToHistory(provider, tx, "");

  await tx.wait();
  console.log(`Airdrop has done successfully`);
}
