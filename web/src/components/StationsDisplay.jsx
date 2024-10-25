import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const StationsDisplay = ({ stationsInfo }) => {
    const [stations, setStations] = useState([])

    useEffect(() => {
        console.log("extractServices(stationsInfo)", extractServices(stationsInfo))
        setStations(extractServices(stationsInfo).flat())
    }, [stationsInfo])

    useEffect(() => {
        console.log("CXCXCXC", stations)
    }, [stations])


    function extractServices(array) {
        let result = array.map(item => {
            return item.services.map(service => {
                return {
                    labels: service.label,
                    url_mp3: service.url_mp3,
                    sid: service.sid,
                    bitrate: service.components[0].subchannel.bitrate,
                    language: service.components[0].subchannel.languagestring,
                    pty: service.ptystring,
                }
            })
        })
        return result
    }

    return (
        <div>
            <Table className="w-fit">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead >Station</TableHead>
                        <TableHead >SId</TableHead>
                        <TableHead >Bitrate</TableHead>
                        <TableHead >PTy</TableHead>
                        <TableHead className="text-right">Language</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        stations.map(station => {
                            return <TableRow>
                                <TableCell className="font-medium">{station.labels.label}</TableCell>
                                <TableCell>{station.sid}</TableCell>
                                <TableCell>{station.bitrate}</TableCell>
                                <TableCell>{station.pty}</TableCell>
                                <TableCell className="text-right">{station.language}</TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
            Copy

        </div>
    )
}

export default StationsDisplay