import { API } from "@/api";
import { Device } from "@/models/device";
import { fetchStationsInfo } from "@/state/devicesSlice";
import { useAppDispatch } from "@/state/store";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const CHANNELS = [
    "9D", "10A", "10B", "10C", "10D",
    "11A", "11B", "11C", "11D",
    "12A", "12B", "12C", "12D",
    "13A", "13B", "13C", "13D", "13E", "13F"
]

const SettingsItem = ({ device, index }: { device: Device, index: number }) => {
    const [tunedChannel, setTunedChannel] = useState(device.tunedChannel)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()

    function handleChangeTunedChannel(channel: string) {
        setIsLoading(true)
        setTunedChannel(channel)
        API.retune(device.port, channel)
            .then(() => {
                setIsLoading(false)
                dispatch(fetchStationsInfo())
            })
    }

    return (
        <Card className="h-fit relative overflow-hidden">
            {
                isLoading &&
                <div className="absolute w-full h-full left-0 top-0 bg-black opacity-50 z-50 flex justify-center items-center pointer-events-auto">
                    <Loader className="z-80 animate-spin" />
                </div>
            }
            <CardHeader>
                <CardTitle className="text-2xl">{device.tunedChannel}</CardTitle>
                <CardDescription>
                    Device #{index}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Select value={tunedChannel} defaultValue={tunedChannel} onValueChange={handleChangeTunedChannel}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            CHANNELS.map((band) => (
                                <SelectItem value={band} key={band}>{band}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    )
}

export default SettingsItem