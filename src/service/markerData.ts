/*
 For production, you should get marker data from the server.
*/

import { randomString } from "../utils";

export type BlindboxMarker = {
  id: string;
  type: "blindbox";
  address: string;
  contractAbiUrl: string;
  image: string;
};

export const blindboxMarkers: BlindboxMarker[] = [
  {
    // Change to yours address, contractAbiUrl & image
    // Those files also need to be replace to yours.
    id: randomString(),
    type: "blindbox",
    address: "0x9a23512f7aAA2EE7A938c1223aCbC028c5653A00",
    contractAbiUrl: "/contracts/CutieSquidsNFT.json",
    image: "/blindMarker/unpack.png",
  },
];

export const markers = [...blindboxMarkers];

export type ContractMetaData = {
  name: string;
  description: string;
  image: string;
  external_link: string
  seller_fee_basis_points: number;
  fee_recipient: string;
};

export type BlindboxNFTMetaData = {
  name: string;
  description: string;
  image: string;
}