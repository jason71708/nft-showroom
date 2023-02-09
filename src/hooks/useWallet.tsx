import { useState, createContext, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { isAndroid, isIOS } from "react-device-detect";
import Popup from "../components/Popup";

const productionUrl = import.meta.env.VITE_PRODUCTION_URL as string;

const useConnectWallet = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openHint, setOpenHint] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener('ethereum#initialized', handleEthereum, {
        once: true,
      });
      setTimeout(handleEthereum, 1000);
    }
    return () => {
      window.removeEventListener('ethereum#initialized', handleEthereum);
    }
  }, [])

  const handleEthereum = async () => {
    try {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }], // "0x5" is Goerli network
        });
        /* There is a error from Metamask app webview when request permission multiple times continuously. */
      } else {
        throw new Error("No Metamask detected");
      }
    } catch (error: any) {
      setError(error.message);
      alertNoWallect()
    }
  }

  const connectWallect = async () => {
    try {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        const [account] = await window.ethereum.enable();
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
        const signer = provider.getSigner();
        setSigner(signer);
      } else {
        throw new Error("No Metamask detected");
      }
    } catch (error: any) {
      setError(error.message);
      alertNoWallect()
    }
  }

  const alertNoWallect = () => {
    alert("Please connect to Metamask");
    setOpenHint(true)
  }

  return {
    provider,
    account,
    balance,
    signer,
    error,
    openHint,
    connectWallect,
    alertNoWallect,
    setOpenHint
  };
}

const walletContext = createContext<ReturnType<typeof useConnectWallet>>({
  provider: null,
  account: null,
  balance: null,
  signer: null,
  error: null,
  openHint: false,
  connectWallect: () => new Promise(() => {}),
  alertNoWallect: () => {},
  setOpenHint: () => {}
});

export const ProvideWallet = ({ children }: { children: React.ReactNode }) => {
  const walletStore = useConnectWallet();

  return (
    <walletContext.Provider value={walletStore}>
      {children}
      <Popup
        show={walletStore.openHint}
        onClose={() => walletStore.setOpenHint(false)}
      >
        <div className="p-0 md:p-8">
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={
              isAndroid || isIOS
                ? `https://metamask.app.link/dapp/${productionUrl}`
                : "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
            }
            className="underline text-blue-500"
          >
            {isAndroid || isIOS
              ? "For Moblie, please download MetaMask and open it's browser to visit this page."
              : "For Desktop, please install MetaMask extension and connect it."}
            <i className="icon-sphere text-blue-500"></i>
          </a>
        </div>
      </Popup>
    </walletContext.Provider>
  );
}

const useWallet = () => {
  return useContext(walletContext);
};

export default useWallet