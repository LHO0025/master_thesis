import { Device } from '@/models/device';
import { Station } from '@/models/station';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface DevicesState {
    availableDevices: Device[];
}

const initialState: DevicesState = {
    availableDevices: [],
};

const devicesSlice = createSlice({
    name: 'mySlice',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchStationsInfo.fulfilled, (state, action) => {
            state.availableDevices = action.payload;
        });
    }
});

export const fetchStationsInfo = createAsyncThunk(
    'devices/fetchInfo',
    async () => {
        const response: any = await (await fetch(`http://localhost:5000/info`)).json();
        let devices: Device[] = response.devices.map((device: any) => {
            let _device: Device = {
                id: '0',
                label: 'label',
                stations: [],
                tunedChannel: device.tunedChannel
            }

            let stations: Station[] = device.services.map((service: any) => {
                return {
                    sid: service.sid,
                    name: service.label.label,
                    currentText: service.dls.label,
                    genre: service.ptystring,
                }
            })

            _device.stations = stations;
            return _device
        })
        return devices
    },
)

export const { } = devicesSlice.actions;
export default devicesSlice.reducer;