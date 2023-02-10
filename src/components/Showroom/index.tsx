import ShowroomService from '../../lib/showroomService'
import panoramaImage from "../../assets/showroom.jpeg";
import { blindboxMarkers, BlindboxMarker } from "../../service/markerData";
import { useRef } from 'react';

const Showroom = ({
  setCurrentMarker,
}: {
  setCurrentMarker: (
    value: React.SetStateAction<BlindboxMarker | null>
  ) => void;
}) => {
  const hasInit = useRef(false);

  const initShowroom = (canvas: HTMLCanvasElement) => {
    if (hasInit.current) return
    const showroomService = new ShowroomService(
      canvas,
      panoramaImage,
      blindboxMarkers,
      marker => {
        setCurrentMarker(marker);
      }
    );
    hasInit.current = true
  };

  return (
    <div className="w-screen h-screen">
      <canvas
        ref={initShowroom}
        className="absolute inset-0 cursor-grab"
      ></canvas>
    </div>
  );
};

export default Showroom