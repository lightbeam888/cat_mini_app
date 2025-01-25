import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  tasks: [],
  items: [],
  isLoadedtask: false,
  user: undefined,
  pubKey: null,
  priKey: null,
  rate: null,
};

export const TaskReducer = createSlice({
  name: "task",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setItems: (state, action) => {
      // console.log(action.payload);
      state.items = action.payload;
      state.isLoadedtask = true;
    },
    setRate: (state, action) => {
      state.rate = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.isLoadedtask = true;
    },
    setKeyPairs: (state, action) => {
      state.pubKey = action.payload.publicKey;
      state.priKey = action.payload.privateKey;
    },
    removeKeyPairs: (state, action) => {
      state.pubKey = null;
      state.priKey = null;
    },
  },
});

export const {
  setUser,
  setRate,
  setTasks,
  setKeyPairs,
  removeKeyPairs,
  setItems,
} = TaskReducer.actions;

export default TaskReducer.reducer;
