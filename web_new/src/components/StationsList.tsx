import { cn } from "@/lib/utils"
import { setSelectedStation } from "@/state/devicesSlice"
import { useAppDispatch, useAppSelector } from "@/state/store"

const StationsList = () => {
  const { availableDevices, selectedStation } = useAppSelector((state) => state.devicesSlice)
  const dispatch = useAppDispatch()

  return (
    <div className="h-full w-sm border-r p-4 flex-col flex gap-3 ">

      {
        availableDevices.map(device => {
          return <div className="flex flex-col space-y-3">
            <span>{device.label}</span>
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

      {/* {
        availableDevices.map((device) => (
          <div className={cn("w-full text-sm px-4 py-3 text-muted-foreground rounded-sm transition-all box-border cursor-pointer", station.id === selectedStation?.id && "bg-muted text-foreground font-medium")} onClick={() => dispatch(setSelectedStation(station))}>
            {
              station.name
            }
          </div>
        ))
      } */}
    </div>
  )
}

export default StationsList