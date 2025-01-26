import { getContract, getProvider } from "../essentials.js";
import { addTransactionToHistory } from "../history/addTransactionToHistory.js";
import { loadAccounts } from "../loadAccounts.js";

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

export async function performAirdropForAll() {
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