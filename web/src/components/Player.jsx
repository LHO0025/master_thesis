import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { RadioTower } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as RadioService from "../services/radio_service";
import { Button } from './ui/button';

const LIVE_AUDIO_OFFFSET = 240000
const SAMPLE_RATE = 48000;
const SERVER_URL = import.meta.env.VITE_SERVER_URL

const Player = ({ currentStation, multiplexes }) => {
  const [streamURL, setStreamURL] = useState("")
  const [bufferSize, setBufferSize] = useState(86400000)

  const [currentStationSid, setCurrentStationSid] = useState("")
  const [currentStationPort, setCurrentStationPort] = useState(0)

  useEffect(() => {
    let multiplex = multiplexes.find(multiplex =>
      multiplex.stations.some(station => station.sid == currentStation.sid)
    )
    if (multiplex) {
      setCurrentStationSid(currentStation.sid)
      setCurrentStationPort(multiplex.port)
    }
  }, [multiplexes, currentStation.sid])

  useEffect(() => {
    if (!currentStationSid || !currentStationPort) { return }
    console.log("qqqqqqqq")
    RadioService.fetchBufferSize(currentStationSid, currentStationPort)
      .then(res => res.json())
      .then(res => {
        // console.log("buffer", res)
        setBufferSize(res.bufferSize)
        setPlaybackValue(getPlaybackTimeInMs(res.bufferSize))
        setStreamURL(SERVER_URL + "/cache_mp3/" + currentStationPort + "/" + currentStation.sid + "/" + LIVE_AUDIO_OFFFSET)
      })
      .catch(e => {
        console.log("error", e)
      })
  }, [currentStationSid, currentStationPort])




  // useEffect(() => {
  //   RadioService.fetchBufferSize(currentStation.sid)
  //     .then(res => res.json())
  //     .then(res => {
  //       console.log("buffer", res)
  //       // setBufferSize(res.bufferSize)
  //       // setPlaybackValue(getPlaybackTimeInMs(res.bufferSize))
  //     })
  //     .catch(e => {
  //       console.log("error", e)
  //     })
  // }, [currentStation])



  const [currentIndex, setCurrentIndex] = useState(LIVE_AUDIO_OFFFSET)
  const audioRef = useRef(null);
  const [slideshowSrc, setSlideshowSrc] = useState("")


  // useEffect(() => {
  //   RadioService.fetchBufferSize(currentStation.sid)
  //     .then(res => res.json())
  //     .then(res => {
  //       setBufferSize(res.bufferSize)
  //       setPlaybackValue(getPlaybackTimeInMs(res.bufferSize))
  //     })
  //     .catch(e => {
  //       console.log("error", e)
  //     })

  //   setStreamURL("http://localhost:7979/cache_mp3/" + currentStation.sid + "/" + LIVE_AUDIO_OFFFSET)


  //   const fetchImage = async () => {
  //     try {
  //       const response = await RadioService.fetchSlideshow(currentStation.sid);

  //       if (!response.ok) {
  //         throw new Error();
  //       }

  //       const blob = await response.blob();
  //       const newImageSrc = URL.createObjectURL(blob);
  //       setSlideshowSrc(newImageSrc)
  //     } catch (error) {
  //       setSlideshowSrc("")
  //     }
  //   };

  //   const interval = setInterval(() => {
  //     fetchImage();
  //   }, 10_000);

  //   return () => clearInterval(interval);
  // }, [currentStation])

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function getPlaybackTimeInMs(numberOfSamples) {
    return Math.floor((numberOfSamples / SAMPLE_RATE)) * 1000;
  }

  const [playbackValue, setPlaybackValue] = useState(0)

  function onValueCommit(value) {
    let newIndex = (((getPlaybackTimeInMs(bufferSize) - value) * SAMPLE_RATE) / 1000) + LIVE_AUDIO_OFFFSET
    setCurrentIndex(newIndex)
    setStreamURL(SERVER_URL + "/cache_mp3/" + currentStationPort + "/" + currentStation.sid + "/" + newIndex)
  }

  function toggleMute() {
    audioRef.current.muted = !audioRef.current.muted
  }

  function handleVolumeChange(value) {
    console.log(value)
    audioRef.current.volume = value
  }

  return (
    <div className='flex flex-col gap-8 mt-8 items-start'>
      {currentStation.station_text}


      <audio ref={audioRef} src={streamURL} className='hidden' controls autoPlay />

      <Button onClick={toggleMute}>Toggle mute</Button>
      {
        'Playback: -' + formatTime(playbackValue)
      }
      <Slider max={getPlaybackTimeInMs(bufferSize)} value={[playbackValue]} onValueChange={setPlaybackValue} onValueCommit={onValueCommit} step={1000} />
      <Slider onValueChange={handleVolumeChange} defaultValue={[0.5]} max={1} step={0.01} />

      {currentIndex == LIVE_AUDIO_OFFFSET && <Badge variant="destructive" className="gap-2"><RadioTower size={16}></RadioTower>Live</Badge>}

      {slideshowSrc && <img src={slideshowSrc} alt="Logo" />}
    </div>
  )
}

export default Player