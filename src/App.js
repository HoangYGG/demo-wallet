import { useEffect, useState } from "react";
import "./App.css";
import lib from "./lib";
import networks from "./lib/networks";
import utils from "./lib/utils";

function App() {
  const [userAddress, setUserAddress] = useState();
  const [chainIdConnected, setChainIdConnected] = useState(null);
  const [tokenByNetworks, setTokenByNetworks] = useState([]);
  const [operatorList, setOperatorList] = useState([]);
  const [products, setProducts] = useState([]);
  //form
  const [operatorSelected, setOperatorSelected] = useState();
  const [productSelected, setProductSelected] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [value, setValue] = useState();

  const chainConnected = networks.getChainByChainId(chainIdConnected);
  const tokenByChain =
    tokenByNetworks.find((network) => network.name === chainConnected?.name)
      ?.tokens.mainnet || {};

  const networkId = tokenByNetworks.find(
    (network) => network.name === chainConnected?.name
  )?.id;

  const onConnectWallet = async () => {
    const [firstAccount] = await lib.requestAccount();
    setUserAddress(firstAccount);
  };

  useEffect(() => {
    function fetchNetworkAndTokens() {
      fetch("https://gcloud.xld.finance/payment/multi-chain/networks")
        .then((response) => response.json())
        .then((data) => setTokenByNetworks(data.networks));
    }

    fetchNetworkAndTokens();
  }, []);

  useEffect(() => {
    if (paymentMethod) {
      function fetchOperator(tokenName) {
        fetch("https://gcloud.xld.finance/topup/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method: {
              chain: networkId,
              network: "Mainnet",
              token: tokenName,
            },
            details: {
              country_code: "84",
              mobile_number: "0347677207",
            },
          }),
        })
          .then((response) => response.json())
          .then((data) => setOperatorList(data.operators));
      }

      fetchOperator(paymentMethod);
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (operatorSelected && paymentMethod) {
      function fetchProduct(operatorId, tokenName) {
        fetch("https://gcloud.xld.finance/tshop/products/operator", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method: {
              chain: networkId,
              network: "Mainnet",
              token: tokenName,
            },
            id: operatorId,
          }),
        })
          .then((response) => response.json())
          .then((data) => setProducts(data.products));
      }

      fetchProduct(operatorSelected, paymentMethod);
    }
  }, [operatorSelected, paymentMethod]);

  useEffect(() => {
    if (userAddress) {
      fetchChainConnected();
    }
  }, [userAddress]);

  useEffect(() => {
    const onChangeChanged = () => {
      fetchChainConnected();
    };
    window.ethereum.on("chainChanged", onChangeChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", onChangeChanged);
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
            chainId, // A 0x-prefixed hexadecimal string
            chainName: chainSupported.name,
            nativeCurrency: chainSupported.nativeCurrency,
            rpcUrls: chainSupported.rpcUrls,
            blockExplorerUrls: chainSupported.blockExplorerUrls,
          },
        ],
      });
    }
  };

  const onPaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const onOperatorChange = (id) => {
    setOperatorSelected(id);
  };

  const onProductChange = (id) => {
    setProductSelected(id);
  };

  const onSubmit = async () => {
    console.log(utils.createSignature().then(console.log));
    // const confirmData = await fetch(
    //   "https://gcloud.xld.finance/mobile-load/confirm",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       method: {
    //         chain: networkId,
    //         network: "Mainnet",
    //         token: paymentMethod,
    //       },
    //       country_code: "+84",
    //       mobile_number: "0347677207",
    //       product_id: productSelected,
    //       user_wallet_address: userAddress,
    //     }),
    //   }
    // );
    // console.log("🚀 ~ file: App.js:180 ~ onSubmit ~ confirmData", confirmData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={onConnectWallet}>Connect wallet</button>
        <p> Address: {userAddress}</p>

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
            <div className="App-tokens">
              Choose Payment Method
              <div className="App-token">
                {Object.keys(tokenByChain).map((key, value) => (
                  <div key={key}>
                    <input
                      onChange={() => onPaymentMethodChange(key)}
                      name="method"
                      type="radio"
                      checked={paymentMethod === key}
                      id={key}
                      value={key}
                    />
                    <label htmlFor={key}>{key}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="App-tokens">
              Choose Operator
              <div className="App-token">
                {operatorList.map((operator) => (
                  <div key={operator.id}>
                    <input
                      onChange={() => onOperatorChange(operator.id)}
                      name="operator"
                      type="radio"
                      checked={operatorSelected === operator.id}
                      id={operator.id}
                      value={operator}
                    />
                    <label htmlFor={operator.id}>{operator.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="App-tokens">
              Products
              <div className="App-token">
                {products.map((product) => (
                  <div key={product.id}>
                    <input
                      onChange={() => onProductChange(product.id)}
                      name="product"
                      type="radio"
                      checked={productSelected === product.id}
                      id={product.id}
                      value={product.id}
                    />
                    <label htmlFor={product.id}>{product.product}</label>
                  </div>
                ))}
              </div>
            </div>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="value"
            />
            <button onClick={onSubmit}>send</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
