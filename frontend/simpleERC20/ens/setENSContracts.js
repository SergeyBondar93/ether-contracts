import { ethers } from "../../../node_modules/ethers/dist/ethers.js";
import { ENS_SEPOLIA_ADDRESSES } from "./addresses.js";
import {
  ENSRegistryABI,
  NameWrapperAbi,
  PublicResolverABI,
  RegistrarControllerABI,
} from "./abi.js";
import {
  setENSRegistryContract,
  setNameWrapperContractContract,
  setPublicResolverContract,
  setRegistrarControllerContract,
} from "./contracts.js";
import { getSigner } from "../essentials.js";

export const setENSContracts = async () => {
  const signer = await getSigner();
  setENSRegistryContract(
    new ethers.Contract(
      ENS_SEPOLIA_ADDRESSES.ENSRegistry,
      ENSRegistryABI,
      signer
    )
  );
  setPublicResolverContract(
    new ethers.Contract(
      ENS_SEPOLIA_ADDRESSES.PublicResolver,
      PublicResolverABI,
      signer
    )
  );

  setRegistrarControllerContract(
    new ethers.Contract(
      ENS_SEPOLIA_ADDRESSES.ETHRegistrarController,
      RegistrarControllerABI,
      signer
    )
  );

  const nameWrapperContract = new ethers.Contract(
    ENS_SEPOLIA_ADDRESSES.NameWrapper,
    NameWrapperAbi,
    signer
  );
  setNameWrapperContractContract(nameWrapperContract);
};
