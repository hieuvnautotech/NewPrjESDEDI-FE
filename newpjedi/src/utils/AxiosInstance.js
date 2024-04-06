import * as ConfigConstants from '@constants/ConfigConstants';
import axios from 'axios';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';

import store from '@states/store';
import { historyApp } from '@utils';

import { useTokenStore, useUserStore } from '@stores';
import { ErrorAlert } from '@utils';
//import * as ConfigConstants from '@constants/ConfigConstants';: Dòng này import tất cả các hằng số từ module ConfigConstants 
// trong thư mục constants. Điều này cho phép bạn sử dụng các hằng số này trong mã của mình.

// import axios from 'axios';: Dòng này import thư viện Axios để thực hiện các yêu cầu HTTP trong ứng dụng của bạn.

// import dayjs from 'dayjs';: Dòng này import thư viện Day.js để làm việc với thời gian và ngày tháng trong ứng dụng của bạn.

// import jwt_decode from 'jwt-decode';: Dòng này import thư viện jwt-decode để giải mã token JWT trong ứng dụng của bạn.

// import store from '@states/store';: Dòng này import store từ module store trong thư mục states. Điều này có thể là Redux store 
// chính của ứng dụng của bạn.

// import { historyApp } from '@utils';: Dòng này import historyApp từ module utils trong thư mục utils. Điều này có thể là một đối 
// tượng history được sử dụng để điều hướng trong ứng dụng của bạn.

// import { useTokenStore, useUserStore } from '@stores';: Dòng này import useTokenStore và useUserStore từ module stores trong thư 
// mục stores. Điều này có thể là các custom hooks được sử dụng để quản lý trạng thái token và thông tin người dùng trong ứng dụng của bạn.

// import { ErrorAlert } from '@utils';: Dòng này import ErrorAlert từ module utils trong thư mục utils. Điều này có thể là một thành 
// phần hoặc hàm được sử dụng để hiển thị cảnh báo lỗi trong ứng dụng của bạn.

// const API_URL = config.api.API_BASE_URL;
const API_URL = ConfigConstants.BASE_URL;
//Đoạn mã const API_URL = ConfigConstants.BASE_URL; đang định nghĩa một hằng số API_URL, và giá trị của nó được gán bằng giá trị của BASE_URL từ module hoặc tệp tin ConfigConstants. 
// Tuy nhiên, mã trên chỉ đơn giản là một dòng gán giá trị cho một hằng số, không có thông tin cụ thể về nội dung của ConfigConstants. Để hiểu được đoạn mã này hoạt động như thế nào và 
// giá trị của API_URL là gì, chúng ta cần xem xét nội dung của ConfigConstants. Đó là nơi mà BASE_URL được định nghĩa và gán giá trị.
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
//Đoạn mã này đang sử dụng thư viện Axios để tạo một instance Axios mới với các cài đặt cụ thể. Dưới đây là giải thích các phần của đoạn mã:
// const instance = axios.create({ ... });: Đây là cách sử dụng phương thức create() từ thư viện Axios để tạo một instance Axios mới với các cài đặt cụ thể. Instance này sau đó 
// có thể được sử dụng để thực hiện các yêu cầu HTTP như GET, POST, PUT, DELETE, vv.
// Cấu hình của instance Axios:
// baseURL: API_URL: Định nghĩa baseURL cho các yêu cầu HTTP được gửi từ instance này. Giá trị của API_URL được sử dụng làm baseURL. Điều này có nghĩa là tất cả các yêu cầu sẽ được 
// gửi đến URL được xây dựng từ API_URL cộng với các đường dẫn cụ thể của từng yêu cầu.
// withCredentials: false: Thiết lập withCredentials thành false, cho biết rằng các yêu cầu không sẽ bao gồm cookie hoặc credential (định danh) của người dùng khi gửi yêu cầu.
// headers: Đây là một đối tượng chứa các headers sẽ được gửi cùng với mỗi yêu cầu HTTP từ instance này. Trong trường hợp này, chỉ có hai headers được định nghĩa:
// 'Content-Type': 'application/json': Header Content-Type được thiết lập thành application/json, cho biết rằng dữ liệu được gửi đi và nhận lại từ server sẽ ở định dạng JSON.
// Authorization: '': Header Authorization được thiết lập thành một chuỗi rỗng ban đầu. Điều này có thể được sử dụng để gán giá trị token (ví dụ: JWT) vào header Authorization trước 
// khi gửi yêu cầu đi. 
const currentExecutingRequests = {};
// Đoạn mã const currentExecutingRequests = {}; đang định nghĩa một đối tượng JavaScript có tên là currentExecutingRequests. Đối tượng này là một biến dùng để lưu trữ thông tin về các 
// yêu cầu HTTP hiện đang được thực thi trong ứng dụng.

