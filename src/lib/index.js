import { ethers } from "ethers";
import abi from "./abi.json";
import utils from "./utils";

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const requestAccount = () => {
  return provider.send("eth_requestAccounts");
};

const getChainIdConnected = () => {
  return provider.send("net_version");
};

const performTransaction = async (
  contractAddress = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // address sample: please remove
  paymentWalletAddress = "0xcb18c155d20e68356d8f5649fa732d6eef001e27", // address sample: please remove
  amount = 0.47
) => {
  const tokenContract = new ethers.Contract(
    contractAddress,
    abi,
    provider.getSigner()
  );
  const decimals = await tokenContract.decimals();

  const transaction = await tokenContract.transfer(
    paymentWalletAddress,
    ethers.BigNumber.from(`${utils.toDecimalsValue(amount, decimals)}`),
    {
      gasPrice: "75000000000",
    }
  );

  alert("wait transaction to minted, about 10second"); // remove this line in production

  const receipt = await transaction.wait();

  return receipt.transactionHash;
};

const lib = {
  requestAccount,
  getChainIdConnected,
  performTransaction,
};

export default lib;
