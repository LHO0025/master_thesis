import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from 'react';
import Player from './components/Player';
import RadioSidebar from "./components/RadioSidebar";
import Settings from "./components/Settings";
import StationsDisplay from './components/StationsDisplay';
import './index.css';
import * as RadioService from "./services/radio_service";


// TODO mozna pridat periodicky check jestli je current stanice porad mezi dostopnumi
function App() {
  const [devicesInformation, setDevicesInformation] = useState([])
  const [error, setError] = useState(null)
  const [currentStation, setCurrentStation] = useState(null)
  const [multiplexes, setMultiplexes] = useState([])
  const [tabValue, setTabValue] = useState("stations")

  useEffect(() => {
    let services = devicesInformation.map(device => extractServices(device)).flat()
    setMultiplexes(services)


    // console.log("Devices information", devicesInformation)
  }, [devicesInformation])


  useEffect(() => {
    const fetchData = () => {
      RadioService.fetchStationInfo()
        .then(res => res.json())
        .then(response => {
          // TODO udelat at funguje na vsechny arraye
          setDevicesInformation(response.devices)
        })
        .catch((error) => {
          console.log(error)
          setError(error)
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  function extractServices(device) {
    let stations = device.services.map(service => {
      return {
        labels: service.label,
        url_mp3: service.url_mp3,
        sid: service.sid,
        bitrate: service.components[0].subchannel.bitrate,
        language: service.components[0].subchannel.languagestring,
        pty: service.ptystring,
        station_text: service.dls.label,
      }
    })

    return {
      label: device.ensemble.label.label,
      channel: device.tunedChannel,
      stations: stations,
      port: device.port
    }
  }

  return (
    <>
      {
        error ?
          <div>
            <span>There was an error</span>
          </div>
          :
          <div className="p-4 w-full h-full relative">



            <SidebarProvider style={{
              "--sidebar-width": "20rem",
              "--sidebar-width-mobile": "20rem",
            }}>

              <RadioSidebar multiplexes={multiplexes} setCurrentStation={setCurrentStation} />
              <main>
                <Tabs defaultValue="stations" onValueChange={setTabValue}>
                  <TabsList className="absolute top-4 left-[50%] translate-x-[-50%]">
                    <TabsTrigger value="stations">Stations</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent className="w-full h-full" value="stations">
                    <SidebarTrigger />
                    {currentStation ?
                      <>
                        <StationsDisplay currentStation={currentStation}></StationsDisplay>
                        <Player currentStation={currentStation} multiplexes={multiplexes}></Player>
                      </>
                      :
                      <>
                      </>
                    }



                  </TabsContent>
                  <TabsContent value="settings">
                    <Settings devicesInformation={devicesInformation} setDevicesInformation={setDevicesInformation}></Settings>
                  </TabsContent>

                </Tabs>

              </main>

            </SidebarProvider>





          </div>
      }
    </>
  );
}

export default App;