// Đối tượng này có dạng {} nghĩa là ban đầu không có yêu cầu nào đang thực thi, và thông tin về các yêu cầu sẽ được thêm vào đối tượng này khi chúng bắt đầu được gửi đi và sẽ được loại 
// bỏ khi chúng hoàn thành hoặc bị hủy.

// Trong các ứng dụng JavaScript phức tạp, việc theo dõi các yêu cầu HTTP đang thực thi có thể hữu ích để quản lý xung đột và kiểm soát hành vi của ứng dụng trong quá trình gửi và nhận 
// dữ liệu từ server.
const createError = (httpStatusCode, statusCode, errorMessage, problems, errorCode = '') => {
  const error = new Error();
  error.httpStatusCode = httpStatusCode;
  error.statusCode = statusCode;
  error.errorMessage = errorMessage;
  error.problems = problems;
  error.errorCode = errorCode + '';
  return error;
};
//Đoạn mã này định nghĩa một hàm có tên là createError, nhận vào các tham số là httpStatusCode, statusCode, errorMessage, problems, và errorCode, và trả về một đối tượng lỗi.

// Dưới đây là giải thích chi tiết:

// const createError = (httpStatusCode, statusCode, errorMessage, problems, errorCode = '') => { ... };: Đây là cú pháp ES6 để định nghĩa một hàm có tên là createError, nhận vào các
//  tham số httpStatusCode, statusCode, errorMessage, problems, và errorCode. Tham số errorCode có giá trị mặc định là chuỗi rỗng.

// const error = new Error();: Tạo một đối tượng lỗi mới thông qua constructor của lớp Error. Đối tượng lỗi này sẽ được tùy chỉnh bằng cách gán giá trị cho các thuộc tính của nó.

// error.httpStatusCode = httpStatusCode;: Gán giá trị của tham số httpStatusCode cho thuộc tính httpStatusCode của đối tượng lỗi.

// error.statusCode = statusCode;: Gán giá trị của tham số statusCode cho thuộc tính statusCode của đối tượng lỗi.

// error.errorMessage = errorMessage;: Gán giá trị của tham số errorMessage cho thuộc tính errorMessage của đối tượng lỗi.

// error.problems = problems;: Gán giá trị của tham số problems cho thuộc tính problems của đối tượng lỗi.

// error.errorCode = errorCode + '';: Gán giá trị của tham số errorCode cho thuộc tính errorCode của đối tượng lỗi. Trước khi gán, giá trị của errorCode được chuyển thành chuỗi thông 
// qua việc cộng thêm chuỗi rỗng.

// return error;: Trả về đối tượng lỗi đã được tạo và tùy chỉnh thông qua các giá trị được truyền vào.
export const isSuccessStatusCode = (s) => {
  // May be string or number
  const statusType = typeof s;
  return (statusType === 'number' && s === 0) || (statusType === 'string' && s.toUpperCase() === 'OK');
};
//Đoạn mã trên định nghĩa một hàm có tên là isSuccessStatusCode. Hàm này nhận vào một tham số s, có thể là một chuỗi hoặc một số. Nó kiểm tra xem giá trị của s có phải là mã trạng
//  thái HTTP thành công hay không.

// Dưới đây là giải thích cụ thể:

// export const isSuccessStatusCode = (s) => { ... };: Đây là cú pháp ES6 để định nghĩa một hàm và xuất nó ra khỏi module hiện tại với tên là isSuccessStatusCode.

// const statusType = typeof s;: Kiểm tra kiểu dữ liệu của tham số s bằng cách sử dụng toán tử typeof và lưu kết quả vào biến statusType.

// return (statusType === 'number' && s === 0) || (statusType === 'string' && s.toUpperCase() === 'OK');: Hàm trả về true nếu s là một số và có giá trị bằng 0, hoặc nếu s là một 
// chuỗi và có giá trị chữ hoa là "OK". Ngược lại, nếu s không thỏa mãn điều kiện trên, hàm sẽ trả về false. Điều này ám chỉ rằng mã trạng thái HTTP là thành công nếu có giá trị 
// là 0 hoặc là "OK" (khi viết hoa).
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
//Đoạn mã trên định nghĩa một interceptor cho các yêu cầu trước khi chúng được gửi đi (request interceptor) của instance Axios. Interceptor này được sử dụng để kiểm tra và xử lý các 
// yêu cầu trước khi chúng được gửi đi, bao gồm việc thêm token vào header Authorization nếu token còn hiệu lực hoặc thực hiện refresh token nếu token đã hết hạn.

// Dưới đây là giải thích chi tiết:

// instance.interceptors.request.use(...): Đây là cú pháp của Axios để thêm một interceptor cho các yêu cầu trước khi chúng được gửi đi. Interceptor này nhận vào hai hàm callback: một 
// hàm để xử lý khi yêu cầu thành công và một hàm để xử lý khi yêu cầu gặp lỗi.

