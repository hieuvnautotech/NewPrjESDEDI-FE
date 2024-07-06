import { axios } from '@utils';

const apiName = '/api/Document';

const getDocumentList = async (params) => {
  try {
    return await axios.get(apiName, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createDocument = async (params, file) => {
  try {
    const formData = new FormData();
    formData.append('menuComponent', params.menuComponent);
    formData.append('documentLanguage', params.documentLanguage);
    formData.append('file', file);

    return await axios.post(`${apiName}/create-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const modifyDocument = async (params, file) => {
  try {
    const formData = new FormData();
    formData.append('documentId', params.documentId);
    formData.append('menuComponent', params.menuComponent);
    formData.append('documentLanguage', params.documentLanguage);
    formData.append('urlFile', params.urlFile);
    formData.append('row_version', params.row_version);
    formData.append('file', file);

    return await axios.put(`${apiName}/modify-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const deleteDocument = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-document`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getMenu = async () => {
  try {
    return await axios.get(`${apiName}/get-menu-component`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getLanguage = async () => {
  try {
    return await axios.get(`${apiName}/get-language`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const downloadDocument = async (name, documentLanguage) => {
  try {
    return await axios.get(`${apiName}/download/${name}/${documentLanguage}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export { getDocumentList, createDocument, modifyDocument, deleteDocument, getMenu, getLanguage, downloadDocument };
