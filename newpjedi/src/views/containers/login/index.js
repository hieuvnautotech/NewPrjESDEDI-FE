import { Login } from '@components';
import { connect } from 'react-redux';
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
//import { Login } from '@components';: Dòng này import component Login từ thư mục @components. Điều này giả định rằng có một component có tên là Login được xuất từ thư 
// mục components.

// import { connect } from 'react-redux';: Dòng này import hàm connect từ thư viện react-redux. Hàm này được sử dụng để kết nối component React với store Redux.

// import { bindActionCreators } from 'redux';: Dòng này import hàm bindActionCreators từ thư viện Redux. Hàm này được sử dụng để tự động kết hợp các hàm action creators 
// với dispatch trong Redux.

// import { CombineStateToProps, CombineDispatchToProps } from '@plugins/helperJS';: Dòng này import hai hàm CombineStateToProps và CombineDispatchToProps từ module helperJS 
// trong thư mục plugins. Có vẻ như các hàm này được sử dụng để kết hợp state và dispatch vào các component trong ứng dụng React sử dụng Redux.

// import { User_Operations } from '@appstate/user';: Dòng này import User_Operations từ module user trong thư mục appstate. Điều này có thể là các hàm hoặc hằng số liên 
// quan đến các thao tác liên quan đến người dùng trong ứng dụng Redux của bạn.

// import { Store } from '@appstate';: Dòng này import Store từ module gốc trong thư mục appstate. Điều này có thể là store chính của ứng dụng Redux của bạn, chứa toàn bộ 
// trạng thái ứng dụng.

// Tiếp theo, trong mã, User_Operations được cấu hình lại phương thức toString() để trả về chuỗi 'User_Operations'. Sau đó, mapStateToProps và mapDispatchToProps được định 
// nghĩa để ánh xạ trạng thái và hành động từ Redux store vào props của component Login. Cuối cùng, connect được sử dụng để kết nối Login với Redux store thông qua các hàm 
// mapStateToProps và mapDispatchToProps, và sau đó được xuất ra ngoài module.