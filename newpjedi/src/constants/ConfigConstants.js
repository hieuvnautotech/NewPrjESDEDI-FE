/**
 * AUTONSI
 */
export const API_URL = process.env.API_URL;
export const BASE_URL = process.env.BASE_URL;

export const LOGIN_URL = process.env.LOGIN_URL;
export const REFRESH_TOKEN_URL = process.env.REFRESH_TOKEN_URL;

export const APP_VERSION = process.env.APP_VERSION;

// export const LOGIN_URL = '/api/login/check-login';
// export const REFRESH_TOKEN_URL = '/api/refreshtoken';

const company = 'ESD';

const accessTokenKey = `${company}_ACCESS`;
const refreshAccessTokenKey = `${company}_REFRESH`;
const tokenKey = `${company}_TOKEN`;

export const CURRENT_USER = `${company}_USER`;
export const CURRENT_MENU = `${company}_MENU`;
export const TOKEN_ACCESS = accessTokenKey;
export const TOKEN_REFRESH = refreshAccessTokenKey;
export const TOKEN = tokenKey;
export const LANG_CODE = `${company}_LANGUAGE`;

//#region   Avatar
const avatar1 = require('@static/images/avatar/avatar1.png');
const avatar2 = require('@static/images/avatar/avatar2.png');
const avatar3 = require('@static/images/avatar/avatar3.png');
const avatar4 = require('@static/images/avatar/avatar4.png');
const avatar5 = require('@static/images/avatar/avatar5.png');
const avatar6 = require('@static/images/avatar/avatar6.png');
const avatar7 = require('@static/images/avatar/avatar7.png');
const avatar8 = require('@static/images/avatar/avatar8.png');
const avatar9 = require('@static/images/avatar/avatar9.png');
const avatar10 = require('@static/images/avatar/avatar10.png');

export const Avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];
//#endregion

//#region   Action control
export const ACTION = {
  VIEW: 'VIEW - SEARCH',
  CREATE: 'CREATE',
  MODIFY: 'MODIFY',
  DELETE: 'DELETE',
};
//#endregion

//#region   Dialog control
export const DIALOG = {
  INFO: '#0071ba',
  SUCCESS: '#66bb6a',
  WARNING: '#ef7d00',
  ERROR: '#ff0000',
};
//#endregion

//#region   Text Font size
export const FONT_SIZE = {
  INHERIT: 'inherit',
  REM_20: '2rem',
  REM_19: '1.9rem',
  REM_18: '1.8rem',
  REM_17: '1.7rem',
  REM_16: '1.6rem',
  REM_15: '1.5rem',
  REM_14: '1.4rem',
  REM_13: '1.3rem',
  REM_12: '1.2rem',
  REM_11: '1.1rem',
  REM_10: '1rem',
  REM_9: '0.9rem',
  REM_8: '0.8rem',
  REM_7: '0.7rem',
  REM_6: '0.6rem',
  REM_5: '0.5rem',
};
//#endregion
