import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import devicesReducer from "./devicesSlice";
import selectedStationReducer from "./selectedStationSlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        devicesSlice: devicesReducer,
        selectedStationSlice: selectedStationReducer,
        userSlice: userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector