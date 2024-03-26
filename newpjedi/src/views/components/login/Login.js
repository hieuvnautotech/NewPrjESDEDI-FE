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

const theme = createTheme();

const Login = (props) => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const { history, changeLanguage, language, HistoryElementTabs } = props;
  const { dispatchSetLanguage } = useLanguageStore((state) => state);

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

  //// useTokenStore
  const dispatchSetAccessToken = useTokenStore((state) => state.dispatchSetAccessToken);
  const dispatchSetRefreshToken = useTokenStore((state) => state.dispatchSetRefreshToken);

  //// useUserStore
  const dispatchSetUser = useUserStore((state) => state.dispatchSetUser);

  //// useMenuStore
  const dispatchSetMenu = useMenuStore((state) => state.dispatchSetMenu);
  const dispatchSetMenuHtml = useMenuStore((state) => state.dispatchSetMenuHtml);

  const [errorMessages, setErrorMessages] = useState(null);

  const initModal = {
    userName: '',
    userPassword: '',
    // userPassword: '1234@',
  };
  // const { values, setValues, handleInputChange } = useFormCustom(initModal);

  const [buttonState, setButtonState] = useState('loaded');

  const [defaultLang, setDefaultLang] = useState({
    code: 'EN',
    title: 'English',
  });

  const [isSubmit, setIsSubmit] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(() => {
      return !showPassword;
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  

  const schema = yup.object().shape({
    userName: yup.string().required(<FormattedMessage id="login.userName_required" />),
    userPassword: yup.string().required(<FormattedMessage id="login.userPassword_required" />),

    
  });

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

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
      setIsSubmit(() => false);
    };
  }, []);

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
};

Dashboard_Operations.toString = () => {
  return 'Dashboard_Operations';
};

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
// export default Login;


//
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