import { yupResolver } from '@hookform/resolvers/yup';
import { firstLogin, getMenuHtml } from '@utils';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { FormattedMessage, useIntl } from 'react-intl';

import { loginService } from '@services';
import store from '@states/store';
import login_background from '@static/images/login_background.png';

import { useLanguageStore, useMenuStore, useTokenStore, useUserStore } from '@stores';
import KickoutDialog from './KickoutDialog';

import { Store } from '@appstate';
import { Dashboard_Operations } from '@appstate/dashBoard';
import { Display_Operations } from '@appstate/display';
import { User_Operations } from '@appstate/user';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const theme = createTheme(); // tạo theme trong library material ui

const Login = (props) => {
  const intl = useIntl(); // đây là custome hook, library quản lý định dạng ngôn ngữ, dịch chuỗi
  const isRendered = useRef(false);
//Trong React, hook useRef được sử dụng để lưu trữ các giá trị thay đổi mà không gây ra việc render lại component khi giá trị thay đổi. 
// Khi bạn khởi tạo một biến bằng useRef(initialValue), giá trị ban đầu của biến sẽ được lưu trữ trong current property của đối tượng trả về từ hook useRef.

// Trong trường hợp này, isRendered là một biến được tạo ra thông qua useRef và được khởi tạo với giá trị ban đầu là false. Biến này có thể 
// được sử dụng để theo dõi trạng thái của việc render của một component trong React.

// Khi bạn cần cập nhật giá trị của isRendered mà không gây ra việc render lại component, bạn có thể thay đổi giá trị thông qua isRendered.current.
  const { history, changeLanguage, language, HistoryElementTabs } = props;
//const { history, changeLanguage, language, HistoryElementTabs } = props;: Dòng này đang sử dụng destructuring assignment để trích xuất các thuộc tính 
// history, changeLanguage, language, và HistoryElementTabs từ props của component. Điều này giúp bạn truy cập các giá trị này dễ dàng hơn trong phần còn lại của component.
  const { dispatchSetLanguage } = useLanguageStore((state) => state);
//const { dispatchSetLanguage } = useLanguageStore((state) => state);: Dòng này có vẻ như đang sử dụng một custom hook có tên là useLanguageStore để lấy ra 
// dispatchSetLanguage từ state của custom hook đó. Điều này cho phép bạn gửi các action để cập nhật trạng thái của ngôn ngữ trong ứng dụng của mình.
  const countries = [
    {
      code: 'EN',
      title: 'English',
    },
    {
      code: 'VI',
      title: 'Tiếng Việt',
    },
  ];
//const countries = [...]: Dòng này đang khai báo một mảng countries chứa thông tin về các quốc gia và ngôn ngữ tương ứng. Mỗi phần tử trong mảng 
// đều chứa hai thuộc tính là code (mã ngôn ngữ) và title (tiêu đề ngôn ngữ).

  //// useTokenStore
  const dispatchSetAccessToken = useTokenStore((state) => state.dispatchSetAccessToken);
//const dispatchSetAccessToken = useTokenStore((state) => state.dispatchSetAccessToken);: Dòng này đang sử dụng custom hook useTokenStore để lấy hàm 
// dispatchSetAccessToken từ trạng thái của hook đó. Có vẻ như hàm này được sử dụng để cập nhật access token trong ứng dụng của bạn.
  const dispatchSetRefreshToken = useTokenStore((state) => state.dispatchSetRefreshToken);
//const dispatchSetRefreshToken = useTokenStore((state) => state.dispatchSetRefreshToken);: Tương tự như trên, dòng này cũng sử dụng custom hook useTokenStore 
// để lấy hàm dispatchSetRefreshToken từ trạng thái của hook đó. Hàm này có thể được sử dụng để cập nhật refresh token trong ứng dụng của bạn.
  //// useUserStore
  const dispatchSetUser = useUserStore((state) => state.dispatchSetUser);
//Dòng này dùng để lấy hàm dispatchSetUser từ trạng thái của custom hook useUserStore. Có thể đây là hàm được sử dụng để cập nhật thông tin người dùng trong ứng dụng của bạn.
  //// useMenuStore
  const dispatchSetMenu = useMenuStore((state) => state.dispatchSetMenu);
//Dòng này sử dụng custom hook useMenuStore để lấy hàm dispatchSetMenu từ trạng thái của hook đó. Hàm này có thể được sử dụng để cập nhật menu trong giao diện của ứng dụng.
  const dispatchSetMenuHtml = useMenuStore((state) => state.dispatchSetMenuHtml);
//dòng này cũng dùng custom hook useMenuStore để lấy hàm dispatchSetMenuHtml từ trạng thái của hook đó. Hàm này có thể được sử dụng để cập nhật phần tử HTML cho menu trong giao diện
  const [errorMessages, setErrorMessages] = useState(null);
//Đoạn này khởi tạo một state errorMessages và hàm setErrorMessages bằng cách sử dụng hook useState. State này có thể được sử dụng để lưu trữ và hiển thị thông báo lỗi trong ứng dụng
  const initModal = {
    userName: '',
    userPassword: '',
    // userPassword: '1234@',
  };
//Đoạn này khởi tạo một đối tượng initModal với hai thuộc tính userName và userPassword. Có thể đây là dùng để lưu trữ thông tin mặc định cho một modal trong ứng dụng
  // const { values, setValues, handleInputChange } = useFormCustom(initModal);

  const [buttonState, setButtonState] = useState('loaded');
//Đây khởi tạo một state buttonState với giá trị ban đầu là 'loaded', và hàm setButtonState để cập nhật giá trị của state này. State này có thể được sử dụng để quản lý trạng thái của nút trong ứng dụng
  const [defaultLang, setDefaultLang] = useState({
    code: 'EN',
    title: 'English',
  });
//Đây khởi tạo một state defaultLang với một đối tượng có hai thuộc tính code và title. State này có thể được sử dụng để lưu trữ ngôn ngữ mặc định trong ứng dụng.
  const [isSubmit, setIsSubmit] = useState(false);
//Đây khởi tạo một state isSubmit với giá trị ban đầu là false, và hàm setIsSubmit để cập nhật giá trị của state này. State này có thể được sử dụng để đánh dấu việc submit form trong ứng dụng
  const [showPassword, setShowPassword] = useState(false);
//Đây khởi tạo một state showPassword với giá trị ban đầu là false, và hàm setShowPassword để cập nhật giá trị của state này. State này có thể được sử dụng để hiển thị hoặc ẩn mật khẩu trong form.
  const handleClickShowPassword = () => {
    setShowPassword(() => {
      return !showPassword;
    });
  };
//Đây là hàm xử lý sự kiện khi người dùng click vào nút hiển thị/ẩn mật khẩu. Hàm này cập nhật trạng thái showPassword để hiển thị hoặc ẩn mật khẩu.
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
//Đây là hàm xử lý sự kiện khi người dùng nhấn chuột vào mật khẩu. Hàm này ngăn chặn hành động mặc định của sự kiện.
  

  const schema = yup.object().shape({
    userName: yup.string().required(<FormattedMessage id="login.userName_required" />),
    userPassword: yup.string().required(<FormattedMessage id="login.userPassword_required" />),

    
  });
//Đoạn này sử dụng thư viện Yup để định nghĩa schema cho việc kiểm tra dữ liệu nhập vào. Schema này yêu cầu các trường userName và userPassword phải được nhập và không được để trống
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { ...initModal },
  });
