import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import fetchData from './fetchData.js';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    removeMessage: messagesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        messagesAdapter.setAll(state, action.payload.messages);
      })
      .addCase(fetchData.rejected, () => {
        console.log('Rejected');
      });
  },
});

export const { addMessage, removeMessage } = messagesSlice.actions;

export default messagesSlice.reducer;

export const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages);
