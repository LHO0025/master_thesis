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
import * as RadioService from "../services/radio_service"

const StationsDisplay = ({ currentStation }) => {

    return (
        <div>
            <Table className="w-fit">
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
                    <TableRow>
                        <TableCell className="font-medium">{currentStation.labels.label}</TableCell>
                        <TableCell>{currentStation.sid}</TableCell>
                        <TableCell>{currentStation.bitrate}</TableCell>
                        <TableCell>{currentStation.pty}</TableCell>
                        <TableCell className="text-right">{currentStation.language}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default StationsDisplay