//Mã này là một ví dụ về việc sử dụng destructuring trong JavaScript ES6 để trích xuất các phần tử từ một đối tượng được trả về từ hàm useForm.
// useForm là một hook của thư viện React Hook Form, được sử dụng để quản lý biểu mẫu trong ứng dụng React.
// const { register, formState: { errors }, handleSubmit, clearErrors } là cách trích xuất các thành phần cụ thể từ đối tượng được trả về bởi useForm.
// register, handleSubmit, và clearErrors là các phương thức cung cấp bởi useForm để đăng ký các trường nhập, xử lý gửi biểu mẫu và xóa lỗi tương ứng.
// formState là một phần của đối tượng được trả về bởi useForm, và trong trường hợp này, nó được trích xuất với tên mới là errors để dễ dàng sử dụng.
// yupResolver(schema) được sử dụng để xác thực dữ liệu theo schema được cung cấp bởi thư viện yup.
// Ví dụ này sử dụng useForm để quản lý biểu mẫu, kết hợp với yup để xác thực dữ liệu, và sử dụng destructuring để tiện lợi khi truy cập các thành phần của đối tượng trả về từ useForm.
  const submitFormLogin = async (data) => {
    setIsSubmit(() => {
      return true;
    });

    const res = await loginService.handleLogin(data.userName, data.userPassword);

    if (res?.HttpResponseCode === 200) {
      dispatchSetAccessToken(res.Data.accessToken);
      dispatchSetRefreshToken(res.Data.refreshToken);

      const { HttpResponseCode, ResponseMessage, Data } = await loginService.getUserInfo();

      if (HttpResponseCode === 200 && Data.Menus && Data.Menus.length) {
        store.dispatch({
          type: 'Dashboard/USER_LOGIN',
        });

        const user = {
          userId: Data.userId,
          userName: Data.userName,
          lastLoginOnWeb: moment(Data.lastLoginOnWeb).format('YYYY-MM-DD HH:mm:ss'),
          RoleNameList: Data.RoleNameList,
          RoleCodeList: Data.RoleCodeList,
          row_version: Data.row_version,
          fullName: Data.fullName,
        };

        dispatchSetUser(user);

        dispatchSetMenu(Data.Menus);

        const menu_Lang = Data.Menus.map((element) => ({
          ...element,
          menuName: intl.formatMessage({ id: element.languageKey }),
        }));
        const { html } = getMenuHtml(menu_Lang);
        dispatchSetMenuHtml(html);

        setIsSubmit(() => {
          return false;
        });
        clearErrors();

        let routername = history.urlreturn;

        firstLogin.isfirst = true;

        if (routername) {
          history.push({
            pathname: routername,
            // closetab: true,
          });
        } else {
          history.push({
            pathname: '/',
            // closetab: true,
          });
        }
      } else {
        setErrorMessages(() => {
          return 'No menu set';
        });
        setIsSubmit(() => {
          return false;
        });
      }
    } else {
      setErrorMessages(() => {
        return res.ResponseMessage;
      });
      setIsSubmit(() => {
        return false;
      });
    }
  };
