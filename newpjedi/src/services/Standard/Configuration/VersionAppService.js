import * as ConfigConstants from '@constants/ConfigConstants';
import { axios } from '@utils';
import { useTokenStore } from '@stores';

const API = `${ConfigConstants.API_URL}versionapp`;

// const getListApkApp = async (params) => {
//   try {
//     return await axios.get(`${API}/get-version-app`, {
//       params: {
//         ...params,
//       },
//     });
//   } catch (error) {
//     console.log(`ERROR: ${error}`);
//   }
// };
const getListApkApp = async () => {
  try {
    return await axios.get(`${API}/get-version-app`, {
      onDownloadProgress: (progressEvent) => {
        console.log(progressEvent);
        let percentCompleted = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
        console.log('completed: ', percentCompleted);
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const modify = async (formData, options) => {
  try {
    return await axios.post(`${API}/update-version-app`, formData, options);
  } catch (error) {}
};

const downloadApp = async (appCode) => {
  try {
    const token = useTokenStore.getState().accessToken;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Origin': '',
        // 'Host': 'api.producthunt.com'
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`${API}/download-version-app/${appCode}`, options).then(async (response) => {
      const data = await response.json();
      let url = ConfigConstants.BASE_URL + '/' + data;
      let link = document.createElement('a');
      // If you don't know the name or want to use
      // the webserver default set name = ''
      link.setAttribute('download', appCode);
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export { getListApkApp, modify, downloadApp };
