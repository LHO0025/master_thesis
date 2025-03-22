import { useEffect } from 'react'
import ModeToggle from './components/ModeToggle'
import Player from './components/Player'
import { ThemeProvider } from './components/ui/theme-provider'
import './index.css'
import { fetchStationsInfo } from './state/devicesSlice'
import { useAppDispatch } from './state/store'
import StationsList from './components/StationsList'

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchStationsInfo())
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='w-full h-full flex justify-start items-start'>
        <ModeToggle />
        <StationsList />
        <div className='w-full h-full flex items-center justify-center'>
          <Player />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App