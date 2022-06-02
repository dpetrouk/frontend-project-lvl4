/* eslint-disable no-param-reassign */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { fetchInitialState, removeChannel, selectCurrentChannelId } from './channelsInfoSlice.js';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messagesInfo',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialState.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(removeChannel, (state, action) => {
        state.messages = state.messages
          .filter(({ channelId }) => channelId !== action.payload.channelId);
      });
  },
});

const selectMessages = (state) => state.messagesInfo.messages;

const selectCurrentChannelMessages = createSelector(
  selectMessages,
  selectCurrentChannelId,
  (messages, currentChannelId) => messages.filter(({ channelId }) => channelId === currentChannelId),
);

export { messagesSlice };

export { selectCurrentChannelMessages };

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