//Mã này là một hàm JavaScript có tên submitFormLogin, được sử dụng để xử lý việc gửi biểu mẫu đăng nhập. Dưới đây là phân tích chi tiết của hàm này:

// async (data) => { ... }: Đây là một hàm bất đồng bộ nhận vào một tham số data, có thể là dữ liệu được nhập từ biểu mẫu đăng nhập.

// setIsSubmit(() => { return true; });: Đặt trạng thái của biến isSubmit thành true, có thể để thể hiện rằng biểu mẫu đang được gửi đi.

// const res = await loginService.handleLogin(data.userName, data.userPassword);: Gọi hàm handleLogin từ loginService để thực hiện quá trình đăng nhập với thông tin userName và userPassword.

// if (res?.HttpResponseCode === 200) { ... } else { ... }: Kiểm tra kết quả trả về từ quá trình đăng nhập. Nếu mã phản hồi là 200 (thành công), tiếp tục xử lý, nếu không, xử lý lỗi.

// Trong khối if (res?.HttpResponseCode === 200) { ... }:

// Lưu trữ thông tin accessToken và refreshToken vào Redux store.
// Gọi hàm getUserInfo để lấy thông tin người dùng và menu.
// Nếu nhận được dữ liệu người dùng và menu hợp lệ, cập nhật trạng thái của ứng dụng và chuyển hướng người dùng đến trang chính hoặc trang mà họ đã cố gắng truy cập trước đó.
// Nếu không có menu được thiết lập, đặt thông báo lỗi và trạng thái isSubmit thành false.
// Trong khối else, nếu không có phản hồi thành công từ quá trình đăng nhập:

// Đặt thông báo lỗi tương ứng và trạng thái isSubmit thành false.
// Hàm này thực hiện nhiều công việc như xác thực đăng nhập, lấy thông tin người dùng, xử lý menu và chuyển hướng người dùng dựa trên kết quả nhận được từ các yêu cầu HTTP.

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
      setIsSubmit(() => false);
    };
  }, []);
//Mã này là một hiệu ứng phụ trong React sử dụng useEffect. Dưới đây là phân tích chi tiết của hiệu ứng này:

