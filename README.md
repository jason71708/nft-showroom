# 🏞 NFT Showroom

👇 Click to view the desktop demo 📹
[![Desktop preview](https://img.youtube.com/vi/MtAtOeCSGJs/hqdefault.jpg)](https://youtu.be/MtAtOeCSGJs)
👇 Click to view the mobile demo 📹
[![Mobile preview](https://img.youtube.com/vi/mhgSpXLV-_E/hqdefault.jpg)](https://youtu.be/mhgSpXLV-_E)

## 📖 Requirements

- Node.js v14.18.2 or higher

## 🛠 Install
```
yarn
```

## 🌟 Feature

- Virtual showroom for displaying NFTs.
- Mint NFTs in showroom.
- Mobile friendly. (But need to open in MetaMask App browser.)
- Use Rinkeby testnet. (If for production, need to change to mainnet.)

## 🖊 Usage

1. Change `VITE_PRODUCTION_URL` value to yours in `.env` file.
2. Change `blindboxMarkers` value to yours in `src/service/markerData` file, include `address`, `contractAbiUrl` and `image`.
3. Accourding to the `blindboxMarkers` value, you need to replace images and contracts file in `public/` folder.
