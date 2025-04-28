
import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: { user:null , token: null},
    reducers: {
        addUser: (state,action) => {
            state.user = action.payload.user,
            state.token = action.payload.token
        },
        removeUser: (state,payload) => {
            return null
        },
        logoutUser: (state) => {
            state.user = null,
            state.token = null
            localStorage.removeItem("token");
        }
    }
})

export const {addUser,removeUser,logoutUser} = userSlice.actions
export default userSlice.reducer