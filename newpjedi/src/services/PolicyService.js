import { axios } from '@utils';

const URL = `/api/Policy`;

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
