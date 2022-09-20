import * as yup from 'yup';

import store from '../../slices/index.js';

const getChannelNames = () => {
  const { channels } = store.getState().channelsInfo;
  const channelsNames = channels.map(({ name }) => name);
  return channelsNames;
};

const getSchema = () => {
  yup.setLocale({
    mixed: {
      required: 'chat.modals.errors.required',
      notOneOf: 'chat.modals.errors.unique',
    },
    string: {
      min: 'chat.modals.errors.channelNameLength',
      max: 'chat.modals.errors.channelNameLength',
    },
  });

  return yup.string()
    .required()
    .min(3)
    .max(20)
    .notOneOf(getChannelNames());
};

export default getSchema;
