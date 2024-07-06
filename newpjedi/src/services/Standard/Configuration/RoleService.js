import { axios } from '@utils';

const apiName = '/api/role';

const getRoleList = async (params) => {
  try {
    return await axios.get(apiName, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const GetMenuByRole = async (roleId, params) => {
  try {
    return await axios.get(`${apiName}/get-menu-by-role/${roleId}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getAllRole = async () => {
  try {
    return await axios.get(`${apiName}/get-all-role`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createRole = async (params) => {
  try {
    return await axios.post(`${apiName}/create-role`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const updateRole = async (params) => {
  try {
    return await axios.put(`${apiName}/modify-role`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const deleteRole = async (roleId) => {
  try {
    return await axios.delete(`${apiName}/delete-role/${roleId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getAllMenu = async () => {
  try {
    return await axios.get(`${apiName}/get-all-menu`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const setPermissionForRole = async (params) => {
  try {
    return await axios.post(`${apiName}/set-permissions-for-role`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const setMenuForRole = async (params) => {
  try {
    return await axios.post(`${apiName}/set-menu-for-role`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const deleteMenu = async (params) => {
  try {
    return await axios.post(`${apiName}/delete-menu`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getMenuPermission = async (params) => {
  try {
    return await axios.get(`${apiName}/get-menu-permission`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getRoleMenuPermission = async (params) => {
  try {
    return await axios.get(`${apiName}/get-role-menu-permission`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export {
  GetMenuByRole,
  createRole,
  deleteMenu,
  deleteRole,
  getAllMenu,
  getMenuPermission,
  getAllRole,
  getRoleList,
  setMenuForRole,
  setPermissionForRole,
  updateRole,
  getRoleMenuPermission,
};
