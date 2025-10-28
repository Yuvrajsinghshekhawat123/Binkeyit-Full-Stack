 import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: "",
    name: "",
    email: "",
    avatar:"",
    mobile:"",
    verify_email:"",
    last_login_date:"",
    status:"",
    role:"",
    created_at:"",
};

const userDetailSlice = createSlice({
    name: "userDetail",
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.userId= action.payload?.id
            state.name= action.payload?.name
            state.email= action.payload?.email
            state.avatar=action.payload?.avatar
            state.mobile=action.payload?.mobile
            state.verify_email=action.payload?.verify_email
            state.last_login_date=action.payload?.last_login_date
            state.status=action.payload?.status
            state.role=action.payload?.role
            state.created_at=action.payload?.created_at
        },
        clearUserDetails: (state) => {
            state.userId= ""
            state.name= ""
            state.email= ""
            state.avatar=""
            state.mobile=""
            state.verify_email=""
            state.last_login_date=""
            state.status=""
            state.role=""
            state.created_at=""
        }
    },
});

export const { setUserDetails, clearUserDetails } = userDetailSlice.actions;
export default userDetailSlice.reducer;
