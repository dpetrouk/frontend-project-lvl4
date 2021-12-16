import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import routes from '../routes.js';

export default createAsyncThunk(
  'state/fetchData',
  async (token) => {
    const requestConfig = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(routes.data(), requestConfig);
    return data;
  },
);
