import * as ConfigConstants from '@constants/ConfigConstants';
import axios from 'axios';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';

import store from '@states/store';
import { historyApp } from '@utils';

import { useTokenStore, useUserStore } from '@stores';
import { ErrorAlert } from '@utils';

// const API_URL = config.api.API_BASE_URL;
const API_URL = ConfigConstants.BASE_URL;

const instance = axios.create({
  baseURL: API_URL,
  // timeout: 10 * 1000,
  // mode: 'no-cors',
  withCredentials: false,
  headers: {
    // Accept: 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Content-Type': 'application/json',
    Authorization: '',
  },
});

const currentExecutingRequests = {};

const createError = (httpStatusCode, statusCode, errorMessage, problems, errorCode = '') => {
  const error = new Error();
  error.httpStatusCode = httpStatusCode;
  error.statusCode = statusCode;
  error.errorMessage = errorMessage;
  error.problems = problems;
  error.errorCode = errorCode + '';
  return error;
};

export const isSuccessStatusCode = (s) => {
  // May be string or number
  const statusType = typeof s;
  return (statusType === 'number' && s === 0) || (statusType === 'string' && s.toUpperCase() === 'OK');
};

let refreshtokenRequest = null;

instance.interceptors.request.use(
  async (request) => {
    let originalRequest = request;

    if (currentExecutingRequests[request.url]) {
      const source = currentExecutingRequests[request.url];
      delete currentExecutingRequests[request.url];
      source.cancel();
    }

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    originalRequest.cancelToken = source.token;
    currentExecutingRequests[request.url] = source;

    if (
      originalRequest.url.indexOf(ConfigConstants.LOGIN_URL) >= 0 ||
      originalRequest.url.indexOf(ConfigConstants.REFRESH_TOKEN_URL) >= 0
    ) {
      return originalRequest;
    } else {
      const token = useTokenStore.getState().accessToken;
      if (token) {
        const tokenDecode = jwt_decode(token);
        const isExpired = dayjs.unix(tokenDecode.exp).diff(dayjs()) < 1;
        if (!isExpired) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return originalRequest;
        } else {
          refreshtokenRequest = refreshtokenRequest ? refreshtokenRequest : instance.getNewAccessToken();

          const response = await refreshtokenRequest;
          refreshtokenRequest = null;

          if (response.HttpResponseCode === 200 && response.ResponseMessage === 'general.success') {
            const dispatchSetAccessToken = useTokenStore.getState().dispatchSetAccessToken;
            const dispatchSetRefreshToken = useTokenStore.getState().dispatchSetRefreshToken;

            dispatchSetAccessToken(response.Data.accessToken);
            dispatchSetRefreshToken(response.Data.refreshToken);

            originalRequest.headers.Authorization = `Bearer ${response.Data.accessToken}`;
          } else {
            await instance.Logout();
          }
        }
      } else {
        await instance.Logout();
      }

      return originalRequest;
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  async (response) => {
    if (currentExecutingRequests[response.request.responseURL]) {
      // here you clean the request
      delete currentExecutingRequests[response.request.responseURL];
    }

    // Thrown error for request with OK status code
    const { data } = response;
    if (data) {
      if (
        data.HttpResponseCode === 401 &&
        (data.ResponseMessage === 'login.lost_authorization' || data.ResponseMessage === 'token.access_token.invalid')
        // || data.ResponseMessage === 'general.unauthorized'
      ) {
        await instance.Logout();
      }

      if (data.HttpResponseCode === 401 && data.ResponseMessage === 'general.unauthorized') {
        const language = useTokenStore.getState().language;
        // if (language === 'EN') ErrorAlert('You have not permission to make this request');
        // else ErrorAlert('Bạn không có quyền truy cập chức năng hiện tại');
      }
    }
    return response.data;
  },
  async (error) => {
    const { config, response } = error;

    const originalRequest = config;

    if (axios.isCancel(error)) {
      // here you check if this is a cancelled request to drop it silently (without error)
      return new Promise(() => {});
    }

    if (currentExecutingRequests[originalRequest.url]) {
      // here you clean the request
      delete currentExecutingRequests[originalRequest.url];
    }

    // here you could check expired token and refresh it if necessary

    return Promise.reject(error);
  }
);

instance.getNewAccessToken = async () => {
  const token = useTokenStore.getState();
  let postObj = {
    expiredToken: token.accessToken,
    refreshToken: token.refreshToken,
  };

  return await instance.post(API_URL + '/api/refreshtoken', postObj);
};

instance.Logout = async (e) => {
  try {
    await handleLogout();
  } catch (error) {
    console.log(`logout error: ${error}`);
  }
};

const handleLogout = async () => {
  const requestOptions = {
    withCredentials: false,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const accessToken = useTokenStore.getState().accessToken;
  const dispatchRemoveToken = useTokenStore.getState().dispatchRemoveToken;

  const dispatchSetKickOutState = useUserStore.getState().dispatchSetKickOutState;
  const dispatchSetKickOutMessage = useUserStore.getState().dispatchSetKickOutMessage;

  const dispatchRemoveUser = useUserStore.getState().dispatchRemoveUser;

  if (accessToken) {
    requestOptions.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    requestOptions.headers.Authorization = `Bearer logout_token`;
  }

  fetch(`${API_URL}/api/logout`, requestOptions)
    .then((result) => result.json())
    .then((result) => {
      if (result.ResponseMessage === 'general.success') {
        dispatchRemoveToken();

        dispatchRemoveUser();

        dispatchSetKickOutState(true);
        dispatchSetKickOutMessage('token.access_token.invalid');

        // dispatchRemoveMenu();

        store.dispatch({
          type: 'Dashboard/DELETE_ALL',
        });

        historyApp.push('/logout');
      }
    });
};

export { instance };
