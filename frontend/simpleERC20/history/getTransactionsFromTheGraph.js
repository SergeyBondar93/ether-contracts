import { ethers } from "../../../node_modules/ethers/dist/ethers.js";

const GRAPHQL_API = "https://api.studio.thegraph.com/query/103053/simple-erc20-test/version/latest"; // 🔥 Replace this with your actual subgraph API URL

// GraphQL Query for different transaction types
const QUERY = `
{
  airdropClaimeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id
    claimant
    amount
    blockNumber
    blockTimestamp
    transactionHash
  }
  approvals(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id
    owner
    spender
    value
    blockNumber
    blockTimestamp
    transactionHash
  }
  burns(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id
    burner
    value
    blockNumber
    blockTimestamp
    transactionHash
  }
  transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id
    from
    to
    value
    blockNumber
    blockTimestamp
    transactionHash
  }
}
`;

export async function graphFetchTransactions() {
    try {
        const response = await fetch(GRAPHQL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: QUERY }),
        });
        const { data } = await response.json();
        displayTransactions(data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

function displayTransactions(data) {
    // Mapping data to transaction types
    const transactionTypes = {
        AirdropClaimed: data.airdropClaimeds || [],
        Approval: data.approvals || [],
        Burn: data.burns || [],
        Transfer: data.transfers || [],
    };

    Object.keys(transactionTypes).forEach(type => {
        const container = document.getElementById(type);
        container.innerHTML = transactionTypes[type].map(tx => `
            <div class="transaction">
                <p><strong>ID:</strong> ${tx.id}</p>
                ${type === "Transfer" ? `<p><strong>From:</strong> ${tx.from}</p><p><strong>To:</strong> ${tx.to}</p>` : ""}
                ${type === "Approval" ? `<p><strong>Owner:</strong> ${tx.owner}</p><p><strong>Spender:</strong> ${tx.spender}</p>` : ""}
                ${type === "AirdropClaimed" ? `<p><strong>Claimant:</strong> ${tx.claimant}</p>` : ""}
                ${type === "Burn" ? `<p><strong>Burner:</strong> ${tx.burner}</p>` : ""}
                <p><strong>Amount:</strong> ${ethers.formatEther(tx.value || tx.amount)}</p>
                <p><strong>Block:</strong> ${tx.blockNumber}</p>
                <p><strong>Timestamp:</strong> ${new Date(tx.blockTimestamp * 1000).toLocaleString()}</p>
                <p><strong>Tx Hash:</strong> <a href="https://sepolia.etherscan.io/tx/${tx.transactionHash}" target="_blank">${tx.transactionHash}</a></p>
            </div>
        `).join("");
    });
}

// Tab Switching Logic
document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".transaction-list").forEach(list => list.classList.add("hidden"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.type).classList.remove("hidden");
    });
});

// Fetch Transactions on Page Load
