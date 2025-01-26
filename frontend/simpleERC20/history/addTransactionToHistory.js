import { getProvider } from "../essentials.js";
import { adjustTransactionsHistory } from "./getHistory.js";

export const addTransactionToHistory = async (
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