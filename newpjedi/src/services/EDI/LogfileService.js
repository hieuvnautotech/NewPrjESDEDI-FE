import { axios } from '@utils';

const URL = `/api/log-file`;

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
