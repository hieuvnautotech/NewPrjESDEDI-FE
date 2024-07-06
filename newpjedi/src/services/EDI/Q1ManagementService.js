import { axios } from '@utils';

const URL = `/api/Q1Management`;

export const getAll = async (params) => {
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
export const create = async (params) => {
  try {
    return await axios.post(`${URL}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createByExcel = async (params) => {
  try {
    return await axios.post(`${URL}/create-by-excel`, params);
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
    return await axios.delete(`${URL}/delete`, {
      params: params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
