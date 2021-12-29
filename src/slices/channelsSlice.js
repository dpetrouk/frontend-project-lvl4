import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import fetchData from './fetchData.js';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState();

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        channelsAdapter.setAll(state, action.payload.channels);
      })
      .addCase(fetchData.rejected, () => {
        console.log('Rejected');
      });
  },
});

export const { addChannel, removeChannel } = channelsSlice.actions;

export default channelsSlice.reducer;

export const channelsSelectors = channelsAdapter.getSelectors((state) => state.channels);
