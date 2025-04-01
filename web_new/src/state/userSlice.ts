import { BASE_URL } from '@/api';
import { User } from '@/models/user';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from "sonner";

interface UserState {
    user: User | null
    error?: string
}

const initialState: UserState = {
    user: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.user = {
                username: action.payload.userName,
                token: action.payload.token
            }

        });

        builder.addCase(loginUser.rejected, (state, action) => {
            state.user = null
            state.error = action.error.message
        });
    }
});

export interface LoginUserPayload {
    userName: string
    password: string
}

export const loginUser = createAsyncThunk(
    'user/login',
    async (payload: LoginUserPayload) => {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({
                userName: payload.userName,
                password: payload.password
            }),
        },
        )
        const responseJson = await response.json()

        if (!response.ok) {
            if (responseJson.error) {
                toast.error(responseJson.error)
            }
            throw new Error(`Request failed with status ${response.status}`);
        }

        return { token: responseJson.token, userName: payload.userName }
    })

export const { } = userSlice.actions;
export default userSlice.reducer