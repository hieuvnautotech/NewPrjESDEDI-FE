import { axios } from '@utils';
import { LOGIN_URL } from '@constants/ConfigConstants';

export const handleLogin = async (userName, userPassword) => {
  try {
    return await axios.post(LOGIN_URL, {
      userName: userName,
      userPassword: userPassword,
      isOnApp: false,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getUserInfo = async () => {
  try {
    return await axios.get('/api/login/user-info');
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const handleLogout = async () => {
  return await axios.post('/api/logout', {});
};

// export {
//     handleLogin,
//     getUserInfo,
//     handleLogout,
// }

//Mã trên đây định nghĩa một số hàm thực hiện các yêu cầu HTTP sử dụng thư viện Axios thông qua đối tượng axios được import từ @utils, cùng với các URL được import từ 
// @constants/ConfigConstants. Dưới đây là giải thích cụ thể cho từng phần trong mã:

// import { axios } from '@utils';: Dòng này import đối tượng axios từ module @utils. Đối tượng này có thể là một instance của Axios đã được cấu hình trước đó với các thiết 
// lập cụ thể, như interceptors, baseURL, headers, vv.

// import { LOGIN_URL } from '@constants/ConfigConstants';: Dòng này import hằng LOGIN_URL từ module @constants/ConfigConstants. Điều này giả định rằng LOGIN_URL chứa URL cho 
// endpoint API để thực hiện đăng nhập trong ứng dụng của bạn.

// export const handleLogin = async (userName, userPassword) => { ... };: Định nghĩa một hàm handleLogin nhận vào userName và userPassword, sau đó thực hiện một yêu cầu POST đến 
// LOGIN_URL với thông tin đăng nhập được cung cấp. Nếu yêu cầu thành công, hàm sẽ trả về dữ liệu phản hồi từ server.

// export const getUserInfo = async () => { ... };: Định nghĩa một hàm getUserInfo để thực hiện một yêu cầu GET đến endpoint /api/login/user-info để lấy thông tin người dùng từ server.

// export const handleLogout = async () => { ... };: Định nghĩa một hàm handleLogout để thực hiện một yêu cầu POST đến endpoint /api/logout để đăng xuất người dùng.

// Cả ba hàm đều sử dụng try...catch để bắt các lỗi xảy ra trong quá trình thực hiện yêu cầu HTTP, và log ra console nếu có lỗi xảy ra.