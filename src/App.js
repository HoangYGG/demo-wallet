import { useEffect, useState } from "react";
import "./App.css";
import lib from "./lib";
import networks from "./lib/networks";

function App() {
  const [userAddress, setUserAddress] = useState();
  const [chainIdConnected, setChainIdConnected] = useState(null);
  const [value, setValue] = useState("");

  const chainConnected = networks.getChainByChainId(chainIdConnected);

  const onConnectWallet = async () => {
    const [firstAccount] = await lib.requestAccount();
    setUserAddress(firstAccount);
  };

  useEffect(() => {
    if (userAddress) {
      fetchChainConnected();
    }
  }, [userAddress]);

  //listen events
  useEffect(() => {
    const onChangeChanged = (event) => {
      fetchChainConnected();
    };

    const onAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // account disconnected

        setUserAddress(null);
        setChainIdConnected(null);
      } else {
        onConnectWallet();
      }
    };

    window.ethereum.on("chainChanged", onChangeChanged);
    window.ethereum.on("accountsChanged", onAccountsChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", onChangeChanged);
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
    };
  }, []);

  const fetchChainConnected = async () => {
    const chainId = await lib.getChainIdConnected();
    setChainIdConnected(chainId);
  };

  const requestSwitchChain = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId,
          },
        ],
      });
    } catch {
      const chainSupported = networks.getChainByChainId(chainId);

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId,
            chainName: chainSupported.name,
            nativeCurrency: chainSupported.nativeCurrency,
            rpcUrls: chainSupported.rpcUrls,
            blockExplorerUrls: chainSupported.blockExplorerUrls,
          },
        ],
      });
    }
  };

  const onSendTransaction = async () => {
    try {
      const transactionHash = await lib.performTransaction(
        networks.testAddress[chainConnected.chainId].contractAddress,
        networks.testAddress[chainConnected.chainId].paymentWalletAddress,
        value
      );
      alert(transactionHash);
    } catch (error) {
      switch (error.code) {
        case "UNPREDICTABLE_GAS_LIMIT":
          alert("không đủ tiền");
          break;
        case "ACTION_REJECTED":
          alert("user denied transaction");
          break;
        default:
          alert("error", error.message);
          break;
      }
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <button onClick={onConnectWallet}>Connect wallet</button>
        {chainConnected && <p> Address: {userAddress}</p>}

        <div className="App-chain">
          Chain connected:
          {!chainConnected ? (
            <span>Unknown</span>
          ) : (
            <>
              <img width={25} height={25} src={chainConnected?.image} alt="" />
              {chainConnected.name}
            </>
          )}
        </div>
        <div className="App-SwitchChain">
          Switch network:
          {networks.chainList.map((chain) => (
            <div
              key={chain.chainId}
              onClick={() => requestSwitchChain(chain.chainId)}
            >
              <img src={chain.image} width={25} height={25} alt="" />
              <span>{chain.name}</span>
            </div>
          ))}
        </div>

        {chainConnected && (
          <>
            <div>
              <input
                type={"number"}
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
              <button onClick={onSendTransaction}>send transaction</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
