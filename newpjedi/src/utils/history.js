import { createBrowserHistory } from 'history';
const historyApp = createBrowserHistory();

const historyDashboard = createBrowserHistory();
export { historyDashboard, historyApp };
//Mã trên định nghĩa hai đối tượng history bằng cách sử dụng hàm createBrowserHistory từ thư viện history, một thư viện được sử dụng để 
// quản lý lịch sử duyệt web trong ứng dụng React. Dưới đây là giải thích cụ thể:

// import { createBrowserHistory } from 'history';: Dòng này import hàm createBrowserHistory từ thư viện history, cung cấp phương tiện cho 
// việc tạo ra một đối tượng history mới.

// const historyApp = createBrowserHistory();: Dòng này sử dụng hàm createBrowserHistory() để tạo ra một đối tượng history mới, được gán 
// vào biến historyApp. Đối tượng history này sẽ quản lý lịch sử duyệt của ứng dụng trong phạm vi toàn cầu.

// const historyDashboard = createBrowserHistory();: Dòng này tạo ra một đối tượng history mới khác và gán vào biến historyDashboard. Đối 
// tượng này có thể được sử dụng để quản lý lịch sử duyệt cho một phần cụ thể của ứng dụng, có thể là trang Dashboard.

// export { historyDashboard, historyApp };: Dòng này export hai đối tượng history (historyDashboard và historyApp) để có thể sử dụng 
// chúng trong các phần khác của ứng dụng React của bạn. Điều này cho phép bạn sử dụng chúng để điều hướng và quản lý lịch sử duyệt trong 
// ứng dụng của mình.