import { API, BASE_URL } from '@/api';
import { Station } from '@/models/station';
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
        builder.addCase(fetchAvailableTime.fulfilled, (state, action: PayloadAction<number>) => {
            state.availablePlaybackTimeMs = action.payload;
        });

        builder.addCase(fetchBufferedDls.fulfilled, (state, action: PayloadAction<string>) => {
            state.currentDls = action.payload;
        });
    }
});

export const fetchAvailableTime = createAsyncThunk(
    'selectedStation/fetchAvailableTime',
    async ({ sid, port }: { sid: string, port: string }) => {
        try {
            console.log("calling")
            const response: any = await (await fetch(`${BASE_URL}/playback_time?sid=${sid}&port=${port}`)).json();
            return response.playbackTimeMs;
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