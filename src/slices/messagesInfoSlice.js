import { createSlice } from '@reduxjs/toolkit';
import { setInitialState, removeChannel } from './channelsInfoSlice.js';

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: 'messagesInfo',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setInitialState.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(removeChannel, (state, action) => {
        state.messages = state.messages
          .filter(({ channelId }) => channelId !== action.payload.channelId);
      });
  },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
