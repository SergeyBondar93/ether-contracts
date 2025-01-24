import { getContract, getProvider } from "./essentials";

export async function estimateTransactionGas(methodName, methodArgs = []) {
  try {
    const contract = getContract();

    // Populate the transaction for the given method
    const txData = await contract[methodName].populateTransaction(
      ...methodArgs
    );

    // Estimate the gas required for this transaction
    const estimatedGas = await contract[methodName].estimateGas({});
    return estimatedGas;
  } catch (error) {
    console.error(`Error estimating gas for ${methodName}:`, error);
    return null;
  }
}

export async function getGasPrice() {
  const provider = getProvider();
  return ethers.getBigInt(await provider.send("eth_gasPrice", []));
}

export async function calculateTransactionCost(estimatedGas) {
  const provider = getProvider();
  const gasPrice = await provider.send("eth_gasPrice", []); // (await provider.getFeeData()).gasPrice; // Current gas price in wei

  const totalCostWei = estimatedGas * ethers.getBigInt(gasPrice); // Total cost in wei
  const totalCostEth = ethers.formatEther(totalCostWei); // Convert to Ether
  return totalCostEth;
}
