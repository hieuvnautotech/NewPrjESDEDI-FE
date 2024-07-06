// import { Suspense, lazy } from 'react';

import { NavBar, TabListContent } from '@containers';

import { Treeview } from '@static/js/adminlte.js';

import { Component } from 'react';
// import { Route, Switch } from 'react-router-dom';

import _ from 'lodash';

import { GetMenus_LoginUser, historyApp, historyDashboard, RabbitMQ_SuccessAlert, RabbitMQ_ErrorAlert } from '@utils';
import CustomRouter from '@utils/CustomRoutes';
// import { withRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';

import SideBar from './sidebar';

import * as ConfigConstants from '@constants/ConfigConstants';

import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

import { useTokenStore, useUserStore, useMenuStore, useLogfileStore } from '@stores';

// import { userService } from '@services';

import { Avatars } from '@constants/ConfigConstants';

import moment from 'moment';

import Footer_DashBoard from './footer';
import PageRouter from './PageRouter';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      tab: 0,
      // language: useLanguageStore.getState().language,
      // language: props.language,
      onLineUser: null,
      missingPermissionGroupByRole: useUserStore.getState().missingPermissionGroupByRole,
      menuGroupByRole: useMenuStore.getState().menuGroupByRole,
      html: GetMenus_LoginUser()[1],
      routers: GetMenus_LoginUser()[2],
      userName: GetMenus_LoginUser()[3],
      Component_Default: GetMenus_LoginUser()[4],
      defaultUrl: GetMenus_LoginUser()[5] ?? GetMenus_LoginUser()[2][0].props.path,
      renderRouter: false,
    };

    // this.changeLang = t;

    this.connection = null;
    this._isMounted = false;

    // this.HistoryElementTabs = props.HistoryElementTabs;
  }

  dispatchSetMissingPermission = useUserStore.getState().dispatchSetMissingPermission;
  dispatchSetMissingPermissionGroupByRole = useUserStore.getState().dispatchSetMissingPermissionGroupByRole;
  dispatchSetMenu = useMenuStore.getState().dispatchSetMenu;
  dispatchSetMenuGroupByRole = useMenuStore.getState().dispatchSetMenuGroupByRole;
  dispatchSetRecordArr = useLogfileStore.getState().dispatchSetRecordArr;

  fabSylte = {};

  getRandomInt = () => {
    return Math.floor(Math.random() * 10);
  };

  avatar = Avatars[this.getRandomInt()];

  startConnection = async () => {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${ConfigConstants.BASE_URL}/signalr`, {
        accessTokenFactory: () => useTokenStore.getState().accessToken,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.None)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          //reconnect after 5-20s
          return 5000 + Math.random() * 15000;
        },
      })
      .build();

    if (this.connection.state === HubConnectionState.Disconnected) {
      this.connection.start().then(() => {
        //ReceivedLoggedInUser
        this.connection.on('ReceivedLoggedInUser', (data) => {
          if (data) {
            this._isMounted &&
              this.setState({
                onLineUser: data,
              });
          }
        });

        //MakeUserLogout
        this.connection.on('MakeUserLogout', () => {
          this.makeUserLogout('general.account_is_logged_in_some_where');
        });

        //ReceivedUserRoleUpdate
        this.connection.on('ReceivedUserRoleUpdate', () => {
          this.makeUserLogout('general.roles_had_been_changed');
        });

        this.connection.on('ReceivedUserMenus', (data) => {
          if (data && this._isMounted) {
            if (!data || !Array.isArray(data) || !data.length || !this._isMounted) {
              return;
            }

            const userMenuGroupByRole = data.map((element) => ({
              roleCode: element.roleCode,
              menuList: element.menus,
            }));

            this.setState((prevState) => ({
              ...prevState,
              menuGroupByRole: [...userMenuGroupByRole],
            }));
          }
        });

        this.connection.on('ReceivedMenusOfRole', (data) => {
          if (data && this._isMounted) {
            const userMenuGroupByRole = {
              roleCode: data.roleCode,
              menuList: data.menus ?? data.Menus,
            };

            const menuGroupByRole = useMenuStore.getState().menuGroupByRole;
            const newGroup = menuGroupByRole.map((existingObj) =>
              existingObj.roleCode === userMenuGroupByRole.roleCode ? userMenuGroupByRole : existingObj
            );

            this.setState((prevState) => ({
              ...prevState,
              menuGroupByRole: [...newGroup],
            }));
          }
        });

        //UserMissingPermissionGroupByRole
        this.connection.on('UserMissingPermissionGroupByRole', (data) => {
          if (data && this._isMounted) {
            // this.dispatchSetMissingPermissionGroupByRole(data);
            this.setState((prevState) => ({
              ...prevState,
              missingPermissionGroupByRole: [...data],
            }));
          }
        });

        //UpdateRoleMissingPermissions
        this.connection.on('UpdateRoleMissingPermissions', (data) => {
          if (data && this._isMounted) {
            const missingPermissionGroupByRole = useUserStore.getState().missingPermissionGroupByRole;
            const newGroup = missingPermissionGroupByRole.map((existingObj) =>
              existingObj.roleCode === data.roleCode ? data : existingObj
            );

            this.setState((prevState) => ({
              ...prevState,
              missingPermissionGroupByRole: [...newGroup],
            }));
          }
        });

        //ReceiveEDIMessage
        this.connection.on('ReceiveEDIMessage', (data) => {
          if (data) {
            const result = JSON.parse(data);

            this.dispatchSetRecordArr([result], 'ADD');

            if (result.LogType === 'SUCCESS') {
              RabbitMQ_SuccessAlert(result.LogMessage);
            } else {
              RabbitMQ_ErrorAlert(result.LogMessage);
            }
          }
        });
      });
    }
  };

  closeConnection = async () => {
    try {
      if (this.connection) {
        await Promise.all([
          this.connection.off('ReceivedLoggedInUser'),
          this.connection.off('MakeUserLogout'),
          this.connection.off('ReceivedUserRoleUpdate'),
          this.connection.off('ReceivedUserMenus'),
          this.connection.off('ReceivedMenusOfRole'),
          this.connection.off('UserMissingPermissionGroupByRole'),
          this.connection.off('UpdateRoleMissingPermissions'),
          this.connection.off('ReceiveEDIMessage'),
        ]);

        await this.connection.stop();
      }
    } catch (error) {
      console.log('close connection error:', JSON.stringify(error));
    }
  };

  updateUserMenus = async (current) => {
    let flag = false;
    this.dispatchSetMenuGroupByRole(current);

    const uniqueArray = this.combineRoleMenus(current);

    const menu = useMenuStore.getState().menu;

    if (!_.isEqual(uniqueArray, menu)) {
      flag = true;
      this.dispatchSetMenu(uniqueArray);
    }

    return flag;
  };

  combineRoleMenus = (data) => {
    const menuList = [];
    const uniqueMenuIds = new Set();

    data.forEach((item) => {
      item.menuList.forEach((menuItem) => {
        menuList.push(menuItem);
      });
    });

    // Filter array to include only unique objects based on menuId
    const uniqueArray = menuList.filter((obj) => {
      if (!uniqueMenuIds.has(obj.menuId)) {
        uniqueMenuIds.add(obj.menuId);
        return true;
      }
      return false;
    });

    return uniqueArray;
  };

  updateMissingPermissions = async (current) => {
    this.dispatchSetMissingPermissionGroupByRole(current);

    const updateMissingPermission = current.reduce((commonPermissions, obj) => {
      const arr = obj.MissingPermissions ?? obj.missingPermissions;
      return commonPermissions.filter((x) => arr.includes(x));
    }, current[0]?.MissingPermissions ?? (current[0]?.missingPermissions || []));

    this.dispatchSetMissingPermission(updateMissingPermission);
  };

  forceLogout = async () => {
    const user = useUserStore.getState().user;

    const dispatchRemoveUser = useUserStore.getState().dispatchRemoveUser;
    const dispatchSetKickOutState = useUserStore.getState().dispatchSetKickOutState;
    const dispatchSetKickOutMessage = useUserStore.getState().dispatchSetKickOutMessage;

    const checkOnlineUser =
      user &&
      this.state.onLineUser?.userId === user.userId &&
      moment(this.state.onLineUser.lastLoginOnWeb).format('YYYY-MM-DD HH:mm:ss') ===
        moment(user.lastLoginOnWeb).format('YYYY-MM-DD HH:mm:ss');

    const dispatchRemoveToken = useTokenStore.getState().dispatchRemoveToken;

    if (!checkOnlineUser) {
      dispatchRemoveToken();
      dispatchRemoveUser();
      dispatchSetKickOutMessage('general.account_is_logged_in_some_where');
      dispatchSetKickOutState(true);
      historyApp.push('/logout');
    }
  };

  makeUserLogout = async (message) => {
    const dispatchRemoveUser = useUserStore.getState().dispatchRemoveUser;
    const dispatchSetKickOutState = useUserStore.getState().dispatchSetKickOutState;
    const dispatchSetKickOutMessage = useUserStore.getState().dispatchSetKickOutMessage;
    const dispatchRemoveToken = useTokenStore.getState().dispatchRemoveToken;
    // const dispatchRemoveMenu = useMenuStore.getState().dispatchRemoveMenu;

    dispatchRemoveToken();
    dispatchRemoveUser();
    // dispatchRemoveMenu();

    dispatchSetKickOutMessage(message);
    dispatchSetKickOutState(true);

    historyApp.push('/logout');
  };

  Treeview_slideMenu = new Treeview($('#main-sidebar-menu'), {
    accordion: false,
    animationSpeed: 300,
    expandSidebar: false,
    sidebarButtonSelector: '[data-widget="pushmenu"]',
    trigger: '[data-widget="treeview"] .nav-link',
    widget: 'treeview',
  });

  componentDidMount = async () => {
    await this.Treeview_slideMenu.init();
    this.setState({ ...this.state, renderRouter: true });

    this._isMounted = true;

    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      await this.connection.stop();
    }
    await this.startConnection();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (!_.isEqual(prevState.onLineUser, this.state.onLineUser)) {
      await this.forceLogout();
    }

    if (!_.isEqual(prevState.missingPermissionGroupByRole, this.state.missingPermissionGroupByRole)) {
      // Perform actions or logic when state changes
      await this.updateMissingPermissions(this.state.missingPermissionGroupByRole);
    }

    if (!_.isEqual(prevState.menuGroupByRole, this.state.menuGroupByRole)) {
      // Perform actions or logic when state changes
      const flag = await this.updateUserMenus(this.state.menuGroupByRole);

      // if (flag) {
      //   this.setState({
      //     ...this.state,
      //     routers: GetMenus_LoginUser()[2],
      //     Component_Default: GetMenus_LoginUser()[4],
      //     defaultUrl: GetMenus_LoginUser()[5] ?? GetMenus_LoginUser()[2][0].props.path,
      //   });
      // }
    }

    // this.setState({ ...this.state, renderRouter: true });
  };

  componentWillUnmount = async () => {
    await this.closeConnection();
    this.connection = null;
    this._isMounted = false;
  };

  render() {
    // const { HistoryElementTabs, index_tab_active } = this.props;
    const Component_Default = this.state.Component_Default;

    return (
      <>
        <div className="container-fluid" id="main">
          {/* <ThemeProvider theme={this.theme}> */}
          <div id="loader">
            <div id="load"></div>
          </div>
          <CustomRouter history={historyDashboard}>
            <ToastContainer
              theme="colored"
              position="bottom-right"
              autoClose={5000}
              // hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              // draggable
              pauseOnHover
            />

            <NavBar />

            <SideBar
              // Menus={this.state.html}
              FullNameLogin={this.state.userName}
              avatar={this.avatar}
            />

            {/* <Switch>
              {this.state.routers}
              {
                <Route
                  path="/"
                  render={(props) => {
                    // const isFromLogin = firstLogin.isfirst;
                    // firstLogin.isfirst = null;

                    // props.history.push(this.defaultUrl);
                    historyDashboard.push(this.state.defaultUrl);
                    return <Component_Default {...props} />;
                  }}
                />
              }
            </Switch> */}

            <PageRouter
              routers={this.state.routers}
              defaultUrl={this.state.defaultUrl}
              Component_Default={Component_Default}
            />

            <TabListContent />
          </CustomRouter>
          <Footer_DashBoard />
        </div>
      </>
    );
  }
}

// const DashBoard = (props) => {
//   let isRendered = React.useRef(false);

//   const { user, dispatchRemoveUser } = useUserStore((state) => state);
//   const { accessToken, dispatchRemoveToken } = useTokenStore((state) => state);
//   // const { menu, dispatchRemoveMenu } = useMenuStore((state) => state);

//   const res = GetMenus_LoginUser();

//   const html = res[1];
//   const routers = res[2];

//   const userName = res[3];
//   const Component_Default = res[4];

//   const [sideMenu, setSideMenu] = useState(
//     new Treeview($('#main-sidebar-menu'), {
//       accordion: false,
//       animationSpeed: 300,
//       expandSidebar: false,
//       sidebarButtonSelector: '[data-widget="pushmenu"]',
//       trigger: '[data-widget="treeview"] .nav-link',
//       widget: 'treeview',
//     })
//   );

//   const initConnection = new HubConnectionBuilder()
//     .withUrl(`${ConfigConstants.BASE_URL}/signalr`, {
//       accessTokenFactory: () => accessToken,
//       skipNegotiation: true,
//       transport: HttpTransportType.WebSockets,
//     })
//     .configureLogging(LogLevel.None)
//     .withAutomaticReconnect({
//       nextRetryDelayInMilliseconds: (retryContext) => {
//         //reconnect after 5-20s
//         return 5000 + Math.random() * 15000;
//       },
//     })
//     .build();

//   const onlineUsersRef = React.useRef();
//   const [onLineUsers, setOnlineUsers] = useState([]);

//   const [connection, setConnection] = useState(initConnection);

//   const startConnection = async () => {
//     try {
//       if (connection) {
//         try {
//           connection.on('ReceivedOnlineUsers', (data) => {
//             if (connection.state === HubConnectionState.Connected && isRendered) {
//               setOnlineUsers(data ? [...data] : []);
//             }
//           });

//           await connection.stop();
//           await connection.start();
//           await connection.invoke('SendOnlineUsers');
//         } catch (error) {
//           // dispatchRemoveUser();
//           console.log('connection build error: ', JSON.stringify(error));
//         }
//       }
//     } catch (error) {
//       console.log('websocket connect error:', JSON.stringify(error));
//     }
//   };

//   const closeConnection = async () => {
//     try {
//       if (connection) {
//         await Promise.all([connection.off('ReceivedOnlineUsers')]);

//         await connection.stop();
//       }
//     } catch (error) {
//       console.log('close connection error:', JSON.stringify(error));
//     }
//   };

//   const forceLogout = async () => {
//     const checkOnlineUsers = onLineUsers.find(
//       (item) => item.userId === user.userId && item.lastLoginOnWeb === user.lastLoginOnWeb
//     );
//     if (!checkOnlineUsers && onlineUsersRef.current && onlineUsersRef.current.length) {
//       await closeConnection();

//       dispatchRemoveToken();
//       // dispatchRemoveMenu();
//       dispatchRemoveUser();

//       historyApp.push('/logout');
//     }
//   };

//   useEffect(() => {
//     isRendered = true;
//     sideMenu.init();
//     startConnection();

//     return () => {
//       console.log('run when index is un-mounted');
//       setSideMenu(null);
//       isRendered = false;
//     };
//   }, [sideMenu]);

//   useEffect(() => {
//     onlineUsersRef.current = onLineUsers;
//     forceLogout();
//   }, [onLineUsers]);

//   return (
//     <>
//       {/* <div className="container-fluid"> */}
//       <CustomRouter history={historyDashboard}>
//         <ToastContainer
//           theme="colored"
//           position="bottom-right"
//           autoClose={5000}
//           // hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           // draggable
//           pauseOnHover
//         />
//         {isRendered && <NavBar />}

//         <SideBar Menus={html} FullNameLogin={userName} />

//         <Switch>
//           {routers}
//           {
//             <Route
//               path="/"
//               render={(props) => {
//                 let isFromLogin = firstLogin.isfirst;
//                 firstLogin.isfirst = null;
//                 return isFromLogin ? <Component_Default {...props} /> : null;
//               }}
//             />
//           }
//         </Switch>
//         <TabListContent />
//       </CustomRouter>
//       {/* </div> */}
//     </>
//   );
// };

export default DashBoard;
