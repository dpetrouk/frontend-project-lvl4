import * as yup from 'yup';

import store from '../../slices/index.js';

const getChannelNames = () => {
  const { channels } = store.getState().channelsInfo;
  const channelsNames = channels.map(({ name }) => name);
  return channelsNames;
};

const getSchema = () => yup.string()
  .required('chat.modals.errors.required')
  .min(3, 'chat.modals.errors.channelNameLength')
  .max(20, 'chat.modals.errors.channelNameLength')
  .notOneOf(getChannelNames(), 'chat.modals.errors.unique');

export default getSchema;
