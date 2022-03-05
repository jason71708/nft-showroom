import { useCallback, useState } from 'react'
import Showroom from './components/Showroom'
import Popup from './components/Popup'
// import WalletButton from './components/WalletButton'
import { BlindboxMarker } from "./service/markerData";

function App() {
  const [currentMarker, setCurrentMarker] = useState<BlindboxMarker | null>(null)

  const closePopup = useCallback(() => {
    setCurrentMarker(null)
  }, [])

  console.log(currentMarker)

  return (
    <>
      <Showroom setCurrentMarker={setCurrentMarker} />
      {currentMarker && (
        <Popup show={!!currentMarker} onClose={closePopup}>
          {JSON.stringify(currentMarker)}
        </Popup>
      )}
      {/* <WalletButton /> */}
    </>
  );
}

export default App
