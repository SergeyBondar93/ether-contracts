import { contractAddress } from "./config.js";
import { ethers } from "../../node_modules/ethers/dist/ethers.js";
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

async function getEventRepresentation(event) {
  const li = document.createElement("li");

  const [from, to, amount] = event.args;

  const hashLine = event.transactionHash
    ? `${event.transactionHash} <a target="_blank" rel="noreferrer noopener nofollow" href="https://sepolia.etherscan.io/tx/${event.transactionHash}" >Etherscan</a>`
    : LOADING_STATE;

  const eventInfo = `
      <strong>Event Name (from event.fragment.name):</strong> ${
        event.fragment.name
      } <br>
      <strong>Block Number:</strong> ${event.blockNumber || LOADING_STATE} <br>
      <strong>Transaction Hash:</strong> ${hashLine}  <br>
      
      <span>From: ${getAccName(from)}</span>
<br/>
<span>To: ${getAccName(to)}</span>
<br/>
<span>Amount: ${ethers.formatEther(amount)}</span>

      <span> 
      
      
      `;

  li.innerHTML = eventInfo;

  return li;
}

async function renderEvents(events) {
  eventsList.innerHTML = "";

  events.forEach(async (event) => {
    const li = await getEventRepresentation(event);
    eventsList.prepend(li);
  });

  console.log("Events rendered successfully");
}

export const getHistory = (contract) => {
  async function getContractEvents() {
    try {
      const transferEvents = await contract.queryFilter("Transfer");
      const approvalEvents = await contract.queryFilter("Approval");
      console.log("!Start getting ");

      const allEvents = renderEvents([...transferEvents, ...approvalEvents]);
      return allEvents;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
  getContractEvents();
  console.log("!GET HISTORY CALL");

  contract.on("Transfer", async (_a, _b, _c, event) => {
    const li = await getEventRepresentation(event);
    eventsList.prepend(li);
    console.log("!START TRANSFER", _a, _b, _c, event);
  });
  contract.on("Approval", async (_a, _b, _c, event) => {
    const li = await getEventRepresentation(event);
    eventsList.prepend(li);
    console.log("!START APPROVAL", _a, _b, _c, event);
  });
};

// TODO - add live updates for transaction in progress
