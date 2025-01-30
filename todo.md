# Web3 Ethereum Learning Path

## **Easy**

1. **Token Creator**

   - [x] Build and deploy your own ERC-20 token on a testnet.
   - [x] Features: Minting, burning, and transferring tokens.
   - [x] Tools: Solidity, Hardhat, MetaMask.

2. **Basic Token Wallet**

   - [x] Create a simple React app that connects to MetaMask and displays the balance of your ERC-20 token.
   - [x] Features: Token balance display, transaction history.
   - [-] ENS: Create functionality to get avatars for accounts.

3. **Airdrop Smart Contract**

   - [x] Write a smart contract to distribute ERC-20 tokens to multiple addresses.
   - [x] Features:
   - [x] Automated airdrop function.
   - [x] Include edge-case testing (e.g., empty lists, gas-efficient bulk transfers).
   - [x] Add an optional frontend for interaction.

4. **The Graph Integration**
   - [ ] Read The Graph documentation.
   - [ ] Query subgraphs from existing dApps (e.g., Uniswap) for practical understanding.
   - [ ] Create functionality to query all contract and transaction data.

---

## **Intermediate**

5. **Token Staking Platform**

   - [ ] Build a dApp where users can stake ERC-20 tokens to earn rewards.
   - [ ] Features:
   - [ ] Stake/unstake tokens.
   - [ ] Track rewards dynamically.
   - [ ] Emit events for state changes to integrate with The Graph.
   - [ ] Implement slashing penalties or loop prevention.

6. **Token Crowdsale**

   - [ ] Develop a smart contract and frontend for an ICO-like token sale.
   - [ ] Features:
   - [ ] Tier-based or time-based dynamic token pricing.
   - [ ] Withdrawal limits and funding goals.
   - [ ] Integrate contract functions with React for real-time feedback.

7. **Decentralized Exchange (DEX) Lite**
   - [ ] Implement a simple exchange for trading ETH and your ERC-20 token.
   - [ ] Features:
   - [ ] Order matching.
   - [ ] Liquidity pool.
   - [ ] Analytics for pool performance and trading visualization.
   - [ ] Simulate real-world conditions like low liquidity and slippage.

---

## **Advanced**

8. **Cross-Chain Token Bridge**

   - [ ] Develop a bridge to transfer your ERC-20 tokens between Ethereum and another blockchain (e.g., Binance Smart Chain).
   - [ ] Features:
   - [ ] Token locking/unlocking mechanisms.
   - [ ] Cross-chain communication using Oracles.
   - [ ] Study existing bridges like Connext for architecture insights.

9. **Advanced Token Standards**

   - [ ] Explore and implement ERC-721 or ERC-1155 standards for NFTs.
   - [ ] Features:
   - [ ] Store token metadata efficiently (e.g., IPFS for URIs).
   - [ ] Optimize gas usage for ERC-1155 batch minting.
   - [ ] NFT marketplace with auction functionality.

10. **DeFi Yield Aggregator**

    - [ ] Build a dApp for depositing tokens and earning yield from multiple DeFi protocols.
    - [ ] Features:

- [ ] Strategy management.
- [ ] Dynamic APY display.

11. **Governance DAO**
    - [ ] Create a governance system for your ERC-20 token using OpenZeppelin’s Governance module.
    - [ ] Features:

- [ ] Voting, proposals, and execution.
- [ ] Time-locking and quorum rules.
- [ ] Test proposal flow with multiple wallets.

---

## **Technologies to Master**

### **Blockchain Development**

- [ ] **Solidity:** Advanced smart contract development.
- [ ] **Ethers.js/Web3.js:** Blockchain interaction.
- [ ] **Hardhat/Truffle:** Development and testing frameworks.
- [ ] **OpenZeppelin:** Reusable smart contract libraries.

### **Frontend Development**

- [x] **React.js/Vue.js:** Frontend frameworks for dApps.
- [x] **Vite:** Fast development environment for dApps.
- [x] **TypeScript:** Strongly typed JavaScript for better error handling.

### **Blockchain Infrastructure**

- [ ] **Ethereum:** Core blockchain concepts and tools like Geth.
- [ ] **Layer 2 Solutions:** Optimism, Arbitrum.
- [ ] **IPFS/Filecoin:** Decentralized file storage.
- [ ] **Oracles:** Chainlink for real-world data integration.

### **Smart Contract Security**

- [ ] **Auditing Tools:** MythX, Slither, or Remix IDE for security analysis.
- [ ] **Best Practices:** Avoid common pitfalls like reentrancy or overflow.

### **Advanced Topics**

- [ ] **DeFi Protocols:** Uniswap, Aave, Compound.
- [ ] **Cross-Chain Solutions:** Bridges like Multichain or Connext.
- [ ] **Testing:** Writing automated tests with Mocha/Chai for smart contracts.
- [ ] **MEV (Miner Extractable Value):** Front-running and gas optimizations.
- [ ] **zk-SNARKs:** Privacy-focused smart contracts.

---

## **Job-Ready Tools**

- [x] **Version Control:** Git/GitHub.
- [x] **CI/CD Pipelines:** Automating testing and deployment.
- [x] **Docker:** Containerize blockchain nodes for testing.
