const BASE_URL = "http://localhost:5000"

function fetchBufferSize(sid: string, port: string) {
    return fetch(`${BASE_URL}/buffer_size/${port}/${sid}`)
}

export const API = {
    fetchBufferSize
}