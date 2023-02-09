import { useEffect, useState } from 'react'
import { BlindboxMarker, ContractMetaData, BlindboxNFTMetaData } from '../../service/markerData'
import useWallet from '../../hooks/useWallet'
import { BigNumber, ethers } from 'ethers'
import { transformIpfsToPinataUrl, getOpenseaTestnetUrl } from '../../utils'

type Status = 'init' | 'loading' | 'processing' | 'idle' | 'success' | 'error'

const Blindbox = ({ blindboxMarker }: { blindboxMarker: BlindboxMarker }) => {
  const [status, setStatus] = useState<Status>('processing')
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [contractMeta, setContractMeta] = useState<ContractMetaData | null>(null);
  const [isSaleActive, setIsSaleActive] = useState<boolean>(false);
  const [isReveal, setIsReveal] = useState<boolean>(false);
  const [remaining, setRemaining] = useState<number>(0);
  const [mintPrice, setMintPrice] = useState<string>('');
  const [nftMeta, setNftMeta] = useState<BlindboxNFTMetaData | null>(null);
  const [tokenId, setTokenId] = useState<string>('');
  const {
    account,
    balance,
    signer,
    error,
  } = useWallet()

  useEffect(() => {
    if (signer) {
      setStatus('loading')
      fetchContract(signer);
    } else {
      setStatus('init')
    }
  }, [blindboxMarker, signer])

  const fetchContract = async (signer: ethers.Signer) => {
    try {
      const contractJson = await fetch(blindboxMarker.contractAbiUrl).then((res) =>
        res.json()
      );
      const contract = new ethers.Contract(
        blindboxMarker.address,
        contractJson.abi,
        signer
      );
      setContract(contract);
      getContractInfo(contract);
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  };

  const getContractInfo = async (contract: ethers.Contract) => {
    try {
      const MAX_SUPPLY = await contract.MAX_SUPPLY();
      const totalSupply = await contract.totalSupply();
      setRemaining(MAX_SUPPLY.sub(totalSupply).toNumber());
      const mintPrice = await contract.mintPrice();
      setMintPrice(ethers.utils.formatEther(mintPrice));
      const isSaleActive = await contract._isSaleActive();
      setIsSaleActive(isSaleActive);
      const isReveal = await contract._revealed();
      setIsReveal(isReveal);
      const contractURI = await contract.contractURI();
      const response = await fetch(transformIpfsToPinataUrl(contractURI))
      const contractMetaData: ContractMetaData = await response.json()
      setContractMeta(contractMetaData)
      setStatus('idle')
    } catch (error) {
      console.log(error)
      setStatus('error')
    }
  };

  const mintNFT = async () => {
    try {
      if (account && balance && signer && contract) {
        if (balance <= mintPrice) {
          throw {
            code: 4001,
            message: 'Balance not enough',
          }
        }
        setStatus('processing')
        const result = await contract.mintNFT(1, {
          value: ethers.utils.parseEther(mintPrice),
        });
        const response = await result.wait()
        const tokenId = response.events[0].args.tokenId as BigNumber
        setTokenId(tokenId.toString())
        getNFTInfo(tokenId)
      } else {
        throw new Error('No account or balance or signer or contract')
      }
    } catch (error) {
      if ((error as EthersError).code === 4001) {
        setStatus('idle')
        alert((error as EthersError).message)
      } else {
        setStatus('error')
      }
      console.log(error)
    }
  }

  const getNFTInfo = async (tokenId: BigNumber) => {
    try {
      if (account && balance && signer && contract) {
        const nftInfoUri = await contract.tokenURI(tokenId)
        const response = await fetch(transformIpfsToPinataUrl(nftInfoUri))
        const nftMeta: BlindboxNFTMetaData = await response.json()
        setNftMeta(nftMeta)
        setStatus('success')
      } else {
        throw new Error('No account or balance or signer or contract')
      }
    } catch (error) {
      setStatus('error')
      console.log(error)
    }
  }

  return (
    <>
      {
        status === 'init' && (
          <h1><i className="icon-notification"></i> No wallet connected or wrong marker data</h1>
        )
      }
      {
        status === 'loading' && (
          <div className="py-16">
            <i className="icon-spinner9 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl animate-spin z-10 text-[#ffce2e]"></i>
          </div>
        )
      }
      {
        status === 'idle' && (
          // <Card />
          <div className="w-full h-full text-center">
            <div className="max-w-[320px] w-4/5 m-auto">
              <img
                src={isSaleActive ? transformIpfsToPinataUrl(contractMeta?.image) : '/not-ready-for-sale.jpeg'}
                alt="" 
                className="w-ful rounded-2xl shadow-lg shadow-slate-300"
              />
            </div>
            <h1 className="text-center text-2xl font-bold my-8">{contractMeta?.name}</h1>
            <p className="my-4 text-left text-gray-500">{contractMeta?.description}</p>
            <div className="flex justify-center items-center my-6">
              <span className="px-4 md:px-12">
                <span className="text-2xl">{remaining}</span><br />
                <span className="text-gray-500 text-lg">QTY</span>
              </span>
              <span className="px-4 md:px-12">
                <span className="text-2xl flex items-center">
                  <img className="w-4 inline-block mr-2" src="/icon/eth-diamond-black.webp" alt="eth" />
                  {mintPrice}
                </span>
                <span className="text-gray-500 text-lg">Price</span>
              </span>
            </div>
            {isSaleActive && <button
              onClick={mintNFT}
              className="bg-[#ffce2e] hover:bg-[#ffa726] text-xl text-white font-bold py-2 px-20 rounded-full shadow-md shadow-slate-300"
            >
              Mint!
            </button>}
          </div>
        )
      }
      {
        status === 'processing' && (
          <div className="py-16 text-center">
            <p className="text-lg my-4">Transaction in progress, please wait a while</p>
            <i className="icon-spinner9 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl animate-spin z-10 text-[#ffce2e]"></i>
          </div>
        )
      }
      {
        status === 'success' && (
          <div className="w-full h-full">
            <p className="text-lg">You mint a NFT from {contractMeta?.name}!</p>
            <h1 className="text-center text-2xl font-bold my-8">{nftMeta?.name}</h1>
            <div className="max-w-[320px] w-4/5 m-auto">
              <img
                src={transformIpfsToPinataUrl(nftMeta?.image)}
                alt="" 
                className="w-ful rounded-2xl shadow-lg shadow-slate-300 animate__animated animate__flipInY select-none"
              />
            </div>
            <div className="flex justify-end">
              {account && <a href={getOpenseaTestnetUrl(account)} target="_blank" rel="noreferrer noopener" className="w-12 h-12 p-4 flex justify-center items-center rounded-full shadow-md shadow-slate-300 ml-4">
                <i className="icon-home3 text-2xl"></i>
              </a>}
              {contract && nftMeta && <a href={getOpenseaTestnetUrl(contract.address, tokenId)} target="_blank" rel="noreferrer noopener" className="w-12 h-12 p-4 flex justify-center items-center rounded-full shadow-md shadow-slate-300 ml-4">
                <i className="icon-image text-2xl"></i>
              </a>}
            </div>
            <p className="my-4 text-gray-500">{nftMeta?.description}</p>
          </div>
        )
      }
      {
        status === 'error' && (
          <div>Error</div>
        )
      }
    </>
  )
}

export default Blindbox;