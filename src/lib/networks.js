import utils from "./utils";

const chainList = [
  {
    chainId: utils.toHex(137), // polygon
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
    chainId: utils.toHex(1), // eth
    name: "Ethereum",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    chainId: utils.toHex(56), // BNB
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
  {
    chainId: utils.toHex(97), // bsc testnet
    image: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    name: "Binance Smart Chain Testnet",
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545",
      "https://bsc-testnet.public.blastapi.io",
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
];

const testAddress = {
  [utils.toHex(1)]: {
    contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // usdc
    paymentWalletAddress: "0xcb18c155d20e68356d8f5649fa732d6eef001e27",
  },
  [utils.toHex(137)]: {
    contractAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // usdc
    paymentWalletAddress: "0xcb18c155d20e68356d8f5649fa732d6eef001e27",
  },
  [utils.toHex(56)]: {
    contractAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // usdc
    paymentWalletAddress: "0xcb18c155d20e68356d8f5649fa732d6eef001e27",
  },
  [utils.toHex(97)]: {
    // bsc test net
    contractAddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", // usdt
    paymentWalletAddress: "0xbe932a99EAaE5bd33139e59DBcB788A22570A7FC",
  },
};

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
  testAddress,
};

export default networks;