// async (request) => { ... }: Hàm callback đầu tiên nhận vào một tham số request, đại diện cho yêu cầu HTTP được gửi đi.

// Trong hàm callback này:

// Đầu tiên, tạo một bản sao của request để làm việc, lưu vào biến originalRequest.
// Kiểm tra xem nếu có yêu cầu đang thực thi tại URL hiện tại, nếu có, hủy yêu cầu đó để tránh xung đột.
// Tiếp theo, tạo một instance mới của CancelToken từ Axios để sử dụng cho việc hủy bỏ yêu cầu.
// Gán token của CancelToken này vào cancelToken của originalRequest.
// Kiểm tra xem URL của yêu cầu có phải là URL đăng nhập hoặc URL refresh token không. Nếu là, trả về originalRequest mà không làm thêm bất kỳ xử lý nào.
// Nếu không phải, kiểm tra và xử lý token: nếu token còn hiệu lực, thêm token vào header Authorization của yêu cầu. Nếu token đã hết hạn, thực hiện refresh token bằng cách gọi instance.
// getNewAccessToken(), và sau đó cập nhật token mới và thêm vào header Authorization của yêu cầu. Nếu refresh token không thành công, thực hiện đăng xuất bằng cách gọi instance.Logout().
// Cuối cùng, trả về originalRequest.
// (err) => { return Promise.reject(err); }: Hàm callback thứ hai xử lý khi có lỗi xảy ra trong quá trình xử lý yêu cầu. Nó đơn giản là trả về một Promise bị reject với lỗi đó.
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
//Đoạn mã trên định nghĩa một interceptor cho các phản hồi từ server (response interceptor) của instance Axios. Interceptor này được sử dụng để kiểm tra và xử lý các phản hồi từ 
// server trước khi chúng được trả về cho phần gọi yêu cầu.

// Dưới đây là giải thích chi tiết:

// instance.interceptors.response.use(...): Đây là cú pháp của Axios để thêm một interceptor cho các phản hồi từ server. Interceptor này nhận vào hai hàm callback: một hàm để xử lý
//  khi phản hồi thành công và một hàm để xử lý khi phản hồi gặp lỗi.

// async (response) => { ... }: Hàm callback đầu tiên nhận vào một tham số response, đại diện cho phản hồi từ server.

// Trong hàm callback này:

// Kiểm tra xem nếu có yêu cầu đang thực thi tại URL của phản hồi, nếu có, xóa yêu cầu đó khỏi danh sách các yêu cầu đang thực thi.
// Tiếp theo, kiểm tra nếu có dữ liệu trong phản hồi (response.data), và thực hiện xử lý tùy thuộc vào nội dung của dữ liệu này.
// Nếu mã trạng thái HTTP của phản hồi là 401 (Unauthenticated), và có một trong các thông báo phản hồi là 'login.lost_authorization' hoặc 'token.access_token.invalid', thực hiện 
// đăng xuất bằng cách gọi instance.Logout().
// Nếu mã trạng thái HTTP của phản hồi là 401 (Unauthenticated), và thông báo phản hồi là 'general.unauthorized', có thể thực hiện xử lý hiển thị thông báo lỗi hoặc thực hiện các 
// hành động khác tùy thuộc vào ngôn ngữ của người dùng.
// Trả về dữ liệu của phản hồi (response.data).
// async (error) => { ... }: Hàm callback thứ hai xử lý khi có lỗi xảy ra trong quá trình xử lý phản hồi từ server. Nó kiểm tra xem lỗi có phải là do yêu cầu bị hủy hay không, nếu có, 
// sẽ trả về một Promise không thực hiện bất kỳ hành động nào. Nếu không phải là yêu cầu bị hủy, sẽ xóa yêu cầu đó khỏi danh sách các yêu cầu đang thực thi và trả về lỗi đó để được xử 
// lý bên ngoài interceptor.
instance.getNewAccessToken = async () => {
  const token = useTokenStore.getState();
  let postObj = {
    expiredToken: token.accessToken,
    refreshToken: token.refreshToken,
  };

  return await instance.post(API_URL + '/api/refreshtoken', postObj);
};
//Đoạn mã trên định nghĩa một phương thức mới cho đối tượng instance của Axios, có tên là getNewAccessToken. Phương thức này được sử dụng để gửi một yêu cầu POST đến 
// endpoint /api/refreshtoken để lấy access token mới thông qua việc refresh token.

// Dưới đây là giải thích chi tiết:

// instance.getNewAccessToken = async () => { ... }: Định nghĩa một phương thức mới cho đối tượng instance. Phương thức này không nhận bất kỳ tham số nào.

// Trong hàm này:

