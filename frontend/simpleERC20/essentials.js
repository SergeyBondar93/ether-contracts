let provider = null;
let signer = null;
let contract = null;

export const setProvider = (_provider) => {
  provider = _provider;
};

export const setSigner = (_signer) => {
  signer = _signer;
};

export const setContract = (_contract) => {
  contract = _contract;
};

export const getProvider = () => provider;
export const getSigner = () => signer;
export const getContract = () => contract;
