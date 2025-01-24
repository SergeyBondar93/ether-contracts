let mainnetProvider = null;
let provider = null;
let signer = null;
let contract = null;

let ENSRegistryContract = null;
let PublicResolverContract = null;
let RegistrarControllerContract = null;

export const setProvider = (_provider) => {
  provider = _provider;
};
export const setMainnetProvider = (_mainnetProvider) => {
  mainnetProvider = _mainnetProvider;
};

export const setSigner = (_signer) => {
  signer = _signer;
};

export const setContract = (_contract) => {
  contract = _contract;
};

export const setENSRegistryContract = (_ENSRegistryContract) => {
  ENSRegistryContract = _ENSRegistryContract;
};
export const setPublicResolverContract = (_PublicResolverContract) => {
  PublicResolverContract = _PublicResolverContract;
};
export const setRegistrarControllerContract = (_RegistrarControllerContract) => {
  console.log('!Set contract ', _RegistrarControllerContract);
  
  RegistrarControllerContract = _RegistrarControllerContract;
};

export const getProvider = () => provider;
export const getMainnetProvider = () => mainnetProvider;
export const getSigner = () => signer;
export const getContract = () => contract;

export const getENSRegistryContract = () => ENSRegistryContract;
export const getPublicResolverContract = () => PublicResolverContract;
export const getRegistrarControllerContract = () => RegistrarControllerContract;
