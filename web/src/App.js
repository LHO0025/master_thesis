import './index.css';
import { Button } from "@/components/ui/button"
import { useAudioPlayer } from 'react-use-audio-player';
import { mock_data } from './services/radio_service';
import StationsDisplay from './components/StationsDisplay';
import { useEffect, useRef, useState } from 'react';
import Player from './components/Player';

function App() {
  const [stationsInfo, setStationsInfo] = useState([mock_data])

  return (
    <div className="p-4">

      <StationsDisplay stationsInfo={stationsInfo}></StationsDisplay>
      <Player></Player>


    </div>
  );
}

export default App;
