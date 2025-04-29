import { API, BASE_URL } from "@/api"
import { fetchAvailableTime, fetchBufferedDls, setBufferedImageUrl } from "@/state/selectedStationSlice"
import { useAppDispatch, useAppSelector } from "@/state/store"
import { Disc, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Slider } from "./ui/slider"

// /cache_mp3/7980/0x2fb5/240000

const DEFAULT_LIVE_OFFSET_MS = 5_000
const STATION_DATA_POLLING_RATE = 5000

const Player = () => {
    const intervalId = useRef<any>(null)
    const { station: selectedStation, availablePlaybackTimeMs, currentDls, bufferedImageUrl } = useAppSelector((state) => state.selectedStationSlice)
    const dispatch = useAppDispatch()

    const [liveAudioOffsetMs, setLiveAudioOffsetMs] = useState<number>(DEFAULT_LIVE_OFFSET_MS)

    const audioElementRef = useRef<HTMLAudioElement | null>(null)
    const [audioSrc, setAudioSrc] = useState("")

    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(10)
    const [playbackTime, setPlaybackTime] = useState(0)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        if (selectedStation) {
            dispatch(fetchAvailableTime({ sid: selectedStation.sid, port: selectedStation.port }))
        }
        setIsLiveAudio(true)
        setLiveAudioOffsetMs(DEFAULT_LIVE_OFFSET_MS)
    }, [selectedStation])


    useEffect(() => {
        if (selectedStation) {
            dispatch(fetchBufferedDls({ sid: selectedStation.sid, port: selectedStation.port, time: Math.round((Date.now() - liveAudioOffsetMs) / 1000) }))
            dispatch(setBufferedImageUrl(API.getBufferedSlideUrl(selectedStation.sid, selectedStation.port, Math.round((Date.now() - liveAudioOffsetMs) / 1000))))
        }

        intervalId.current = setInterval(() => {
            if (selectedStation) {
                dispatch(setBufferedImageUrl(API.getBufferedSlideUrl(selectedStation.sid, selectedStation.port, Math.round((Date.now() - liveAudioOffsetMs) / 1000))))
                dispatch(fetchBufferedDls({ sid: selectedStation.sid, port: selectedStation.port, time: Math.round(Date.now() / 1000) }))
            }
        }, 5_000)

        return () => {
            clearInterval(intervalId.current)
        }
    }, [selectedStation, liveAudioOffsetMs])

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

    // useEffect(() => {
    //     if (selectedStation) {


    //         let time = (Date.now() / 1000) - Math.floor((liveAudioOffset / 48000))
    //         dispatch(fetchStationText({ sid: selectedStation.sid, port: "7980", time: time.toString() }))
    //     }

    //     return () => {

    //     }
    // }, [liveAudioOffset])


    function handleChangePlaybackTimeCommited(timeSeconds: number) {
        setLiveAudioOffsetMs(timeSeconds * 1000)
    }

    function handleChangeIsLive(value: boolean) {
        setIsLiveAudio(value)
        if (value) {
            setLiveAudioOffsetMs(DEFAULT_LIVE_OFFSET_MS)
        }
    }


    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [blob, setBlob] = useState<Blob | null>(null)
    const [recordingTime, setRecordingTime] = useState(0)

    useEffect(() => {
        let interval: any;
        if (isRecording) {
            setRecordingTime(0); // Reset time when starting
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);


    // useEffect(() => {
    //     if (!isLiveAudio) {
    //         handleChangePlaybackTimeCommited(playbackTime)
    //     }
    // }, [isLiveAudio, playbackTime])


    const startRecording = async () => {
        if (!audioElementRef.current) return;

        try {
            setIsRecording(true)
            const stream = audioElementRef.current.captureStream();
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                setBlob(blob)
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;

        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const downloadRecording = () => {
        if (blob) {
            console.log("audioBlob.current", blob)
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "recorded_audio.webm";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const formatRecordingTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };


    return (
        <div className="w-xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden relative pointer-events-auto">
            {
                selectedStation &&
                <audio id="my-audio" crossOrigin="anonymous" ref={audioElementRef} src={`${BASE_URL}/buffered_audio?sid=${selectedStation?.sid}&port=${selectedStation?.port}&offsetMs=${liveAudioOffsetMs}`} autoPlay>
                </audio>
            }

            <AspectRatio ratio={3 / 2} >

                <img
                    onError={() => dispatch(setBufferedImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"))}
                    src={bufferedImageUrl ? bufferedImageUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"}
                    className="h-full w-full rounded-md object-cover z-50"
                />

            </AspectRatio>

            <div className="p-5 space-y-4">
                <div>
                    <p className="text-xl font-bold">{currentDls}</p>
                    <p className="text-muted-foreground truncate">{selectedStation?.name}</p>
                </div>

                <div className="gap-2 items-center hidden lg:flex">
                    {
                        isRecording
                            ?
                            <Button variant="outline" size="sm" onClick={stopRecording}>Stop Recording</Button>
                            :
                            <Button variant="outline" size="sm" onClick={startRecording}>Start Recording</Button>
                    }

                    <span>{formatTime(recordingTime)}</span>
                    {
                        isRecording && <Disc className="w-4 h-4 text-red-300" />
                    }
                    {
                        blob &&
                        <Button className="ml-auto" onClick={downloadRecording}>Download</Button>
                    }
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox checked={isLiveAudio} onCheckedChange={(checked) => handleChangeIsLive(checked === true)} />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Live Audio
                            </label>
                        </div>

                        <Button onClick={() => {
                            if (selectedStation) {
                                dispatch(fetchAvailableTime({ sid: selectedStation.sid, port: selectedStation.port }))
                            }
                        }} variant="outline" size="icon" className="rounded-full h-8 w-8">
                            <RotateCcw />
                        </Button>
                    </div>

                    {
                        !isLiveAudio &&
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{formatTime(playbackTime)}/{formatTime(availablePlaybackTimeMs / 1000)}</span>
                            </div>
                            <Slider
                                value={[playbackTime]}
                                onValueChange={(value) => setPlaybackTime(value[0])}
                                onValueCommit={(value) => handleChangePlaybackTimeCommited(value[0])}
                                min={0}
                                max={Math.floor(availablePlaybackTimeMs / 1000)}
                                step={1}
                                className="cursor-pointer"
                            />
                        </>
                    }
                </div>

                <div className="flex items-center justify-between">
                    {/* <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button> */}

                    <div className="items-center space-x-2 w-3/4 lg:w-1/2 hidden lg:flex">
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