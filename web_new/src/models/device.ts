import { Station } from "./station";

export interface Device {
    id: string
    label: string
    stations: Station[]
    tunedChannel: string
    port: string
}