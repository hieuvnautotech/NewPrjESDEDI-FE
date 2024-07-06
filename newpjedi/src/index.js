import { Suspense } from 'react';
//Suspense là một thành phần (component) trong React được sử dụng để xử lý việc chờ đợi dữ liệu hoặc code được tải xuống từ server. 
// Nó giúp quản lý quá trình render của ứng dụng trong khi dữ liệu đang được tải, đồng thời hiển thị giao diện người dùng thích hợp trong suốt quá trình này.

// Khi sử dụng Suspense, bạn có thể bọc bất kỳ phần nào của ứng dụng mà cần phải đợi dữ liệu hoặc code, và React sẽ tự động quản lý 
// việc hiển thị giao diện thích hợp cho đến khi dữ liệu hoặc code được tải xuống. Thường thì, bạn sẽ sử dụng Suspense kết hợp với React.lazy() để 
// tải các component động, hoặc với React.lazy() và React.Suspense để tải trang web động.
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//Provider là một thành phần (component) trong React Redux, được sử dụng để cung cấp Redux store cho toàn bộ ứng dụng React. Khi sử dụng Provider, 
// Redux store sẽ trở thành một phần của context trong ứng dụng, cho phép các thành phần con của ứng dụng truy cập store một cách dễ dàng thông qua 
// các hàm như connect().

// Thường thì, bạn sẽ sử dụng Provider ở cấp cao nhất của ứng dụng React, ví dụ như trong file index.js hoặc App.js, để đảm bảo rằng Redux store sẽ 
// được cung cấp cho toàn bộ ứng dụng.
import { I18nextProvider } from 'react-i18next';
import IntlProviderWrapper from './hoc/IntlProviderWrapper';

import 'font-awesome/css/font-awesome.min.css';
import i18n from './i18n';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '@mdi/font/css/materialdesignicons.css';
import 'jquery.fancytree/dist/skin-lion/ui.fancytree.less'; // CSS or LESS
import 'react-photo-view/dist/react-photo-view.css';
import 'react-toastify/dist/ReactToastify.css';

//import "aos/dist/aos.css";
import '@styles/css/adminlte.min.css';
import '@styles/flag-icon-css/css/flag-icons.css';
import '@styles/less/app.less';
import '@styles/less/tool.less';
import './styles/css/App.css';

import 'bootstrap';
import 'jquery';
import 'jquery-ui';

import { LoaderOverlay } from '@components';

import '../static/zebra/BrowserPrint-3.0.216.min.js';

import store, { persistor } from './states/store';

// import { AuthenticateRoute, NotAuthenticateRoute, LogoutRoute } from '@utils/Authenticate';
import App from './views/App';

import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// import { APP_VERSION } from '@constants/ConfigConstants';

import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey(
  'ce328e61b3cf317e812525f11a07272bTz01Mzg1NCxFPTE2OTk0MTE1NzIxODgsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});
// replace console.* for disable log on production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`/service-worker.js`).then((registration) => {
        let worker;
        if (registration.installing) {
          worker = registration.installing;
        } else if (registration.waiting) {
          worker = registration.waiting;
        } else if (registration.active) {
          worker = registration.active;
        }
      });
    });
  }
}

// index.js (hoặc index.tsx)

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <IntlProviderWrapper>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<LoaderOverlay />}>
            <CssBaseline />
            <App persistor={persistor} />
          </Suspense>
        </ThemeProvider>
      </IntlProviderWrapper>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
if (module && module.hot) module.hot.accept();
