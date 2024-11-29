import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from 'react';
import * as RadioService from "services/radio_service";
import Player from './components/Player';
import StationsDisplay from './components/StationsDisplay';
import './index.css';

import RadioSidebar from './components/Test';

function App() {
  const [error, setError] = useState(null)
  const [currentStation, setCurrentStation] = useState(null)
  const [stations, setStations] = useState([])

  useEffect(() => {
    RadioService.fetchStationInfo()
      .then(res => res.json())
      .then(response => {
        setStations(extractServices(response.services))
      })
      .catch((error) => {
        setError(error)
      })
  }, [])


  function extractServices(array) {
    let result = array.map(service => {
      return {
        labels: service.label,
        url_mp3: service.url_mp3,
        sid: service.sid,
        bitrate: service.components[0].subchannel.bitrate,
        language: service.components[0].subchannel.languagestring,
        pty: service.ptystring,
      }
    })
    return result
  }

  return (
    <>
      {
        error ?
          <div>
            <span>There was an error</span>
          </div>
          :
          <div className="p-4">
            <SidebarProvider style={{
              "--sidebar-width": "20rem",
              "--sidebar-width-mobile": "20rem",
            }}>
              <RadioSidebar radioStations={stations} setCurrentStation={setCurrentStation} />
              <main>
                <SidebarTrigger />

                {currentStation &&
                  <>
                    <StationsDisplay currentStation={currentStation}></StationsDisplay>
                    <Player currentStation={currentStation}></Player>
                  </>
                }
              </main>
            </SidebarProvider>

          </div>
      }
    </>
  );
}

export default App;
