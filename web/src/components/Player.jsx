import React, { useEffect, useRef, useState } from 'react'
import { Slider } from "@/components/ui/slider"
import * as RadioService from "../services/radio_service"
import { Badge } from "@/components/ui/badge"
import { RadioTower } from 'lucide-react';
import { Button } from './ui/button';

const LIVE_AUDIO_OFFFSET = 240000

const SAMPLE_RATE = 48000;
const Player = ({ currentStation }) => {
  const [bufferSize, setBufferSize] = useState(86400000)
  const [streamURL, setStreamURL] = useState("")
  const [currentIndex, setCurrentIndex] = useState(LIVE_AUDIO_OFFFSET)
  const audioRef = useRef(null);



  useEffect(() => {
    RadioService.fetchBufferSize(currentStation.sid)
      .then(res => res.json())
      .then(res => {
        setBufferSize(res.bufferSize)
        setPlaybackValue(getPlaybackTimeInMs(res.bufferSize))
      })
      .catch(e => {
        console.log("error", e)
      })

    setStreamURL("http://localhost:7979/cache_mp3/" + currentStation.sid + "/" + LIVE_AUDIO_OFFFSET)
  }, [currentStation])

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
    setStreamURL("http://localhost:7979/cache_mp3/" + currentStation.sid + "/" + newIndex)
  }

  function mute() {
    audioRef.current.muted = true
  }

  function playLive() {
    setStreamURL("http://localhost:7979/mp3/" + currentStation.sid + "/" + LIVE_AUDIO_OFFFSET)
  }

  return (
    <div className='flex flex-col gap-8 mt-8 items-start' >
      <audio ref={audioRef} src={streamURL} className='hidden' controls autoPlay />
      <Button onClick={mute}>Mute</Button>
      {
        'Playback: -' + formatTime(playbackValue)
      }
      <Slider max={getPlaybackTimeInMs(bufferSize)} value={[playbackValue]} onValueChange={setPlaybackValue} onValueCommit={onValueCommit} step={1000} />
      {currentIndex == LIVE_AUDIO_OFFFSET && <Badge variant="destructive" className="gap-2"><RadioTower size={16}></RadioTower>Live</Badge>}
    </div>
  )
}

export default Player