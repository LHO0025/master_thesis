import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef } from 'react'
import ModeToggle from './components/ModeToggle'
import Player from './components/Player'
import Settings from "./components/Settings"
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

      <Tabs defaultValue="stations" className="w-full h-full">
        <TabsList className="m-auto left-0 right-0 top-6 absolute">
          <TabsTrigger value="stations">Stations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="stations" >
          <div className='w-full h-full flex justify-start items-start'>
            <ModeToggle />
            <StationsList />
            <div className='w-full h-full flex items-center justify-center'>
              <Player />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>

    </ThemeProvider>
  )
}

export default App