// useEffect(() => { ... }, []): Đây là một hiệu ứng phụ được kích hoạt sau khi component được render và chỉ được kích hoạt một lần với mảng rỗng [] làm tham số thứ hai, chỉ định
//  rằng hiệu ứng này chỉ được kích hoạt khi component được render lần đầu tiên.

// if (!isRendered.current) { isRendered.current = true; }: Trong hàm callback của useEffect, nếu biến isRendered.current chưa được thiết lập (hoặc là false), nó sẽ được thiết lập
//  thành true. Biến isRendered có thể được sử dụng để theo dõi xem hiệu ứng này đã được kích hoạt hay chưa.

// return () => { ... }: Đây là một hàm clean-up được trả về từ hiệu ứng phụ. Nó sẽ được thực thi khi component bị unmount hoặc hiệu ứng phụ bị kích hoạt lại. Trong trường hợp này,
//  nó sẽ đặt isRendered.current thành false và đặt trạng thái isSubmit thành false.

// isRendered.current = false;: Đặt isRendered.current thành false, có thể đánh dấu rằng hiệu ứng này đã kết thúc.

// setIsSubmit(() => false);: Đặt trạng thái isSubmit thành false. Điều này có thể là một phần của quá trình làm sạch khi hiệu ứng kết thúc.

// Tóm lại, hiệu ứng này được sử dụng để theo dõi trạng thái của việc render và cập nhật một số biến trạng thái, như isSubmit, khi component được mount và unmount.

  useEffect(() => {
    if (language === 'VI') {
      setDefaultLang(() => {
        return { ...countries[1] };
      });
    } else {
      setDefaultLang(() => {
        return { ...countries[0] };
      });
    }
  }, [language]);
//Mã này là một hiệu ứng phụ trong React sử dụng useEffect. Dưới đây là phân tích chi tiết của hiệu ứng này:

// useEffect(() => { ... }, [language]): Đây là một hiệu ứng phụ được kích hoạt mỗi khi giá trị của biến language thay đổi.

// if (language === 'VI') { ... } else { ... }: Trong hàm callback của useEffect, nếu giá trị của language là 'VI', thì setDefaultLang được gọi với giá trị được sao chép từ phần tử thứ hai của 
// mảng countries. Ngược lại, nếu language không phải là 'VI', thì setDefaultLang được gọi với giá trị được sao chép từ phần tử đầu tiên của mảng countries.

// return () => { ... }: Đây là một hàm clean-up không được sử dụng trong hiệu ứng này, vì nó không thực hiện bất kỳ tác vụ clean-up nào.

