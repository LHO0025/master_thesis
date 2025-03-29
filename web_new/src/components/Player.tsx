import { fetchBufferSize, fetchStationText } from "@/state/selectedStationSlice"
import { useAppDispatch, useAppSelector } from "@/state/store"
import { Utils } from "@/utils/utils"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Slider } from "./ui/slider"

// /cache_mp3/7980/0x2fb5/240000

const BASE_URL = "http://localhost:5000"
const DEFAULT_LIVE_OFFSET = 240000
const STATION_DATA_POLLING_RATE = 5000

const Player = () => {
    // TODO make sure check if the selected station is changing during refetch
    const { station: selectedStation, availablePlaybackTimeMs, currentText } = useAppSelector((state) => state.selectedStationSlice)
    const dispatch = useAppDispatch()

    const [liveAudioOffset, setLiveAudioOffset] = useState<number>(DEFAULT_LIVE_OFFSET)


    useEffect(() => {
        if (selectedStation) {
            setAudioSrc(BASE_URL + "/cache_mp3/7980/" + selectedStation.sid + "/" + liveAudioOffset)
        }
    }, [liveAudioOffset, selectedStation])


    useEffect(() => {
        if (selectedStation) {
            dispatch(fetchBufferSize({ sid: selectedStation.sid, port: "7980" }))
        }
    }, [selectedStation])


    const audioElementRef = useRef<HTMLAudioElement | null>(null)
    const [audioSrc, setAudioSrc] = useState("")

    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(10)
    const [playbackTime, setPlaybackTime] = useState(30)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {

    }, [liveAudioOffset])


    useEffect(() => {
        if (audioElementRef.current) {
            audioElementRef.current.volume = volume / 100
        }
    }, [volume])

    const station = {
        name: "Radio Waves FM",
        currentTrack: "Summer Vibes - DJ Sunshine",
        image: "/placeholder.svg?height=400&width=400",
        duration: 180, // in seconds
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
        // audioElementRef.current?.
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
        if (isMuted) {
            if (audioElementRef.current) {
                audioElementRef.current.volume = 0.75
            }
            setVolume(75)
        } else {
            setVolume(0)
            muteAudio()
        }
    }

    function muteAudio() {
        if (audioElementRef.current) {
            audioElementRef.current.volume = 0
        }
    }

    function handleVolumeChange(value: number[]) {
        setVolume(value[0])
        if (audioElementRef.current) {
            audioElementRef.current.volume = value[0] / 100
        }
    }

    const [isLiveAudio, setIsLiveAudio] = useState<boolean>(true)
    const radioDataInterval = useRef<any>(null)

    useEffect(() => {
        if (selectedStation) {
            radioDataInterval.current = setInterval(() => {
                let time = (Date.now() / 1000) - Math.floor((liveAudioOffset / 48000))
                dispatch(fetchStationText({ sid: selectedStation.sid, port: "7980", time: time.toString() }))
            }, STATION_DATA_POLLING_RATE)

            let time = (Date.now() / 1000) - Math.floor((liveAudioOffset / 48000))
            dispatch(fetchStationText({ sid: selectedStation.sid, port: "7980", time: time.toString() }))
        }

        return () => {
            clearInterval(radioDataInterval.current)
        }
    }, [liveAudioOffset])


    function handleChangePlaybackTimeCommited(timeSeconds: number) {
        setLiveAudioOffset(Utils.MsToSampleCount(48000, timeSeconds * 1000))
    }

    function handleChangeIsLive(value: boolean) {
        setIsLiveAudio(value)
        if (value) {
            setLiveAudioOffset(DEFAULT_LIVE_OFFSET)
        }
    }

    useEffect(() => {
        console.log(playbackTime)
    }, [playbackTime])


    //12600000
    //12576000000

    return (
        <div className="w-xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden ">
            {
                audioSrc &&
                <audio ref={audioElementRef} src={audioSrc} autoPlay>
                </audio>
            }

            <AspectRatio ratio={3 / 2} >
                <img
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                    alt="Photo by Drew Beamer"
                    className="h-full w-full rounded-md object-cover"
                />
            </AspectRatio>


            <div className="p-5 space-y-4">
                <div>
                    <h2 className="text-xl font-bold truncate">{currentText}</h2>
                    <p className="text-muted-foreground truncate">{selectedStation?.name}</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox checked={isLiveAudio} onCheckedChange={(checked) => handleChangeIsLive(checked === true)} />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Live Audio
                        </label>
                    </div>

                    {
                        !isLiveAudio &&
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{formatTime(playbackTime)}</span>
                            </div>
                            <Slider
                                value={[playbackTime]}
                                onValueChange={(value) => setPlaybackTime(value[0])}
                                onValueCommit={(value) => handleChangePlaybackTimeCommited(value[0])}
                                min={5}
                                max={availablePlaybackTimeMs / 1000}
                                step={1}
                                className="cursor-pointer"
                            />
                        </>
                    }
                </div>

                <div className="flex items-center justify-between">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>

                    <div className="flex items-center space-x-2 w-1/2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            onValueChange={handleVolumeChange}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Player