import { axios } from '@utils';

const URL = `/api/Q2Management`;

export const get = async (params) => {
  try {
    return await axios.get(`${URL}`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSendType = async (params) => {
  try {
    return await axios.get(`${URL}/get-send-type`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