// Lấy thông tin về token hiện tại từ trạng thái lưu trữ (sử dụng useTokenStore.getState()).
// Tạo một đối tượng postObj chứa các thông tin cần gửi đi trong yêu cầu POST, bao gồm access token hết hạn (expiredToken) và refresh token (refreshToken).
// Sử dụng phương thức POST của instance để gửi yêu cầu đến endpoint /api/refreshtoken, với dữ liệu được gửi là postObj.
// Trả về kết quả của yêu cầu POST. Do sử dụng await, nên hàm sẽ trả về một promise, kết quả của promise này sẽ là kết quả của yêu cầu POST sau khi được hoàn thành.
// Đoạn mã này được thiết kế để lấy access token mới thông qua việc gửi yêu cầu POST đến endpoint /api/refreshtoken, và sau đó xử lý kết quả trả về để cập nhật access token
//  mới nếu quá trình refresh token thành công.
instance.Logout = async (e) => {
  try {
    await handleLogout();
  } catch (error) {
    console.log(`logout error: ${error}`);
  }
};
//Đoạn mã trên định nghĩa một phương thức mới cho đối tượng instance của Axios, có tên là Logout. Phương thức này được sử dụng để thực hiện quá trình đăng xuất (logout) của người dùng 
// từ hệ thống.

// Dưới đây là giải thích chi tiết:

// instance.Logout = async (e) => { ... }: Định nghĩa một phương thức mới cho đối tượng instance. Phương thức này nhận vào một tham số e, tuy nhiên trong cấu trúc của hàm này, tham số này 
// không được sử dụng.

// Trong hàm này:

// Sử dụng cấu trúc try...catch để bắt các lỗi có thể xảy ra trong quá trình thực hiện logout.
// Trong khối try:
// Gọi hàm handleLogout() để thực hiện quá trình đăng xuất.
// Trong khối catch:
// Nếu có lỗi xảy ra trong quá trình đăng xuất, thông tin lỗi sẽ được log ra console để ghi nhận và phân tích.
// Phương thức này là một phần của việc quản lý đăng xuất người dùng từ hệ thống. Hàm handleLogout() được gọi trong phần try có thể chứa các logic cụ thể liên quan đến quá trình đăng xuất,
//  như gửi yêu cầu đến server để huỷ bỏ access token, xóa thông tin người dùng từ trạng thái lưu trữ, v.v.
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
//Đoạn mã trên định nghĩa hàm handleLogout, được sử dụng để thực hiện quá trình đăng xuất người dùng khỏi hệ thống. Sau đó, đoạn mã xuất đối tượng instance của Axios cùng với các 
// interceptor đã được định nghĩa ở trước đó.

// Dưới đây là giải thích chi tiết:

// const handleLogout = async () => { ... }: Định nghĩa hàm handleLogout, được sử dụng để thực hiện quá trình đăng xuất người dùng khỏi hệ thống.

// Khởi tạo các tùy chọn (options) cho yêu cầu gửi đến endpoint /api/logout. Tùy chọn này bao gồm:
// withCredentials: false: Không gửi cookie hay thông tin xác thực cùng yêu cầu.
// method: 'POST': Phương thức HTTP được sử dụng để gửi yêu cầu là POST.
// headers: Đặt tiêu đề yêu cầu, bao gồm 'Content-Type' là 'application/json' và 'Authorization' được xác định sau.
// Lấy access token hiện tại từ trạng thái lưu trữ sử dụng useTokenStore.getState().accessToken.
// Lấy các phương thức để loại bỏ token, đặt trạng thái kick out và thông báo kick out từ trạng thái lưu trữ người dùng.
// Kiểm tra xem access token có tồn tại không. Nếu tồn tại, thiết lập tiêu đề 'Authorization' của yêu cầu là 'Bearer <accessToken>', nếu không sẽ sử dụng một token giả là 'logout_token'.
// Sử dụng fetch để gửi yêu cầu POST đến endpoint /api/logout với các tùy chọn đã được thiết lập trước đó.
// Sau khi nhận được kết quả từ server, chuyển đổi kết quả thành đối tượng JSON bằng .json().
// Nếu kết quả trả về có thuộc tính ResponseMessage bằng 'general.success', thực hiện các hành động sau:
// Loại bỏ token khỏi trạng thái lưu trữ.
// Loại bỏ thông tin người dùng khỏi trạng thái lưu trữ.
// Đặt trạng thái kick out và thông báo kick out trong trạng thái lưu trữ người dùng.
// Gửi một hành động Redux để xóa tất cả dữ liệu trên trang Dashboard.
// Chuyển hướng người dùng đến trang '/logout' sử dụng historyApp.push().
// export { instance };: Xuất đối tượng instance của Axios để có thể sử dụng trong các module khác của ứng dụng.