/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import routes from '../routes.js';

const setInitialState = createAsyncThunk(
  'channelsInfo/setInitialState',
  async (token) => {
    const requestConfig = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(routes.data(), requestConfig);
    return data;
  },
);

const initialState = {
  channels: [],
  currentChannelId: 1,
};

export const channelsInfoSlice = createSlice({
  name: 'channelsInfo',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload.channelId;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    renameChannel: (state, action) => {
      const index = state.channels.findIndex(({ id }) => id === action.payload.id);
      if (index !== -1) {
        state.channels[index].name = action.payload.name;
      }
    },
    removeChannel: (state, action) => {
      const index = state.channels.findIndex(({ id }) => id === action.payload.id);
      console.log({ index, action });
      if (index !== -1) {
        state.channels.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setInitialState.fulfilled, (state, action) => {
        state.channels = action.payload.channels;
        state.currentChannelId = action.payload.currentChannelId;
      });
  },
});

export const {
  setCurrentChannel, addChannel, renameChannel, removeChannel,
} = channelsInfoSlice.actions;

export { setInitialState };

export default channelsInfoSlice.reducer;
