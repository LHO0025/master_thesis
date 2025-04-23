import { useEffect, useRef } from "react"

const SpectrumAnalyzer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const prevDataRef = useRef<number[]>([])
    const targetDataRef = useRef<number[]>([])
    const displayDataRef = useRef<number[]>([])
    const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const transitionStartRef = useRef<number>(0)
    const transitionDuration = 150 // ms

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

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t

        const draw = (time: number) => {
            ctx.clearRect(0, 0, width, height)

            const prev = prevDataRef.current
            const target = targetDataRef.current
            const display = displayDataRef.current

            if (target.length === 0) {
                requestAnimationFrame(draw)
                return
            }

            // Interpolate between prev and target
            const elapsed = time - transitionStartRef.current
            const t = Math.min(1, elapsed / transitionDuration)

            for (let i = 0; i < target.length; i++) {
                const a = prev[i] || 0
                const b = target[i]
                display[i] = lerp(a, b, t)
            }

            const barWidth = width / display.length
            const factor = Math.max(1, Math.floor(display.length / 2048))
            const maxValue = Math.max(...display) || 1

            const gradient = ctx.createLinearGradient(0, height, 0, 0)
            gradient.addColorStop(0, "rgba(124, 58, 237, 0.5)")
            gradient.addColorStop(0.5, "rgba(236, 72, 153, 0.7)")
            gradient.addColorStop(1, "rgba(239, 68, 68, 0.9)")
            ctx.fillStyle = gradient

            ctx.beginPath()
            ctx.moveTo(0, height)

            for (let i = 0; i < display.length; i++) {
                const normalized = display[i] / maxValue
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
            fetch("http://localhost:7980/spectrum")
                .then((res) => res.arrayBuffer())
                .then((buffer) => {
                    const newArray = Array.from(new Float32Array(buffer))

                    // Store current display as previous, new as target
                    prevDataRef.current = [...displayDataRef.current]
                    targetDataRef.current = newArray

                    // Fill initial display if empty
                    if (displayDataRef.current.length !== newArray.length) {
                        displayDataRef.current = [...newArray]
                        prevDataRef.current = [...newArray]
                    }

                    // Start transition
                    transitionStartRef.current = performance.now()
                })
                .catch((err) =>
                    console.error("Error fetching FFT data:", err)
                )
        }, 200) // ~6–7 fps, good for smoother visual transitions

        return () => {
            if (fetchIntervalRef.current) {
                clearInterval(fetchIntervalRef.current)
            }
        }
    }, [])

    return (
        <>
            <span>Device 1</span>
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
