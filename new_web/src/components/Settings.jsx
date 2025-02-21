import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import * as RadioService from "../services/radio_service";

const DAB_CHANNELS = [
    '5A', '5B', '5C', '5D',
    '6A', '6B', '6C', '6D',
    '7A', '7B', '7C', '7D',
    '8A', '8B', '8C', '8D',
    '9A', '9B', '9C', '9D',
    '10A', '10B', '10C', '10D',
    '11A', '11B', '11C', '11D',
    '12A', '12B', '12C', '12D'
];

const Settings = ({ devicesInformation, setDevicesInformation }) => {
    const [selectedDevice, setSelectedDevice] = useState(null)
    const [selectedChannel, setSelectedChannel] = useState(null)

    // function handleSelectChannel(channel) {
    //     // make a call to API
    //     const updatedDevices = availableDevices.map(device =>
    //         device.id === selectedDevice.id ? { ...device, channel: channel } : device
    //     );
    //     setAvailableDevices(updatedDevices)
    // }

    useEffect(() => {
        console.log(selectedDevice)
    }, [selectedDevice])


    function handleSelectDevice(port) {
        setSelectedDevice(port)
        let device = devicesInformation.find(device => { return device.port == port })
        if (device) {
            setSelectedChannel(device.tunedChannel)
        }
    }

    function handleSelectChannel(channel) {
        setSelectedChannel(channel)
        let device = devicesInformation.find(device => { return device.port == selectedDevice })
        if (device) {
            setDevicesInformation((prevDevices) =>
                prevDevices.filter((_device) => _device.port !== device.port)
            );

            RadioService.retune(channel, device.port)
                .then(res => {
                    console.log(res.json())
                })
        }
    }

    return (
        <div className="w-full h-full mt-[300px]">
            <div className="flex gap-4">
                <Select onValueChange={handleSelectDevice} value={selectedDevice}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choose a device" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            devicesInformation.map((device, index) => {
                                return <SelectItem value={device.port}>Device {index}</SelectItem>
                            })
                        }
                    </SelectContent>

                </Select>


                {
                    selectedDevice &&
                    <Select onValueChange={handleSelectChannel} value={selectedChannel}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Choose a channel" />
                        </SelectTrigger>
                        <SelectContent>
                            {DAB_CHANNELS.map(channel => {
                                return devicesInformation.some((device) => {
                                    return device.tunedChannel == channel
                                }) ?
                                    <SelectItem value={channel} disabled>
                                        <span>{channel}</span>
                                    </SelectItem>
                                    :
                                    <SelectItem value={channel}>{channel} </SelectItem>
                            })
                            }
                        </SelectContent>
                    </Select>
                }
            </div>
        </div >
    )
}

export default Settings