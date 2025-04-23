import { useAppSelector } from "@/state/store"
import { useEffect, useRef } from "react"

const AudioVisualizer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { station: selectedStation } = useAppSelector((state) => state.selectedStationSlice)
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

    useEffect(() => {
        const audioElement = document.getElementById("my-audio") as HTMLAudioElement
        if (!audioElement) {
            console.error("Audio element not found")
            return
        }

        if (sourceRef.current) {
            return
        }

        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const source = audioCtx.createMediaElementSource(audioElement)
        sourceRef.current = source
        const analyser = audioCtx.createAnalyser()

        source.connect(analyser)
        analyser.connect(audioCtx.destination)

        analyser.fftSize = 2048 // Higher value for smoother waveform
        const bufferLength = analyser.fftSize
        const dataArray = new Uint8Array(bufferLength)

        const canvas = canvasRef.current!
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        const width = rect.width
        const height = rect.height

        const draw = () => {
            requestAnimationFrame(draw)

            analyser.getByteTimeDomainData(dataArray)

            ctx.clearRect(0, 0, width, height)

            ctx.lineWidth = 2
            ctx.strokeStyle = "#4ade80" // Light green, or choose your own color

            ctx.beginPath()
            const sliceWidth = width / bufferLength
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0 // Normalize to [0, 2]
                const y = (v * height) / 2

                if (i === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }

                x += sliceWidth
            }

            ctx.lineTo(width, height / 2)
            ctx.stroke()
        }

        draw()

        return () => {

        }
    }, [selectedStation])

    return (
        <div className="w-full h-1/2 absolute bg-none left-0 z-[-10] top-1/2 -translate-y-1/2">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    )
}

export default AudioVisualizer
