
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
//Constructor: Khởi tạo state của component với một thuộc tính hasError được đặt mặc định là false.

// static getDerivedStateFromError(error): Một phương thức static của class ErrorBoundary được sử dụng để cập nhật state khi có lỗi xảy ra trong các component con. 
// Nếu có lỗi, nó sẽ trả về một đối tượng state với thuộc tính hasError được đặt thành true.

// componentDidCatch(error, errorInfo): Một phương thức được gọi khi có lỗi xảy ra trong các component con. Phương thức này được sử dụng để ghi lại thông tin về lỗi 
// và có thể thực hiện các hành động như gửi báo cáo lỗi đến một dịch vụ lỗi.

// render(): Phương thức render của component. Nếu state hasError là true, component sẽ render một giao diện thay thế để hiển thị thông báo lỗi cho người dùng. 
// Nếu không, nó sẽ render các component con bên trong ErrorBoundary.

// Đoạn mã này sử dụng cơ chế Error Boundary để bắt và xử lý các lỗi xảy ra trong các component con của nó một cách graceful, tránh việc crash hoàn toàn ứng dụng.

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
//Đoạn mã trên định nghĩa ba components React: RouteWrapperLogin, RouteWrapperRoot, và RouteWrapperLogout. Mỗi component này là một wrapper cho các route trong ứng dụng.

// RouteWrapperLogin: Đây là một wrapper cho route đăng nhập. Nó sử dụng một hàm NotAuthenticateRoute để bảo vệ route, nghĩa là route này chỉ được truy cập khi người dùng 
// chưa đăng nhập. Nếu người dùng đã đăng nhập, họ sẽ được chuyển hướng về trang chính.

// RouteWrapperRoot: Đây là một wrapper cho route gốc của ứng dụng. Nó sử dụng một hàm AuthenticateRoute để bảo vệ route, nghĩa là route này chỉ được truy cập khi người dùng 
// đã đăng nhập. Nếu người dùng chưa đăng nhập, họ sẽ được chuyển hướng về trang đăng nhập.

// RouteWrapperLogout: Đây là một wrapper cho route đăng xuất. Nó sử dụng một hàm LogoutRoute để xử lý đăng xuất người dùng.

// Tất cả các component này nhận các props và chuyển chúng xuống cho component được bao bọc bên trong của chúng. Điều này cho phép bạn truyền các props từ các route cha xuống 
// các component con bên trong.

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
//Đoạn mã trên là một component React có tên là App. Component này là một phần chính của ứng dụng React và được sử dụng để render ra giao diện người dùng và quản lý các thành phần khác 
//trong ứng dụng.

// Dưới đây là mô tả các phần chính của component App:

// Khởi tạo OneSignal: Dòng mã window.OneSignal = window.OneSignal || []; được sử dụng để đảm bảo rằng biến OneSignal đã được khởi tạo.

// Khởi tạo State: Component sử dụng Hook useState để khởi tạo state bootstrapped và isOnline, lần lượt là trạng thái của quá trình khởi tạo ứng dụng và trạng thái kết nối mạng của 
//người dùng.

// Xử lý khởi tạo persistor: Hàm handlePersistorState được sử dụng để xử lý trạng thái của persistor (cơ chế lưu trữ) và đảm bảo rằng ứng dụng đã được khởi tạo hoàn toàn trước khi 
//hiển thị giao diện.

// Effect Hooks: Sử dụng Hook useEffect để thực hiện các tác vụ phụ thuộc vào trạng thái hoặc vòng đời của component. Cụ thể, sử dụng để theo dõi trạng thái kết nối mạng của người 
//dùng và xử lý các sự kiện online và offline.

// Render: Trong phần render, component App render ra một fragment chứa một ErrorBoundary và một CustomRouter (một thành phần tùy chỉnh của Router), trong đó ErrorBoundary được sử 
//dụng để bắt lỗi và CustomRouter 
// là nơi quản lý các route của ứng dụng. Các route được định nghĩa thông qua các thành phần Route với các đường dẫn khác nhau và được bao bọc trong các components RouteWrapperLogin, 
//RouteWrapperLogout, và RouteWrapperRoot.

// const LOGIN_URL = 'http://localhost:5141/api/Login/check-login'
//Tóm lại
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









