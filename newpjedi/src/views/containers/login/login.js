import { Login } from '@components';
import { connect } from 'react-redux';
// Dòng mã import { connect } from 'react-redux'; là một phần của thư viện react-redux. Thư viện này cung cấp các công cụ giúp kết nối ứng dụng React với Redux, 
// một thư viện quản lý trạng thái cho ứng dụng JavaScript.

// Trong Redux, để kết nối component React với Redux store, chúng ta sử dụng hàm connect(). Hàm này tạo ra một Higher Order Component (HOC) mới, giúp component có 
// thể truy cập vào state và dispatch các actions từ Redux store thông qua props.

// Dòng mã import { connect } from 'react-redux'; chỉ đơn giản là nhập hàm connect từ thư viện react-redux vào trong file JavaScript của bạn. Khi có dòng này, bạn 
// có thể sử dụng hàm connect để kết nối component của bạn với Redux store.
import { bindActionCreators } from 'redux';
import { CombineStateToProps, CombineDispatchToProps } from '@plugins/helperJS';
import { User_Operations } from '@appstate/user';
import { Store } from '@appstate';

User_Operations.toString = () => {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  return { language };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
