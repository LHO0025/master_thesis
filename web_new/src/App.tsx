import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef } from 'react'
import AudioVisualizer from "./components/AudioVisualizer"
import ModeToggle from './components/ModeToggle'
import Player from './components/Player'
import Settings from "./components/Settings"
import SpectrumAnalyzer from "./components/SpectrumAnalyzer"
import StationsList from './components/StationsList'
import { Toaster } from "./components/ui/sonner"
import { ThemeProvider } from './components/ui/theme-provider'
import './index.css'
import { fetchStationsInfo } from './state/devicesSlice'
import { useAppDispatch } from './state/store'


function App() {
  const intervalId = useRef<any>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log(apiUrl);

    dispatch(fetchStationsInfo())

    intervalId.current = setInterval(() => {
      dispatch(fetchStationsInfo())
    }, 5_000)


    return () => {
      clearInterval(intervalId.current)
    }


  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-center" />

      <Tabs defaultValue="stations" className="w-full h-full z-[999]">
        <TabsList className="m-auto left-0 right-0 top-6 absolute">
          <TabsTrigger value="stations">Stations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="spectrum">Spectrum</TabsTrigger>
        </TabsList>
        <TabsContent value="stations" >
          <div className='w-full h-full flex justify-start items-start'>
            <ModeToggle />
            <StationsList />
            <div className='w-full h-full flex items-center justify-center p-4 relative pointer-events-none'>
              <Player />
              <AudioVisualizer />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>

        <TabsContent value="spectrum">
          <div className="absolute w-3/4 h-fit top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <SpectrumAnalyzer />
          </div>
        </TabsContent>
      </Tabs>

      {/* <AudioVisualizer></AudioVisualizer> */}
      {/* <SpectrumAnalyzer /> */}
    </ThemeProvider>
  )
}

export default App