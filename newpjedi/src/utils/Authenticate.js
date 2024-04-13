import React from 'react';
import { Redirect } from 'react-router-dom';
import { resetStores, useUserStore } from '@stores';

const firstLogin = {};
const isAuthenticate = () => {
    let isAuthen = false;
    const currentUser = useUserStore.getState().user;
    if (currentUser) {
      if (currentUser.userId) {
        isAuthen = true;
      }
    }
    return isAuthen;
  };
  //Đoạn mã trên định nghĩa một hàm có tên là isAuthenticate. Hàm này được sử dụng để kiểm tra xem người dùng đã được xác thực hay 
  //chưa trong ứng dụng. Dưới đây là cách hoạt động của hàm này:

//Khởi tạo một biến isAuthen với giá trị mặc định là false, đại diện cho việc người dùng chưa được xác thực.

//Sử dụng một hàm hoặc một giải pháp quản lý trạng thái để lấy thông tin người dùng hiện tại. Trong trường hợp này, sử dụng 
//useUserStore.getState().user để truy xuất thông tin người dùng từ một cửa hàng trạng thái. Có thể giả định rằng useUserStore 
//là một hook hoặc một giải pháp quản lý trạng thái khác được sử dụng trong ứng dụng.

//Kiểm tra xem có một currentUser được trả về không, và nếu có, kiểm tra xem currentUser có chứa một userId hay không.

//Nếu currentUser không phải là null và có một userId, thì isAuthen được gán giá trị true, đại diện cho việc người dùng đã được 
//xác thực.

//Cuối cùng, hàm trả về giá trị của isAuthen, cho biết liệu người dùng có được xác thực hay không.

//Với cách hoạt động như vậy, isAuthenticate có thể được sử dụng để kiểm tra xác thực trong ứng dụng và quyết định xem người dùng 
//có được phép truy cập vào các phần của ứng dụng hay không.

const AuthenticateRoute = (Component, route) => (props) => {
    if (!isAuthenticate()) {
      return <Redirect to={route || '/login'} />;
    }
    if (Component === null) {
      return null;
    }
  
    return <Component {...props} />;
  };
  //Đoạn mã trên định nghĩa một hàm có tên AuthenticateRoute. Đây là một higher-order component (HOC) trong React, được sử dụng 
  //để kiểm tra xem người dùng có được xác thực hay không trước khi cho họ truy cập vào một thành phần cụ thể.

//Component: Đây là thành phần (component) mà chúng ta muốn kiểm tra xác thực trước khi render. Được truyền vào như là một tham số.

//route: Đây là đường dẫn mà người dùng sẽ được chuyển hướng đến nếu họ chưa được xác thực. Mặc định là '/login'.

//props: Đây là các thuộc tính được truyền xuống cho thành phần (component) được render.

//Hàm AuthenticateRoute trả về một hàm khác như sau:

//Nếu người dùng chưa được xác thực (!isAuthenticate()), thì sẽ chuyển hướng người dùng đến đường dẫn được chỉ định (hoặc '/login' 
//nếu không được chỉ định) bằng cách sử dụng component Redirect từ thư viện react-router-dom.

//Nếu Component được truyền vào là null, thì sẽ trả về null.

//Nếu không phải trường hợp trên, tức là người dùng đã được xác thực và Component không phải là null, thì sẽ render Component đó 
//với các props được truyền vào.

//Như vậy, hàm AuthenticateRoute được sử dụng để bảo vệ một thành phần bằng cách kiểm tra xác thực trước khi hiển thị nó.
const NotAuthenticateRoute = (Component, route) => (props) => {
  if (isAuthenticate()) {
    return <Redirect to={route || '/'} />;
  }

  if (Component === null) {
    return null;
  }
  return <Component {...props} />;
};
//Hàm này nhận vào hai đối số: Component và route.

// Component: Là một thành phần React (hoặc một hàm trả về JSX) mà bạn muốn bảo vệ. Nếu người dùng chưa xác thực (không đăng nhập), Component sẽ được hiển thị; nếu không, 
// người dùng sẽ được chuyển hướng đến đường dẫn được xác định hoặc trang chính ('/').
// route: Đường dẫn mà người dùng sẽ được chuyển hướng đến nếu họ không xác thực. Mặc định, nếu không có đường dẫn được chỉ định, người dùng sẽ được chuyển hướng đến trang chính.
// Nó hoạt động như sau:

// Hàm isAuthenticate() được gọi để kiểm tra xem người dùng đã xác thực hay chưa.
// Nếu người dùng đã xác thực, họ sẽ được chuyển hướng đến đường dẫn được xác định (hoặc trang chính).
// Nếu Component được truyền vào là null, hàm sẽ trả về null.
// Nếu người dùng chưa xác thực và Component không phải là null, Component sẽ được hiển thị với các props được truyền vào.
// Đoạn mã này có thể được sử dụng để bảo vệ các tuyến đường trong ứng dụng React, đảm bảo rằng chỉ có người dùng đã xác thực mới có thể truy cập vào những tuyến đường được bảo vệ


const LogoutRoute = () => (props) => {
  logOut();
  return <Redirect to={'/'} />;
};
const logOut = () => {
  resetStores.resetAllStores();
};
//Đoạn mã này là một hàm cao cấp trong React được gọi là LogoutRoute. Hàm này không nhận bất kỳ đối số nào và trả về một hàm khác.

// Hàm được trả về nhận vào props (có thể là các props được chuyển đến từ React Router, chẳng hạn như history), nhưng trong trường hợp này không sử dụng props.
// Đầu tiên, hàm này gọi hàm logOut() để đăng xuất người dùng.
// Sau đó, nó sử dụng <Redirect> từ react-router-dom để chuyển hướng người dùng đến trang chính (được định nghĩa là '/ ').
// Hàm logOut() là một hàm độc lập mà bạn định nghĩa bên dưới. Nó chỉ gọi hàm resetAllStores() từ một đối tượng resetStores.

// Tóm lại, LogoutRoute được sử dụng để xử lý việc đăng xuất người dùng trong ứng dụng React và chuyển hướng họ đến trang chính sau khi họ đăng xuất.
export {
  firstLogin,
  isAuthenticate,
  AuthenticateRoute,
  NotAuthenticateRoute,
  logOut,
  LogoutRoute,
};