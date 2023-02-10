import useWallet from '../../hooks/useWallet'

const Wallet = ({onClick}: {onClick: () => void}) => {
  const {
    provider,
    account,
    balance,
    error,
    connectWallect,
  } = useWallet()

  const onWalletClicked = () => {
    onClick()
    if (account) {
      alert(`Your account is ${account} and your balance is ${balance}`)
    } else {
      connectWallect();
    }
  }

  return (
    <div
      onClick={onWalletClicked}
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full cursor-pointer animate-flip select-none ${
        account ? "" : "grayscale"
      }`}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/217/217853.png"
        alt="icon-icon"
        className="rounded-full w-full h-full"
      />
    </div>
  );
}

export default Wallet