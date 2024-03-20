
import { Redirect } from 'react-router-dom';
import { resetStores, useUserStore } from '@stores';


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



const LogoutRoute = () => (props) => {
  logOut();
  return <Redirect to={'/'} />;
};
const logOut = () => {
  resetStores.resetAllStores();
};
export {
  
  isAuthenticate,
  AuthenticateRoute,
  NotAuthenticateRoute,
  LogoutRoute,
};