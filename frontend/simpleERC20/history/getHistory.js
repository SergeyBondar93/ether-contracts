import { contractAddress } from "../config.js";
import { ethers } from "../../../node_modules/ethers/dist/ethers.js";
import { getContract } from "../essentials.js";
import { graphFetchTransactions } from "./getTransactionsFromTheGraph.js";
const eventsList = document.getElementById("events-list");

const getAccName = (address) => {
  switch (address) {
    case contractAddress:
      return "Contract";
    case "0xe5982F617fc8c8Bf55Ccc919F78DC6129Acb5532":
      return "Owner of contract (5532)";
    default:
      return address;
  }
};

const LOADING_STATE = "Transaction is is progress...";

export async function adjustTransactionsHistory(event) {
  const li = document.createElement("li");
  const transactionHash = event.transactionHash || event.log.transactionHash;
  const blockNumber = event.blockNumber || event.log?.blockNumber;

  if (!transactionHash) return;

  // remove the transaction if it wa added using some method in this app.
  // each method creates and adds a placeholder to the transaction list
  document.getElementById(transactionHash)?.remove();

  const [from, to, amount] = event.args;

  const hashLine = ` <a target="_blank" rel="noreferrer noopener nofollow" href="https://sepolia.etherscan.io/tx/${transactionHash}" >Etherscan</a>`;

  const eventInfo = `
      <strong>Event Name (from event.fragment.name):</strong> ${
        event.fragment.name || LOADING_STATE
      } <br>
      <strong>Block Number:</strong> ${blockNumber || LOADING_STATE} <br>
      <strong>Transaction Hash:</strong> ${hashLine}  <br>
      
      <span>From: ${getAccName(from)}</span>
<br/>
<span>To: ${getAccName(to)}</span>
<br/>
<span>Amount: ${amount ? ethers.formatEther(amount) : LOADING_STATE}</span>

      <span> 
      
      
      `;

  li.innerHTML = eventInfo;

  li.id = transactionHash;

  eventsList.prepend(li);
}

async function renderEvents(events) {
  eventsList.innerHTML = "";

  events.forEach(adjustTransactionsHistory);

  console.log("Events rendered successfully");
}

export const getHistory = () => {
  const contract = getContract();
  async function getContractEvents() {
    try {
      const transferEvents = await contract.queryFilter("Transfer");
      const approvalEvents = await contract.queryFilter("Approval");
      console.log("!Start getting ");
      const events = [...transferEvents, ...approvalEvents].sort(
        (a, b) => a.blockNumber - b.blockNumber
      );
      console.log(events);

      const allEvents = renderEvents(events);
      return allEvents;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
  getContractEvents();

  contract.on("Transfer", async (_a, _b, _c, event) => {
    adjustTransactionsHistory(event);
    graphFetchTransactions();
  });
  contract.on("Approval", async (_a, _b, _c, event) => {
    adjustTransactionsHistory(event);
    graphFetchTransactions();
  });
  contract.on("Burn", async (_a, _b, _c, event) => {
    getHistory()
    graphFetchTransactions();
  });
  contract.on("AirdropClaimed", async (_a, _b, _c, event) => {
    getHistory()
    graphFetchTransactions();
  });
};