// Tóm lại, hiệu ứng này được sử dụng để cập nhật giá trị mặc định của ngôn ngữ dựa trên giá trị của biến language. Nó kiểm tra nếu ngôn ngữ là tiếng Việt ('VI'), thì giá trị mặc định sẽ được 
// thiết lập từ phần tử thứ hai của mảng countries, ngược lại, giá trị mặc định sẽ được thiết lập từ phần tử đầu tiên của mảng countries.
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />

        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${login_background})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></Grid>

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className="background-login">
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'error.main', width: 50, height: 50 }}>
                <LockOutlinedIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h2" color={'error'}>
                ESD
              </Typography>
            </Box>

            {/* <Typography variant="h3">
              <FormattedMessage id="general.signin" />
            </Typography> */}

            <form onSubmit={handleSubmit(submitFormLogin)}>
              <Box sx={{ mt: 1 }}>
                <TextField
                  sx={{ backgroundColor: '#E8F0FE' }}
                  autoFocus
                  // required
                  fullWidth
                  label={<FormattedMessage id="model.user.field.userName" />}
                  name="userName"
                  {...register('userName', {
                    // onChange: (e) => handleInputChange(e)
                  })}
                  error={!!errors?.userName}
                  helperText={errors?.userName ? errors.userName.message : null}
                />
                <TextField
                  sx={{ backgroundColor: '#E8F0FE' }}
                  margin="normal"
                  // required
                  fullWidth
                  name="userPassword"
                  type={showPassword ? 'text' : 'password'}
                  label={<FormattedMessage id="model.user.field.userPassword" />}
                  {...register('userPassword', {
                    // onChange: (e) => handleInputChange(e)
                  })}
                  error={!!errors?.userPassword}
                  helperText={errors?.userPassword ? errors.userPassword.message : null}
                  
                />

                <Autocomplete
                  // disablePortal
                  freeSolo
                  autoHighlight
                  options={countries}
                  sx={{ mt: 1, backgroundColor: '#E8F0FE' }}
                  value={defaultLang}
                  onChange={(event, newValue) => {
                    changeLanguage(newValue.code === 'VI' ? 'VI' : 'EN');
                    dispatchSetLanguage(newValue.code === 'VI' ? 'VI' : 'EN');
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option.code === 'EN' ? (
                        <i className="flag-icon flag-icon-us mr-2"></i>
                      ) : (
                        <i className="flag-icon flag-icon-vi mr-2"></i>
                      )}
                      {option.title}
                    </Box>
                  )}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField {...params} label={<FormattedMessage id="general.select_language" />} />
                  )}
                />

                <button
                  disabled={isSubmit}
                  style={{ width: '100%', marginTop: '25px', minHeight: '50px', fontSize: '1.3rem' }}
                  type="submit"
                  className="btn btn-primary"
                >
                  {<FormattedMessage id="general.signin" />}
                  {isSubmit && (
                    <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true"></span>
                  )}

                  {!isSubmit && <i className="fa fa-sign-in mx-2" aria-hidden="true"></i>}
                </button>
              </Box>
            </form>

            {errorMessages && (
              <p style={{ color: 'red', textAlign: 'center' }}>{<FormattedMessage id={errorMessages} />}</p>
            )}

            {/* {!isMobile && (
              
            )} */}
            <Stack direction="row" spacing={2} style={{ marginTop: 5 }}>
              {}
              {}
            </Stack>
            {}
          </Box>
        </Grid>

        <KickoutDialog />
      </Grid>
    </ThemeProvider>
  );
// Đoạn mã trên là một phần của một component React, trong đó JSX được sử dụng để tạo giao diện người dùng. Dưới đây là mô tả của mỗi phần trong đoạn mã:

// <ThemeProvider theme={theme}>: Component <ThemeProvider> được sử dụng để cung cấp theme cho các components con bên trong nó, trong trường hợp này là theme.

// <Grid container component="main" sx={{ height: '100vh' }}>: Component <Grid> từ thư viện Material-UI được sử dụng để tạo một lưới. Trong trường hợp này, 
// nó được sử dụng để tạo một lưới chứa toàn bộ nội dung của trang, với chiều cao là 100% chiều cao của viewport (height: '100vh').

// <CssBaseline />: Component <CssBaseline> từ thư viện Material-UI được sử dụng để áp dụng một số CSS mặc định cho trang, giúp đảm bảo rằng mọi component 
// đều có hiệu ứng và bố cục đồng nhất trên các trình duyệt.

// Hai <Grid> components tiếp theo (một có xs={false}, sm={4}, md={7} và một có xs={12}, sm={8}, md={5}) được sử dụng để tạo hai cột trong lưới. Cột đầu tiên 
// chứa một hình nền (backgroundImage) và cột thứ hai chứa nội dung chính của trang.

// Trong cột thứ hai:

// <Box>: Component <Box> được sử dụng để tạo một box chứa các phần tử khác.
// <Avatar>: Component <Avatar> từ Material-UI được sử dụng để hiển thị một hình ảnh hoặc biểu tượng. Trong trường hợp này, nó có thể đại diện cho biểu tượng đăng nhập.
// <Typography>: Component <Typography> từ Material-UI được sử dụng để hiển thị văn bản. Trong trường hợp này, nó được sử dụng để hiển thị tiêu đề "ESD".
// <form>: Đây là một form để người dùng có thể nhập thông tin đăng nhập.
// <TextField>: Component <TextField> từ Material-UI được sử dụng để tạo các trường nhập liệu, trong trường hợp này là trường nhập tên người dùng và mật khẩu.
// <Autocomplete>: Component <Autocomplete> từ Material-UI được sử dụng để tạo một trường nhập với tính năng tự động hoàn chỉnh, có thể đại diện cho việc chọn ngôn ngữ.
// <button>: Một nút submit cho form đăng nhập.
// {errorMessages && (<p style={{ color: 'red', textAlign: 'center' }}>{<FormattedMessage id={errorMessages} />}</p>)}: Một phần để hiển thị thông báo lỗi nếu có.
// <Stack direction="row" spacing={2} style={{ marginTop: 5 }}>...: Một stack component từ Material-UI được sử dụng để chứa các thành phần khác trong một hàng ngang. 
// Trong trường hợp này, có thể chứa các liên kết hoặc các phần tử khác.
// <KickoutDialog />: Một component được gọi là KickoutDialog, có thể là một hộp thoại đăng xuất hoặc thông báo khác.
};

