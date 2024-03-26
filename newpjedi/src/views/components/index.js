import { lazy } from 'react';

import LoaderOverlay from './LoaderOverlay';

const ScanCamera = lazy(() => import('./ScanCamera'));

const DashBoard = lazy(() => import('./dashBoard'));

const NavBar = lazy(() => import('./dashBoard/navbar'));

const SideBar = lazy(() => import('./dashBoard/sidebar'));

const ChangeLanguage = lazy(() => import('./dashBoard/ChangeLanguage'));

const Login = lazy(() => import('./login/Login'));

const LanguageSelect = lazy(() => import('./login/LanguageSelect'));

const ContentBox = lazy(() => import('./dashBoard/ContentBox'));

const TabListContent = lazy(() => import('./dashBoard/TabListContent'));

//Apk app

//STANDARD
//STANDARD - Configuration

const Menu = lazy(() => import('./standard_db/Configuration/Menu/Menu'));

const User = lazy(() => import('./standard_db/Configuration/User/User'));

const Role = lazy(() => import('./standard_db/Configuration/Role/Role'));

const Document = lazy(() => import('./standard_db/Configuration/Document/Document'));

const Common = lazy(() => import('./standard_db/Configuration/Common/CommonMaster'));

// import VersionApp from './standard_db/Configuration/VersionApp/VersionApp';

//EDI
const Q1Management = lazy(() => import('./EDI/Q1Management'));
const Q2Management = lazy(() => import('./EDI/Q2Management'));
const LogFile = lazy(() => import('./EDI/Logfile'));

const Q2Policy = lazy(() => import('./standard_db/Information/Q2Policy'));
const Machine = lazy(() => import('./standard_db/Information/Machine'));

//STANDARD - Information

export {
  ScanCamera,
  ChangeLanguage,
  NavBar,
  SideBar,
  TabListContent,
  ContentBox,
  DashBoard,
  LanguageSelect,
  LoaderOverlay,
  Login,

  //STANDARD
  //STANDARD - Configuration
  Common,
  Menu,
  Role,
  User,
  Document,
//   VersionApp,
  Q1Management,
  Q2Management,
  Q2Policy,
  Machine,
  LogFile,
};
