import { cn } from "@/lib/utils"
import { setSelectedStation } from "@/state/selectedStationSlice"
import { useAppDispatch, useAppSelector } from "@/state/store"
import { ListMusic, X } from "lucide-react"
import { useState } from "react"

const StationsList = () => {
  const availableDevices = useAppSelector((state) => state.devicesSlice.availableDevices)
  const selectedStation = useAppSelector((state) => state.selectedStationSlice.station)
  const dispatch = useAppDispatch()

  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <ListMusic className="text-muted-foreground cursor-pointer absolute left-6 top-8 lg:hidden" onClick={() => setIsVisible(true)} />
      <div className={cn(
        "absolute left-0 top-0 w-full h-full bg-black opacity-75 z-50 lg:hidden",
        isVisible ? "block" : "hidden",
      )}></div>
      <div className={cn(
        "h-full border-r p-4 flex-col flex gap-3 absolute left-0 top-0 w-3/4 z-51 bg-background transition-transform duration-300 ease-in-out overflow-y-auto lg:relative lg:translate-x-0 lg:flex lg:w-sm",
        isVisible ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="w-full flex justify-end items-center">
          <X className="text-muted-foreground cursor-pointer lg:hidden" onClick={() => setIsVisible(false)} />
        </div>
        {
          availableDevices.map(device => {
            return <div className="flex flex-col space-y-3">
              <span>{device.multiplexLabel}</span>
              {
                device.stations.map(station => {
                  return <div className={cn("w-full text-sm px-4 py-3 text-muted-foreground rounded-sm transition-all box-border cursor-pointer bg-muted", station.sid === selectedStation?.sid && "font-medium text-foreground")} onClick={() => dispatch(setSelectedStation(station))}>
                    {
                      station.name
                    }
                  </div>
                })
              }
            </div>
          })
        }
      </div>
    </>
  )
}

export default StationsList