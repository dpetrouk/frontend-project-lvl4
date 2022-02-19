import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { channelsSelectors } from '../../slices/channelsSlice.js';

const getChannelNames = () => {
  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);
  return channelsNames;
};

const getSchema = () => yup.string().min(3).notOneOf(getChannelNames());

export default getSchema;
