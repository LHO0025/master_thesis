import { configureStore } from "@reduxjs/toolkit";
import devicesReducer from "./devicesSlice";
import selectedStationReducer from "./selectedStationSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        devicesSlice: devicesReducer,
        selectedStationSlice: selectedStationReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector