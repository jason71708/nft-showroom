import { useState, useEffect, useCallback, useRef } from 'react'
import usePanorama from '../../hooks/usePanorama'

const Panorama = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const { markerId, setMarkerId } = usePanorama(canvas)

  console.log('Panorama render')

  return (
    <div id="container" className="w-screen h-screen">
      <canvas ref={setCanvas} className="absolute inset-0 cursor-grab"></canvas>
    </div>
  )
}

export default Panorama