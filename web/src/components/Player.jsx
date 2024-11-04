import React, { useEffect, useRef, useState } from 'react'
import { Slider } from "@/components/ui/slider"
import * as RadioService from "../services/radio_service"
import { useAudioPlayer } from 'react-use-audio-player';
import { Badge } from "@/components/ui/badge"
import { RadioTower } from 'lucide-react';

const LIVE_AUDIO_OFFFSET = 240000

const SAMPLE_RATE = 48000;
const Player = () => {
  const [bufferSize, setBufferSize] = useState(86400000)
  const [streamURL, setStreamURL] = useState("http://localhost:7979/cache_mp3/0x3802/" + LIVE_AUDIO_OFFFSET)
  const [currentIndex, setCurrentIndex] = useState(LIVE_AUDIO_OFFFSET)
  const audioRef = useRef(null);

  // useEffect(() => {
  //   if (!window.MediaSource) {
  //     console.error('MediaSource API is not supported in this browser.');
  //     return;
  //   }

  //   const audio = audioRef.current;
  //   const mediaSource = new MediaSource();

  //   audio.src = URL.createObjectURL(mediaSource);

  //   mediaSource.addEventListener('sourceopen', async () => {
  //     const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

  //     async function fetchAudioChunks() {
  //       const response = await fetch(streamURL);
  //       const reader = response.body.getReader();

  //       while (true) {
  //         const { done, value } = await reader.read();
  //         if (done) break;
  //         sourceBuffer.appendBuffer(value);
  //         await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));
  //       }
  //     }

  //     fetchAudioChunks().catch(error => console.error('Error streaming audio:', error));
  //   });
  // }, [streamURL]);

  useEffect(() => {
    RadioService.fetchBufferSize("0x3802")
      .then(res => res.json())
      .then(res => {
        setBufferSize(res.bufferSize)
        setPlaybackValue(getPlaybackTimeInMs(res.bufferSize))
        console.log(res.bufferSize)
        console.log(getPlaybackTimeInMs(res.bufferSize))
      })
      .catch(e => {
        console.log("error", e)
      })
  }, [])

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
    setStreamURL("http://localhost:7979/cache_mp3/0x3802/" + newIndex)
  }

  function playLive() {
    setStreamURL("http://localhost:7979/mp3/0x3802/" + LIVE_AUDIO_OFFFSET)
  }

  return (
    <div>
      <audio ref={audioRef} src={streamURL} controls autoPlay />;
      {
        formatTime(playbackValue)
      }
      <Slider max={getPlaybackTimeInMs(bufferSize)} value={[playbackValue]} onValueChange={setPlaybackValue} onValueCommit={onValueCommit} step={1000} />
      {currentIndex == LIVE_AUDIO_OFFFSET && <Badge variant="destructive" className="gap-2"><RadioTower size={16}></RadioTower>Live</Badge>}
    </div>
  )
}

export default Player