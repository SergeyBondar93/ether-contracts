let ENSRegistryContract = null;
let PublicResolverContract = null;
let RegistrarControllerContract = null;
let NameWrapperContract = null;

export const setENSRegistryContract = (_ENSRegistryContract) => {
  ENSRegistryContract = _ENSRegistryContract;
};
export const setPublicResolverContract = (_PublicResolverContract) => {
  PublicResolverContract = _PublicResolverContract;
};
export const setRegistrarControllerContract = (
  _RegistrarControllerContract
) => {
  RegistrarControllerContract = _RegistrarControllerContract;
};
export const setNameWrapperContractContract = (_NameWrapperContract) => {
  NameWrapperContract = _NameWrapperContract;
};

export const getENSRegistryContract = () => ENSRegistryContract;
export const getPublicResolverContract = () => PublicResolverContract;
export const getRegistrarControllerContract = () => RegistrarControllerContract;
export const getNameWrapperContract = () => NameWrapperContract;
