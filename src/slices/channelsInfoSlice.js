/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

import routes from '../routes.js';

const defaultChannelId = 1;

const fetchInitialState = createAsyncThunk(
  'channelsInfo/fetchInitialState',
  async (token) => {
    const requestConfig = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(routes.data(), requestConfig);
    return data;
  },
);

const initialState = {
  channels: [],
  currentChannelId: defaultChannelId,
};

const channelsInfoSlice = createSlice({
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
      const removedChannelId = action.payload.id;
      const index = state.channels.findIndex(({ id }) => id === removedChannelId);
      if (index !== -1) {
        state.channels.splice(index, 1);
      }
      if (state.currentChannelId === removedChannelId) {
        state.currentChannelId = defaultChannelId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialState.fulfilled, (state, action) => {
        state.channels = action.payload.channels;
        state.currentChannelId = action.payload.currentChannelId;
      });
  },
});

const selectChannels = (state) => state.channelsInfo.channels;
const selectCurrentChannelId = (state) => state.channelsInfo.currentChannelId;
const selectCurrentChannel = createSelector(
  selectChannels,
  selectCurrentChannelId,
  (channels, currentChannelId) => channels.find(({ id }) => id === currentChannelId),
);

const selectChannelById = createSelector(
  [
    selectChannels,
    (state, channelId) => channelId,
  ],
  (channels, channelId) => channels.find(({ id }) => id === channelId),
);

export { channelsInfoSlice, fetchInitialState };

export {
  selectChannels,
  selectCurrentChannelId,
  selectCurrentChannel,
  selectChannelById,
};

export const {
  setCurrentChannel, addChannel, renameChannel, removeChannel,
} = channelsInfoSlice.actions;

export default channelsInfoSlice.reducer;
