'use client'

import * as React from 'react'
import { Search, Star } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter
} from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"



// Sample data for radio stations


export default function RadioSidebar({ radioStations, setCurrentStation }) {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [filteredStations, setFilteredStations] = React.useState(radioStations)

    // useEffect(() => {


    //     const filtered = radioStations.filter(station =>
    //         station.name.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    //     setFilteredStations(filtered)
    // }, [searchTerm, radioStations])

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
                <SidebarGroup className="!p-0">
                    <SidebarGroupContent>
                        <SidebarMenu >
                            {radioStations.map((station) => (
                                <>
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
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent >
            <SidebarFooter />
        </Sidebar >
    )
}