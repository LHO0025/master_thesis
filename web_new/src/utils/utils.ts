function sampleCountToMs(sampleRate: number, count: number): number {
    return Math.floor(count / (sampleRate / 2)) * 1000;
}

function MsToSampleCount(sampleRate: number, ms: number): number {
    return Math.floor((ms / 1000) * (sampleRate / 2));
}

export const Utils = {
    sampleCountToMs,
    MsToSampleCount
}
