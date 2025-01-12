import { ethers } from "../node_modules/ethers/dist/ethers.js";
import { accs } from "../env.js";

export async function updateCount(contract, provider) {
  // Use the provider for read-only methods
  const contractReadOnly = contract.connect(provider); // Read-only context
  const count = await contractReadOnly.getCount();
  document.getElementById("count").innerText = count.toString();

  getBalances(accs, provider);
}

// Increment the count
export async function incrementCount(contract, provider) {
  // Use the signer for transactions
  const tx = await contract.increment();
  await tx.wait(); // Wait for the transaction to be mined
  await updateCount(contract, provider); // Update the count after the transaction
}

// Decrement the count
export async function decrementCount(contract, provider) {
  // Use the signer for transactions
  const tx = await contract.decrement();
  await tx.wait(); // Wait for the transaction to be mined
  await updateCount(contract, provider); // Update the count after the transaction
}

export async function getBalances(accs, provider) {
  const balances = [];

  for (const acc of accs) {
    const { accountName, publicKey } = acc;
    try {
      const balance = await provider.getBalance(publicKey); // Get the balance in wei
      balances.push({
        accountName,
        address: publicKey,
        balance: ethers.formatEther(balance), // Convert balance to Ether
      });
    } catch (error) {
      console.error(`Failed to fetch balance for ${publicKey}:`, error);
      balances.push({
        accountName,
        address: publicKey,
        balance: "Error fetching balance",
      });
    }
  }

  let newBalances = "";

  balances.forEach(({ address, balance, accountName }) => {
    const li = `
      <li><i class="address" >${accountName} ${address}</i> - <b>${balance}</b></li>
    `;
    newBalances += li;
  });
  document.getElementById("balances").innerHTML = newBalances;
}
