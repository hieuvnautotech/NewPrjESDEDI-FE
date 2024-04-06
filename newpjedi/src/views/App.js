
import { DashBoard, Login } from '@containers';
import { historyApp } from '@utils';
import { AuthenticateRoute, LogoutRoute, NotAuthenticateRoute } from '@utils/Authenticate';
import CustomRouter from '@utils/CustomRoutes';
import React, { Component, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
// import OneSignal from 'react-onesignal';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị UI thay thế khi có lỗi xảy ra
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Ghi lại thông tin lỗi, có thể gửi báo cáo lỗi đến một dịch vụ lỗi
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Hiển thị UI thay thế khi có lỗi xảy ra
      return (
        <div className="error-component">
          <div className="error-header"></div>
          <div className="container">
            <section className="error-container text-center">
              <h1>ERROR CODE 500</h1>
              <div className="error-divider">
                <h2>ooops!!</h2>
                <p className="description">SOMETHING WENT WRONG.</p>
              </div>
              <a href="/" className="return-btn" style={{ backgroundColor: '#ff1493' }}>
                <i className="fa fa-arrow-circle-left"></i>&nbsp;Back to home page
              </a>
            </section>
          </div>
        </div>
      );
    }

    // Hiển thị các component con bên trong ErrorBoundary
    return this.props.children;
  }
}

const RouteWrapperLogin = (props) => {
  const ComponentWrapper = NotAuthenticateRoute(Login, '/');
  return <ComponentWrapper {...props} />;
};

const RouteWrapperRoot = (props) => {
  const ComponentWrapper = AuthenticateRoute(DashBoard, '/login');

  return <ComponentWrapper {...props} />;
};

const RouteWrapperLogout = (props) => {
  const ComponentWrapper = LogoutRoute();
  return <ComponentWrapper {...props} />;
};


const App = (props) => {
  window.OneSignal = window.OneSignal || [];

  const { persistor } = props;
  const [bootstrapped, setBootstrapped] = useState(false);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handlePersistorState = async () => {
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      try {
        if (props.onBeforeLift) {
          await Promise.resolve(props.onBeforeLift());
        }
        setBootstrapped(true);
      } catch (error) {
        setBootstrapped(true);
      }
    }
  };

  useEffect(() => {
    handlePersistorState();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <React.Fragment>
      <ErrorBoundary>
        <CustomRouter history={historyApp}>
          <Switch>
            <Route exact path="/login" component={RouteWrapperLogin} />
            <Route exact path="/logout" component={RouteWrapperLogout} />
            <Route path="/" render={() => <RouteWrapperRoot />} />
          </Switch>
        </CustomRouter>
      </ErrorBoundary>
    </React.Fragment>
  );
};

export default App;

// const LOGIN_URL = 'http://localhost:5141/api/Login/check-login'

//Đoạn mã này là một ứng dụng React với React Router được sử dụng để quản lý routing. Dưới đây là các điểm chính:

// Import các thành phần và thư viện: Đầu tiên, các thành phần DashBoard và Login được import từ @containers, historyApp được import từ @utils, và các hàm AuthenticateRoute, 
// LogoutRoute, và NotAuthenticateRoute được import từ @utils/Authenticate. Ngoài ra, CustomRouter, React, Component, useEffect, useState, Route, và Switch cũng được import từ các
//  thư viện tương ứng.

// Component ErrorBoundary: Đây là một component dùng để bắt lỗi trong ứng dụng React. Nếu có lỗi xảy ra trong các component con của nó, ErrorBoundary sẽ hiển thị một giao diện 
// thay thế thay vì gây ra sự cố trên toàn ứng dụng.

// Các Route Wrapper Components: Có ba components RouteWrapperLogin, RouteWrapperRoot, và RouteWrapperLogout, mỗi component này là một hàm arrow function nhận props và render một 
// component khác dựa trên logic nhất định. Cụ thể, RouteWrapperLogin render một component Login với điều kiện chưa xác thực, RouteWrapperRoot render một component Dashboard với 
// điều kiện đã xác thực, và RouteWrapperLogout render một component trống (một cách để xử lý việc đăng xuất).

// Component App: Đây là component chính của ứng dụng. Nó sử dụng React hooks useState và useEffect để quản lý trạng thái và các tác động phụ. Trong nội dung của nó, nó sử dụng 
// ErrorBoundary để bao bọc toàn bộ ứng dụng và sử dụng CustomRouter, Switch, và các Route components từ react-router-dom để xác định routing của ứng dụng dựa trên các đường dẫn
//  được xác định.









