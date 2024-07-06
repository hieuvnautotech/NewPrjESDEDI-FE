import { axios } from '@utils';

const URL = `/api/menu`;

export const getMenuList = async (params) => {
  try {
    return await axios.get(URL, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getParentMenus = async (menuLevel) => {
  try {
    return await axios.get(`${URL}/get-by-level`, {
      params: {
        menuLevel,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createMenu = async (params) => {
  try {
    return await axios.post(`${URL}/create-menu`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyMenu = async (params) => {
  try {
    return await axios.put(`${URL}/modify-menu`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteMenu = async (params) => {
  try {
    return await axios.delete(`${URL}/delete-menu`, {
      data: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMenuPermission = async (menuId) => {
  try {
    return await axios.get(`${URL}/get-menu-permission`, {
      params: {
        menuId,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createMenuPermission = async (params) => {
  try {
    return await axios.post(`${URL}/create-menu-permission`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyMenuPermission = async (params) => {
  try {
    return await axios.put(`${URL}/modify-menu-permission`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteMenuPermission = async (id) => {
  try {
    return await axios.delete(`${URL}/delete-menu-permission/${id}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getAllMenuPermission = async (params) => {
  try {
    return await axios.post(`${URL}/get-all-menu-permission`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
