import { store } from "./state/store"

export const BASE_URL = "http://localhost:5000"

function getBufferedSlideUrl(sid: string, port: string, time: number) {
    return `${BASE_URL}/buffered_slide?sid=${sid}&port=${port}&time=${time}`
}

function fetchBufferedDls(sid: string, port: string, time: number) {
    return fetch(`${BASE_URL}/buffered_dls?sid=${sid}&port=${port}&time=${time}`)
}

function retune(port: string, channel: string) {
    return fetch(`${BASE_URL}/retune?port=${port}&channel=${channel}`, {
        method: 'POST',
        headers: {
            'Authorization': store.getState().userSlice.user?.token ?? ""
        }
    })
}

function fetchBufferSize(sid: string, port: string) {
    return fetch(`${BASE_URL}/buffer_size/${port}/${sid}`)
}

export const API = {
    retune,
    fetchBufferedDls,
    getBufferedSlideUrl,
    fetchBufferSize
}