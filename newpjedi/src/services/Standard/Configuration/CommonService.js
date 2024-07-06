import { axios } from '@utils';

const COMMONMASTER_API = '/api/commonmaster';
const COMMONDETAIL_API = '/api/commondetail';

const getCommonMasterList = async (params) => {
  try {
    return await axios.get(`${COMMONMASTER_API}`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createCommonMaster = async (params) => {
  try {
    return await axios.post(`${COMMONMASTER_API}/create-commonmaster`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const modifyCommonMaster = async (params) => {
  try {
    return await axios.put(`${COMMONMASTER_API}/modify-commonmaster`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const deleteReuseCommonMater = async (params) => {
  try {
    return await axios.put(`${COMMONMASTER_API}/delete-commonmaster`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//commom detail
const getCommonDetailList = async (params) => {
  try {
    return await axios.get(`${COMMONDETAIL_API}/getall-by-masterCode`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createCommonDetail = async (params) => {
  try {
    return await axios.post('/api/CommonDetail/create-commondetail', {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const modifyCommonDetail = async (params) => {
  try {
    return await axios.put(`${COMMONDETAIL_API}/modify-commondetail`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const deleteReuseCommonDetail = async (params) => {
  try {
    return await axios.put(`${COMMONDETAIL_API}/delete-reuse-commondetail`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export {
  //commonMaster
  getCommonMasterList,
  createCommonMaster,
  modifyCommonMaster,
  deleteReuseCommonMater,

  //commonDetail
  getCommonDetailList,
  createCommonDetail,
  modifyCommonDetail,
  deleteReuseCommonDetail,
};
