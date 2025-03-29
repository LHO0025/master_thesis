import { Station } from '@/models/station';
import { Utils } from '@/utils/utils';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';


interface SelectedStationState {
    station: Station | null
    availablePlaybackTimeMs: number
    currentText: string
}

const initialState: SelectedStationState = {
    station: null,
    availablePlaybackTimeMs: 0,
    currentText: ""
};

const selectedStationSlice = createSlice({
    name: 'selectedStation',
    initialState,
    reducers: {
        setSelectedStation(state, action: PayloadAction<Station>) {
            state.station = action.payload

        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBufferSize.fulfilled, (state, action: PayloadAction<number>) => {
            state.availablePlaybackTimeMs = action.payload;
        });

        builder.addCase(fetchStationText.fulfilled, (state, action: PayloadAction<string>) => {
            state.currentText = action.payload;
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

export const fetchStationText = createAsyncThunk(
    'selectedStation/fetchStationText',
    async ({ sid, port, time }: { sid: string, port: string, time: string }) => {
        try {
            const response: any = await (await fetch(`http://localhost:5000/cache_dls_data`, {
                method: "POST",
                body: JSON.stringify({ sid: sid, port: port, time: time }),
            })).json();
            return response.data
        } catch (error) {
            console.error(error)
        }
        return ""
    },
)

export const { setSelectedStation } = selectedStationSlice.actions;
export default selectedStationSlice.reducer;