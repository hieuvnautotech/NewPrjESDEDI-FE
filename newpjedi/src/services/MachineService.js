import { axios } from '@utils';

const URL = `/api/Machine`;

export const get = async (params) => {
  try {
    return await axios.get(`${URL}/elas`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const create = async (params) => {
  try {
    return await axios.post(`${URL}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const update = async (params) => {
  try {
    return await axios.put(`${URL}/update`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const del = async (params) => {
  try {
    return await axios.put(`${URL}/delete`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
