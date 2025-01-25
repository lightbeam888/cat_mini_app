import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  users: [],
  isLoadedUser: false,
  currentUser: {},
  tempMount: 0,
  showAchievement: false,
};

export const UsersReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoadedUser = true;
    },
    setTempMount: (state, action) => {
      state.tempMount = action.payload;
    },
    setShowAchievement: (state, action) => {
      state.showAchievement = action.payload;
    },
    setTotalReward: (state, action) => {
      // console.log(action.payload);
      state.currentUser = {
        ...state.currentUser,
        total_reward: action.payload,
      };
    },
    setCurrentBalance: (state, action) => {
      // console.log(action.payload);
      state.currentUser = {
        ...state.currentUser,
        balance: action.payload,
      };
    },
    setOcultBalance: (state, action) => {
      // console.log(action.payload);
      state.currentUser = {
        ...state.currentUser,
        ocult_balance: action.payload,
      };
    },
  },
});

export const {
  setUsers,
  setCurrentUser,
  setTempMount,
  setShowAchievement,
  setTotalReward,
  setCurrentBalance,
  setOcultBalance,
} = UsersReducer.actions;

export default UsersReducer.reducer;
