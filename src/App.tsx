import { useState } from 'react'
import Showroom from './components/Showroom'
import Popup from './components/Popup'
import PointerHint from './components/PointerHint'
import WalletButton from './components/WalletButton'
import { BlindboxMarker } from "./service/markerData";
import { ProvideWallet } from "./hooks/useWallet";
import Blindbox from './components/Blindbox';

function App() {
  const [currentMarker, setCurrentMarker] = useState<BlindboxMarker | null>(null)
  const [showHint, setShowHint] = useState(true)

  return (
    <ProvideWallet>
      <Showroom setCurrentMarker={setCurrentMarker} />
      {currentMarker && (
        <Popup show={!!currentMarker} onClose={() => setCurrentMarker(null)}>
          <Blindbox blindboxMarker={currentMarker} />
        </Popup>
      )}
      {showHint && <PointerHint />}
      <WalletButton onClick={() => setShowHint(false)} />
    </ProvideWallet>
  );
}

export default App
