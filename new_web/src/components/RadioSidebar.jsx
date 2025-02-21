'use client'

import { Search, Star } from 'lucide-react'
import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'



// Sample data for radio stations


export default function RadioSidebar({ multiplexes, setCurrentStation }) {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [filteredStations, setFilteredStations] = React.useState(multiplexes)

    // useEffect(() => {


    //     const filtered = radioStations.filter(station =>
    //         station.name.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    //     setFilteredStations(filtered)
    // }, [searchTerm, radioStations])

    React.useEffect(() => {
        console.log("multiplexes", multiplexes)
    }, [multiplexes])

    function evaluate(multiplexes) {
        multiplexes.some(multiplex => {
            return multiplex.stations && multiplex.stations.length > 0
        })
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarGroup className="px-0">
                    <Label htmlFor="search" className="sr-only">
                        Search stations
                    </Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            placeholder="Search stations..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </SidebarGroup>
            </SidebarHeader>


            <SidebarContent>

                {
                    (multiplexes && multiplexes.length > 0 && multiplexes.some(multiplex => multiplex.stations?.length > 0)) ?
                        multiplexes.map(multiplex => {
                            return <>
                                <SidebarGroup className="!p-0">
                                    <SidebarGroupLabel>{multiplex.label}</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <SidebarMenu >

                                            {
                                                multiplex.stations.map(station => {
                                                    return <>
                                                        <SidebarMenuItem>
                                                            <SidebarMenuButton asChild>
                                                                <div className="flex h-fit" onClick={() => { setCurrentStation(station) }}>
                                                                    <div className="flex flex-col w-full text-left h-fit !items-start gap-0">
                                                                        <span className="flex-1">{station.labels.label}</span>
                                                                        <span className="text-xs text-muted-foreground">{multiplex.channel}</span>
                                                                    </div>
                                                                    <Star></Star>
                                                                </div>
                                                            </SidebarMenuButton >
                                                        </SidebarMenuItem>
                                                        <Separator />
                                                    </>
                                                })
                                            }

                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            </>
                        })
                        :
                        <>
                            <span className="pl-2">Searching for stations...</span>
                        </>
                }

            </SidebarContent >
            <SidebarFooter />
        </Sidebar >
    )
}
{/* 
multiplex.stations.map(station => {
                                        return <>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild>
                                                    <div className="flex h-fit" onClick={() => { setCurrentStation(station) }}>
                                                        <div className="flex flex-col w-full text-left h-fit !items-start gap-0">
                                                            <span className="flex-1">{station.labels.label}</span>
                                                            <span className="text-xs text-muted-foreground">10D</span>
                                                        </div>
                                                        <Star></Star>
                                                    </div>
                                                </SidebarMenuButton >
                                            </SidebarMenuItem>
                                            <Separator />
                                        </>
                                    }) */}