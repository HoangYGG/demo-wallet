import { ethers } from "ethers";
import abi from "./abi.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const requestAccount = () => {
  return provider.send("eth_requestAccounts");
};

const getChainIdConnected = () => {
  return provider.send("net_version");
};

const fetchBalance = (address, sender) => {
  const contract = new ethers.Contract(address, abi);
  return contract.balanceOf(sender);
};

const lib = {
  requestAccount,
  getChainIdConnected,
  fetchBalance,
};

export default lib;