Dashboard_Operations.toString = () => {
  return 'Dashboard_Operations';
};
//Đoạn mã trên đang định nghĩa một phương thức toString() cho đối tượng Dashboard_Operations. Khi một đối tượng được chuyển đổi thành một chuỗi (ví dụ: khi sử dụng trong ngữ 
// cảnh yêu cầu một chuỗi), phương thức toString() sẽ được gọi tự động. Trong trường hợp này, phương thức toString() được cài đặt để trả về chuỗi 'Dashboard_Operations'. Điều này 
// có thể hữu ích trong việc gỡ lỗi hoặc khi muốn biểu diễn một đối tượng dưới dạng chuỗi cụ thể.
User_Operations.toString = () => {
  return 'User_Operations';
};

Display_Operations.toString = () => {
  return 'Display_Operations';
};

const mapStateToProps = (state) => {
  const {
    Dashboard_Reducer: { HistoryElementTabs, index_tab_active, index_tab_active_array, notify_list, total_notify },
    User_Reducer: { language },
    Display_Reducer: {
      totalOrderQty,
      totalActualQty,
      totalNGQty,
      totalGoodQtyInjection,
      totalNGQtyInjection,
      totalGoodQtyAssy,
      totalNGQtyAssy,
      totalEfficiency,
      data,
    },
  } = CombineStateToProps(state.AppReducer, [[Store.Dashboard_Reducer], [Store.User_Reducer], [Store.Display_Reducer]]);

  return {
    HistoryElementTabs,
    index_tab_active,
    index_tab_active_array,
    notify_list,
    total_notify,

    language,
    totalOrderQty,
    totalActualQty,
    totalNGQty,
    totalGoodQtyInjection,
    totalNGQtyInjection,
    totalGoodQtyAssy,
    totalNGQtyAssy,
    totalEfficiency,
    data,
  };
};
//Đoạn mã trên đang định nghĩa một hàm mapStateToProps, một phần của Redux, được sử dụng để ánh xạ trạng thái từ Redux store thành các thuộc tính của component React. Dưới đây là một phân tích chi tiết của hàm này:

// const mapStateToProps = (state) => { ... }: Đây là khai báo của hàm mapStateToProps, nhận vào một tham số state, đại diện cho trạng thái hiện tại của Redux store.

// Trong phần thân của hàm:

// Đối tượng state được destructured để lấy ra các phần tử cụ thể từ các reducers khác nhau trong Redux store.
// CombineStateToProps(state.AppReducer, [[Store.Dashboard_Reducer], [Store.User_Reducer], [Store.Display_Reducer]]): Đây là một hàm (có thể là một utility function được định nghĩa ở nơi khác trong mã) được sử dụng để 
// kết hợp các reducers cụ thể vào một đối tượng duy nhất, thông thường được sử dụng khi sử dụng nhiều reducers trong Redux.
// Trong lệnh return { ... }, các thuộc tính được trả về để được ánh xạ vào props của component React:

