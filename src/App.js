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
    const chainId = await lib.getChainIdConnected(
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      "0xcb18c155d20e68356d8f5649fa732d6eef001e27",
      value
    );
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
    const transactionHash = await lib.performTransaction();
    alert(transactionHash);
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
            <img width={25} height={25} src={chainConnected?.image} alt="" />
          )}
        </div>
        <div className="App-SwitchChain">
          Switch network:
          {networks.chainList.map((chain) => (
            <img
              onClick={() => requestSwitchChain(chain.chainId)}
              key={chain.chainId}
              src={chain.image}
              width={25}
              height={25}
              alt=""
            />
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
            <span style={{ fontSize: 12 }}>//test on polygon</span>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
