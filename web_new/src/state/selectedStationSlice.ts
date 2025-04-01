import { API } from '@/api';
import { Station } from '@/models/station';
import { Utils } from '@/utils/utils';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';


interface SelectedStationState {
    station: Station | null
    availablePlaybackTimeMs: number
    currentDls: string
    bufferedImageUrl: string
}

const initialState: SelectedStationState = {
    station: null,
    availablePlaybackTimeMs: 0,
    currentDls: "",
    bufferedImageUrl: ""
};

const selectedStationSlice = createSlice({
    name: 'selectedStation',
    initialState,
    reducers: {
        setSelectedStation(state, action: PayloadAction<Station>) {
            state.station = action.payload
        },
        setBufferedImageUrl(state, action: PayloadAction<string>) {
            state.bufferedImageUrl = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBufferSize.fulfilled, (state, action: PayloadAction<number>) => {
            state.availablePlaybackTimeMs = action.payload;
        });

        builder.addCase(fetchBufferedDls.fulfilled, (state, action: PayloadAction<string>) => {
            state.currentDls = action.payload;
        });
    }
});

export const fetchBufferSize = createAsyncThunk(
    'selectedStation/fetchBufferSize',
    async ({ sid, port }: { sid: string, port: string }) => {
        try {
            const response: any = await (await fetch(`http://localhost:5000/buffer_size/${port}/${sid}`)).json();
            return Utils.sampleCountToMs(48_000, response.bufferSize)
        } catch (error) {
            console.error(error)
        }
        return 0
    },
)

export const fetchBufferedDls = createAsyncThunk(
    'selectedStation/fetchBufferedDls',
    async ({ sid, port, time }: { sid: string, port: string, time: number }) => {
        try {
            const response: any = await API.fetchBufferedDls(sid, port, time)
            const responseJson = await response.json()
            return responseJson.data
        } catch (error) {
            console.error(error)
        }
        return ""
    },
)

export const { setSelectedStation, setBufferedImageUrl } = selectedStationSlice.actions;
export default selectedStationSlice.reducer;