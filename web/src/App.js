import './index.css';
import { Button } from "@/components/ui/button"
import { useAudioPlayer } from 'react-use-audio-player';
import { mock_data } from './services/radio_service';
import StationsDisplay from './components/StationsDisplay';
import { useState } from 'react';

function App() {
  const [stationsInfo, setStationsInfo] = useState([mock_data])

  const { load } = useAudioPlayer();
  function playAudio() {
    load('http://localhost:7979/mp3/0x2f76', {
      autoplay: true,
      html5: true,
      format: 'mp3'
    });
  }


  return (
    <div className="p-4">
      <StationsDisplay stationsInfo={stationsInfo}></StationsDisplay>

    </div>
  );
}

export default App;
