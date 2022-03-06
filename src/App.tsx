import { useCallback, useState } from 'react'
import Showroom from './components/Showroom'
import Popup from './components/Popup'
import WalletButton from './components/WalletButton'
import { BlindboxMarker } from "./service/markerData";
import { ProvideWallet } from "./hooks/useWallet";
import Blindbox from './components/Blindbox';

function App() {
  const [currentMarker, setCurrentMarker] = useState<BlindboxMarker | null>(null)

  const closePopup = useCallback(() => {
    setCurrentMarker(null)
  }, [])

  return (
    <ProvideWallet>
      <Showroom setCurrentMarker={setCurrentMarker} />
      {currentMarker && (
        <Popup show={!!currentMarker} onClose={closePopup}>
          <Blindbox blindboxMarker={currentMarker} />
        </Popup>
      )}
      <WalletButton />
    </ProvideWallet>
  );
}

export default App
