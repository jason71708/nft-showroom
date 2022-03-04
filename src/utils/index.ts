export const randomString = () => Math.random().toString(36).substring(7);

export const transformIpfsToPinataUrl = (
  ipfsUri: string | undefined
): string => {
  if (!ipfsUri) return "";
  // return `https://gateway.pinata.cloud/ipfs/${ipfsUri.replace("ipfs://", "")}`;
  /* Because of Pinata's IPFS gateway has limitations, so I use local file path instead. */
  return `/ipfs/${ipfsUri.split("/").pop()}`;
};

export const getOpenseaTestnetUrl = (
  walletOrContractAddress: string,
  nftId?: string
): string => {
  const openseaTestnetUrl = 'https://testnets.opensea.io'
  if (nftId) {
    return `${openseaTestnetUrl}/assets/${walletOrContractAddress}/${nftId}`;
  } else {
    return `${openseaTestnetUrl}/${walletOrContractAddress}`;
  }
};
