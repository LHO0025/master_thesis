const SERVER_URL = import.meta.env.VITE_SERVER_URL
const BASE_SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL

export function fetchBufferSize(ssid, port) {
    return fetch(SERVER_URL + "/buffer_size/" + port + "/" + ssid)
}

export function fetchStationInfo() {
    return fetch(SERVER_URL + "/info")
}

export function fetchSlideshow(ssid) {
    return fetch(SERVER_URL + "/slide/" + ssid)
}

export function retune(channel, port) {
    return fetch(SERVER_URL + "/retune/" + port + "/" + channel, {
        method: "POST"
    });
}