import { getContract } from "./essentials";

export async function simulateBuyTokens(ethAmountInWei) {
  try {
      const tokensToBuy = await getContract().callStatic.buyTokens({
          value: ethAmountInWei,
      });
      console.log(`Estimated tokens: ${ethers.utils.formatUnits(tokensToBuy, 18)}`);
      return ethers.utils.formatUnits(tokensToBuy, 18); // Convert to human-readable format
  } catch (error) {
      console.error("Error simulating transaction:", error);
      throw error;
  }
}