// HistoryElementTabs, index_tab_active, index_tab_active_array, notify_list, total_notify: Các giá trị từ reducer Dashboard_Reducer.
// language: Giá trị từ reducer User_Reducer.
// totalOrderQty, totalActualQty, totalNGQty, totalGoodQtyInjection, totalNGQtyInjection, totalGoodQtyAssy, totalNGQtyAssy, totalEfficiency, data: Các giá trị từ reducer Display_Reducer.
// Những giá trị này sẽ được chuyển đến component React thông qua props để sử dụng trong render hoặc các phương thức khác của component. Điều này giúp component trở nên linh hoạt hơn khi làm việc với dữ liệu từ Redux store.
const mapDispatchToProps = (dispatch) => {
  const {
    Dashboard_Operations: { appendTab, switchTab, deleteTab, deleteOtherTab, deleteAll, updateTimeAgo, updatenotify },
    // , User_Operations: {
    //     changeLanguage
    // },
    Display_Operations: { saveDisplayData },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [
    [Dashboard_Operations],
    // , [User_Operations]
    [Display_Operations],
  ]);

  return {
    appendTab,
    switchTab,
    deleteTab,
    deleteOtherTab,
    deleteAll,
    updateTimeAgo,
    updatenotify,

    //,changeLanguage
    saveDisplayData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
//
// Đoạn mã trên đang định nghĩa một hàm mapDispatchToProps, một phần của Redux, được sử dụng để ánh xạ các actions từ store Redux thành các props của component React. Dưới đây là phân tích chi tiết của hàm này:

// const mapDispatchToProps = (dispatch) => { ... }: Đây là khai báo của hàm mapDispatchToProps, nhận vào một tham số dispatch, đại diện cho hàm dispatch từ Redux store, dùng để gửi các actions đến store.

// Trong phần thân của hàm:

// Đối tượng dispatch được destructured để lấy ra các actions cụ thể từ các operations khác nhau trong ứng dụng.
// CombineDispatchToProps(dispatch, bindActionCreators, [[Dashboard_Operations], [Display_Operations]]): Đây là một hàm (có thể là một utility function được định nghĩa ở nơi khác trong mã) được sử dụng để kết 
// hợp các operations cụ thể vào một đối tượng duy nhất, thông thường được sử dụng khi cần sử dụng nhiều operations trong Redux.
// Trong lệnh return { ... }, các actions được trả về để được ánh xạ vào props của component React:

// appendTab, switchTab, deleteTab, deleteOtherTab, deleteAll, updateTimeAgo, updatenotify: Các actions từ operation Dashboard_Operations.
// saveDisplayData: Các actions từ operation Display_Operations.
// Những actions này sẽ được chuyển đến component React thông qua props để sử dụng trong các phương thức của component, thường là để kích hoạt các thay đổi trạng thái trong Redux store. Điều này giúp component 
// có thể gửi các actions đến store để thực hiện các tác vụ như thêm, sửa đổi hoặc xóa dữ liệu. Sau đó, component được kết nối với Redux store thông qua hàm connect để có thể truy cập vào state và dispatch actions 
// từ store. Trong ví dụ này, component được kết nối là Login.



//giải thích Toàn bộ
// Đoạn mã này định nghĩa một component React có tên là Login, được sử dụng để xử lý quá trình đăng nhập của người dùng. Dưới đây là một số điểm chính:

// Import các thư viện và thành phần: Đoạn mã import các thư viện và thành phần cần thiết từ các module khác nhau, bao gồm các thư viện yup, react-hook-form, moment, 
// cũng như một số components và hooks từ thư viện MUI (Material-UI).

// State và hooks: Sử dụng hook useState để quản lý trạng thái của component, bao gồm các trạng thái như errorMessages, buttonState, defaultLang, và isSubmit.

// Validation schema: Sử dụng thư viện yup để xác thực dữ liệu nhập vào từ người dùng thông qua yupResolver từ @hookform/resolvers/yup. Schema này định nghĩa các quy tắc 
// cho các trường userName và userPassword.

// Form và xử lý submit: Sử dụng hook useForm từ react-hook-form để quản lý form và xử lý việc submit. Khi form được submit, hàm submitFormLogin sẽ được gọi để xử lý quá 
// trình đăng nhập.

// Giao diện người dùng: Component này hiển thị một giao diện đăng nhập với các trường nhập liệu cho tên người dùng và mật khẩu, cũng như một nút đăng nhập. Nó cũng bao 
// gồm một chức năng để chọn ngôn ngữ và hiển thị thông báo lỗi nếu có.

// Kết nối với Redux: Component này cũng được kết nối với Redux thông qua connect từ react-redux, để lấy và cập nhật dữ liệu trong store của ứng dụng.

// Export component: Component Login được export để có thể sử dụng trong các thành phần khác của ứng dụng.

// Đây là một component quan trọng trong quy trình đăng nhập của ứng dụng React và thực hiện nhiều chức năng quan trọng như xác thực dữ liệu, giao tiếp với các dịch vụ backend, 
// và quản lý trạng thái của ứng dụng.