import * as yup from 'yup';
import { useSelector } from 'react-redux';

const getChannelNames = () => {
  const channels = useSelector((state) => state.channelsInfo.channels);
  const channelsNames = channels.map(({ name }) => name);
  return channelsNames;
};

const getSchema = () => yup.string().min(3).notOneOf(getChannelNames());

export default getSchema;
