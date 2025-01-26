import { getContract, getSigner } from "./essentials.js";
import { performAirdropForAll } from "./airdrop/airdropForAll.js";

export const addContractOwnerActions = async () => {
  const currentAddress = await getSigner().getAddress();
  if (currentAddress === "0xe5982F617fc8c8Bf55Ccc919F78DC6129Acb5532") {
    const withdrowBtn = document.createElement("button");
    withdrowBtn.id = "withdrow-button";
    withdrowBtn.innerHTML = "Withdrow all eth from account";
    document.getElementById("withdrow-block").append(withdrowBtn);

    const airdropForAllBtn = document.createElement("button");

    airdropForAllBtn.id = "airdrop-for-all-btn";

    airdropForAllBtn.innerHTML = "Airdrop for all";
    document.getElementById("airdrop-block").append(airdropForAllBtn);

    document
      .querySelector("#withdrow-button")
      ?.addEventListener("click", () => withdrowETHToCreatorAccount());
    document
      .querySelector("#airdrop-for-all-btn")
      ?.addEventListener("click", () => performAirdropForAll());
  }
};

async function withdrowETHToCreatorAccount() {
  const contract = getContract();
  const tx = await contract.withdrawEther();
  await tx.wait();
  alert(`You have withdrown tokens`);
}
