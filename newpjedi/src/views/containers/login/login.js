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
//import { bindActionCreators } from 'redux';: Dòng này nhúng phương thức bindActionCreators từ thư viện Redux vào mã của bạn. Phương thức này được sử dụng để tự 
// động tạo các hàm "action creator" cho bạn từ các hàm action mà bạn đã định nghĩa, giúp bạn gửi các actions tới store Redux một cách dễ dàng hơn.

// import { CombineStateToProps, CombineDispatchToProps } from '@plugins/helperJS';: Dòng này có vẻ như bạn đang import hai hàm CombineStateToProps và CombineDispatchToProps 
// từ một module helperJS trong dự án của bạn. Có thể đây là các hàm giúp bạn kết hợp state và dispatch vào các component trong ứng dụng React sử dụng Redux.

// import { User_Operations } from '@appstate/user';: Dòng này import User_Operations từ module @appstate/user. Điều này có thể là một tập hợp các hàm hoặc hằng số liên quan 
// đến thao tác với dữ liệu người dùng trong ứng dụng của bạn, có thể là các hàm action, reducers hoặc selectors.

// import { Store } from '@appstate';: Dòng này import một đối tượng Store từ module @appstate. Điều này có thể là store chính của ứng dụng Redux của bạn, chứa toàn bộ trạng 
// thái ứng dụng.

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

//User_Operations.toString = () => { return 'User_Operations'; };: Đoạn mã này gắn một phương thức toString() mới vào User_Operations. Khi được gọi, phương thức này sẽ trả 
// về chuỗi 'User_Operations'. Điều này có thể hữu ích trong việc gỡ lỗi hoặc debug.

// `const mapStateToProps = (state) => {
//   const {
//   User_Reducer: { language },
//   } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);
  
//   return { language };
//   };: Đây là một hàm mapStateToProps trong Redux, được sử dụng để lấy dữ liệu từ store Redux và ánh xạ chúng thành props của component. Trong trường hợp này, hàm này trích 
//   xuất trường languagetừ trạng thái global của ứng dụng, được lưu trữ trongUser_Reducer. Sau đó, nó trả về một đối tượng chứa trường language` là một props.
  
//   `const mapDispatchToProps = (dispatch) => {
//   const {
//   User_Operations: { changeLanguage },
//   } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);
//   return { changeLanguage };
//   };: Đây là một hàm mapDispatchToProps trong Redux, được sử dụng để tạo ra các hàm dispatch action từ store Redux và ánh xạ chúng thành props của component. Trong trường 
//   hợp này, hàm này lấy ra hàm changeLanguagetừUser_Operationsvà ánh xạ nó thành props.changeLanguageđược tạo ra bằng cách sử dụngbindActionCreatorsđể kết hợp vớidispatch`.
  
//   export default connect(mapStateToProps, mapDispatchToProps)(Login);: Dòng này kết nối component Login với store Redux thông qua mapStateToProps và mapDispatchToProps đã 
//   được định nghĩa ở trên. Kết quả là component Login sẽ có truy cập vào các props language và changeLanguage từ store Redux.
