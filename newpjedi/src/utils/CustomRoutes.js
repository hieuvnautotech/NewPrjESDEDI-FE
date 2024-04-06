import React from 'react';
import { Router } from 'react-router-dom';

const CustomRouter = ({ basename, children, history }) => {
  //   const [state, setState] = React.useState({
  //     action: history.action,
  //     location: history.location,
  //   });
  // React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      history={history}
      basename={basename}
      children={children}
      //   location={state.location}
      //   navigationType={state.action}
    />
  );
};

export default CustomRouter;
//
// Mã trên đây định nghĩa một component React có tên CustomRouter, mục đích chính là để wrap một Router từ thư viện react-router-dom, 
// nhưng cung cấp thêm một số tính năng tùy chỉnh nếu cần. Dưới đây là giải thích cụ thể:

// import React from 'react';: Import thư viện React để có thể sử dụng React.

// import { Router } from 'react-router-dom';: Import component Router từ thư viện react-router-dom, được sử dụng để tạo ra một router 
// cho ứng dụng React.

// const CustomRouter = ({ basename, children, history }) => { ... }: Định nghĩa một functional component có tên CustomRouter, nhận vào 
// các props basename, children, và history. Trong đó:

// basename: là một chuỗi đại diện cho URL base của ứng dụng.
// children: là các components con được render bên trong router.
// history: là đối tượng history được truyền vào từ bên ngoài (ví dụ như history được tạo bằng createBrowserHistory).
// Phần comment đã được bỏ đi, có thể là một phần của mã được tạm thời tắt đi hoặc đã không còn cần thiết.

// Component trả về:

// Router: Component Router được render với các props được truyền vào như history, basename, và children. history và basename sẽ 
// được truyền trực tiếp từ props vào component Router.
// children: Là các components con của router, được truyền vào thông qua props.
// export default CustomRouter;: Export CustomRouter để có thể sử dụng nó trong các phần khác của ứng dụng React của bạn.