/*
 For production, you should get marker data from the server.
*/

import { randomString } from "../utils";

export type BlindboxMarker = {
  id: string;
  type: "blindbox";
  address: string;
  image: string;
};

export const blindboxMarkers: BlindboxMarker[] = [
  {
    id: randomString(),
    type: "blindbox",
    address: "0xe7e1569f7904e4426e8f2bcd83ed93dbee573942",
    image: "/unpack.png",
  }
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