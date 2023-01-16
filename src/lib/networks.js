import utils from "./utils";

const chainList = [
  {
    chainId: utils.toHex(137),
    rpc: "https://polygon.llamarpc.com",
    name: "Polygon",
    image: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    nativeCurrency: {
      name: "Matic Token",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://polygon.llamarpc.com",
      "https://poly-rpc.gateway.pokt.network",
      "https://rpc.ankr.com/polygon",
    ],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  {
    chainId: utils.toHex(1),
    rpc: "https://eth.llamarpc.com",
    name: "Ethereum",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    chainId: utils.toHex(56), // BNB
    rpc: "https://bsc-dataseed.binance.org",
    image: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    name: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-dataseed.binance.org",
      "https://rpc-bsc.bnb48.club",
      "https://bsc-dataseed4.ninicoin.io",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
  },
];

const getChainByChainId = (chainId) => {
  return chainList.find((chain) => chain.chainId === utils.toHex(chainId));
};

const getChainByName = (chainName) => {
  return chainList.find((chain) => chain.name === chainName);
};

const networks = {
  chainList,
  getChainByChainId,
  getChainByName,
};

export default networks;
