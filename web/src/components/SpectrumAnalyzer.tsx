import { API } from "@/api"
import { useEffect, useRef } from "react"

const SpectrumAnalyzer = ({ port, index, channel }: { port: string, index: number, channel: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const spectrumDataRef = useRef<number[]>([])
    const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        const width = rect.width
        const height = rect.height

        const draw = () => {
            ctx.clearRect(0, 0, width, height)

            const data = spectrumDataRef.current
            if (data.length === 0) {
                requestAnimationFrame(draw)
                return
            }

            const barWidth = width / data.length
            const factor = Math.max(1, Math.floor(data.length / 2048))
            const maxValue = Math.max(...data) || 1

            const gradient = ctx.createLinearGradient(0, height, 0, 0)
            gradient.addColorStop(0, "rgba(124, 58, 237, 0.5)")
            gradient.addColorStop(0.5, "rgba(236, 72, 153, 0.7)")
            gradient.addColorStop(1, "rgba(239, 68, 68, 0.9)")
            ctx.fillStyle = gradient

            ctx.beginPath()
            ctx.moveTo(0, height)

            for (let i = 0; i < data.length; i++) {
                const normalized = data[i] / maxValue
                const x = (i / factor) * barWidth
                const barHeight = normalized * height
                const y = height - barHeight
                ctx.lineTo(x, y)
            }

            ctx.lineTo(width, height)
            ctx.closePath()
            ctx.fill()

            requestAnimationFrame(draw)
        }

        requestAnimationFrame(draw)

        fetchIntervalRef.current = setInterval(() => {
            API.fetchSpectrum(port)
                .then((res) => res.arrayBuffer())
                .then((buffer) => {
                    const newArray = Array.from(new Float32Array(buffer))
                    spectrumDataRef.current = newArray
                })
                .catch((err) =>
                    console.error("Error fetching FFT data:", err)
                )
        }, 200)

        return () => {
            if (fetchIntervalRef.current) {
                clearInterval(fetchIntervalRef.current)
            }
        }
    }, [])

    return (
        <>
            <span>Device {index} ({channel})</span>
            <div className="h-[300px] w-full relative border border-border rounded-xl overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </>
    )
}

export default SpectrumAnalyzer
