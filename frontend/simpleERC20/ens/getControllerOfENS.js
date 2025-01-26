import {
  keccak256,
  toUtf8Bytes,
} from "../../../node_modules/ethers/dist/ethers.js";
import { getNameWrapperContract } from "./contracts.js";

export async function getController(name) {
  const labelHash = keccak256(toUtf8Bytes(name));
  const controller = await getNameWrapperContract().ownerOf(labelHash); // Query the NameWrapper
  return controller;
}
