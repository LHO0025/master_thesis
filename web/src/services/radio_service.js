export function fetchBufferSize(ssid) {
    return fetch("http://localhost:7979/buffer_size/" + ssid)
}

export function fetchStationInfo() {
    return fetch("http://localhost:7979/mux.json")
}
