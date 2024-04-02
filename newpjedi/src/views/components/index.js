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
//Đoạn mã JavaScript này sử dụng các phương thức và thuộc tính của thư viện React để tạo ra các thành phần (components) được tải một cách lười biếng (lazy loading). 
// Điều này có nghĩa là các thành phần sẽ không được tải ngay khi ứng dụng được khởi chạy, mà thay vào đó, chúng sẽ được tải chỉ khi cần thiết, giúp cải thiện hiệu suất 
// và tốc độ tải của ứng dụng.

// Dưới đây là một số chi tiết cụ thể:

// import { lazy } from 'react';: Dòng này import hàm lazy từ thư viện React, được sử dụng để tải các component một cách lười biếng.

// Các dòng sau đó định nghĩa và tải các component bằng cách sử dụng hàm lazy() kèm theo import():

// ScanCamera: Một thành phần được tải lười biếng từ tệp './ScanCamera'.
// DashBoard: Một thành phần được tải lười biếng từ tệp './dashBoard'.
// NavBar: Một thành phần được tải lười biếng từ tệp './dashBoard/navbar'.
// SideBar: Một thành phần được tải lười biếng từ tệp './dashBoard/sidebar'.
// ChangeLanguage: Một thành phần được tải lười biếng từ tệp './dashBoard/ChangeLanguage'.
// Login: Một thành phần được tải lười biếng từ tệp './login/Login'.
// LanguageSelect: Một thành phần được tải lười biếng từ tệp './login/LanguageSelect'.
// ContentBox: Một thành phần được tải lười biếng từ tệp './dashBoard/ContentBox'.
// TabListContent: Một thành phần được tải lười biếng từ tệp './dashBoard/TabListContent'.
// Điều này giúp tăng hiệu suất của ứng dụng React bằng cách tối ưu hóa việc tải các thành phần, chỉ tải chúng khi cần thiết.
//Apk app

//STANDARD
//STANDARD - Configuration

const Menu = lazy(() => import('./standard_db/Configuration/Menu/Menu'));

const User = lazy(() => import('./standard_db/Configuration/User/User'));

const Role = lazy(() => import('./standard_db/Configuration/Role/Role'));

const Document = lazy(() => import('./standard_db/Configuration/Document/Document'));

const Common = lazy(() => import('./standard_db/Configuration/Common/CommonMaster'));
//Cụ thể:

// Menu, User, Role, Document, Common: Đây là các thành phần (components) trong ứng dụng của bạn.

// Các dòng sau đó định nghĩa và tải các component bằng cách sử dụng hàm lazy() kèm theo import():

// Menu: Thành phần Menu được tải lười biếng từ tệp './standard_db/Configuration/Menu/Menu'.
// User: Thành phần User được tải lười biếng từ tệp './standard_db/Configuration/User/User'.
// Role: Thành phần Role được tải lười biếng từ tệp './standard_db/Configuration/Role/Role'.
// Document: Thành phần Document được tải lười biếng từ tệp './standard_db/Configuration/Document/Document'.
// Common: Thành phần CommonMaster được tải lười biếng từ tệp './standard_db/Configuration/Common/CommonMaster'.

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
