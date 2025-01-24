import { getMainnetProvider } from "./essentials.js";

export async function fetchEnsAvatar(address) {
  // Perform ENS lookup on Mainnet
  const mainnetProvider = getMainnetProvider();
  const ensName = await  mainnetProvider.lookupAddress(address);

  if (!ensName) {
      console.log("No ENS name associated with this address on Mainnet.");
      return;
  }

  console.log("ENS Name:", ensName);

  // Resolve avatar
  const avatarLinkage = await AvatarLinkage.from(ensName);
  console.log("Avatar URL:", avatarLinkage.url);
}