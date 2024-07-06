import * as ConfigConstants from '@constants/ConfigConstants';
import CloseIcon from '@mui/icons-material/Close';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { withStyles } from '@mui/styles';
import { ErrorAlert, getMenuHtml, historyApp, historyDashboard } from '@utils';
import React, { Suspense, lazy, useRef } from 'react';

// import OneSignal from 'react-onesignal';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { LoaderOverlay } from '@components';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { documentService, loginService } from '@services';
import ReactDOM from 'react-dom';
import { withTranslation } from 'react-i18next';
import { useIntl } from 'react-intl';

const UserChangePassDialog = lazy(() => import('../standard_db/Configuration/User/UserChangePassDialog'));
const ChangeLanguage = lazy(() => import('../../containers/dashBoard/ChangeLanguage'));

import { Cached, CancelPresentation, Logout, Person, QuestionMark, Settings } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemButton, Popover, Slide } from '@mui/material';
import { useLanguageStore, useMenuStore, useTokenStore, useUserStore } from '@stores';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Sortable from 'sortablejs';
import InstallAppBtn from './InstallAppBtn';
// import OneSignalRegister from './OneSignalRegister';
const styles = (theme) => ({
  tabs: {
    width: '100%',
    '& .MuiTab-root': {
      fontFamily: 'Sora-Regular',
    },
    '& MuiTabs-scroller': {
      padding: 5,
    },

    '& .MuiTabs-indicator': {
      // backgroundColor: 'orange',
      // height: 3,
      display: 'none',
    },

    '& .MuiTab-root.Mui-selected': {
      color: '#ff1493 !important',
      fontWeight: 'bold',
      background: 'linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c)',
      border: '2px solid #ff1493',

      '& .MuiSvgIcon-root': {
        // backgroundColor: '#ff1493',
        backgroundColor: 'transparent',
      },
    },

    '& .MuiTabs-flexContainer': {
      paddingLeft: 8,
      '& button': { border: '2px solid #D3D3D3', transform: 'skewX(-20deg)', transition: '0.5s ease-in-out' },
      '& button:hover': {
        backgroundColor: '#ff1493',
        color: '#FFF',
        '& .MuiSvgIcon-root': {
          backgroundColor: '#ff1493',
          color: '#FFFFFF',
        },
      },
      '& button:focus': { backgroundColor: 'transparent' },
    },

    //"& button:active": { bgcolor:'lightgrey' }
    // "& .MuiTabs-flexContainer":{
    //   backgroundColor: 'papayawhip'
    // }
  },
});

const NavBar = (props) => {
  const intl = useIntl();
  const { classes, HistoryElementTabs, index_tab_active_array, deleteAll, deleteTab, deleteOtherTab } = props;
  const { dispatchRemoveToken } = useTokenStore((state) => state);
  const { dispatchRemoveUser } = useUserStore((state) => state);
  // const { dispatchRemoveMenu } = useMenuStore((state) => state);
  const { language } = useLanguageStore((state) => state);
  const { menu } = useMenuStore((state) => state);
  const [navState, setNavState] = useState({
    isShowing: false,
    pdfURL: '',
    title_guide: '',
    isShowingChangePass: false,
  });

  const [breadcrumb, setBreadcrumb] = useState([]);

  const handleChange = (event, newValue) => {
    const tab = HistoryElementTabs[newValue];
    historyDashboard.push(tab.router);
  };

  const signOut = async (e) => {
    e.preventDefault();
    try {
      const { HttpResponseCode, ResponseMessage } = await loginService.handleLogout();
      if (HttpResponseCode === 200 && ResponseMessage === 'general.success') {
        dispatchRemoveToken();
        //dispatchRemoveMenu();
        dispatchRemoveUser();

        deleteAll();
        historyApp.push('/logout');
      } else {
        ErrorAlert('System error');
      }
    } catch (error) {
      console.log('[logout error]: ', error);
    }
    // window.location.reload(true);
  };

  const handleCloseTab = (e, ele) => {
    e.stopPropagation();
    deleteTab(ele.index);
  };

  const handleCloseAllTabs = (e) => {
    e.preventDefault();
    deleteOtherTab();
  };

  const handleRefreshTab = (e) => {
    e.preventDefault();

    const tab = HistoryElementTabs[index_tab_active_array];

    const funcRefreshChange = tab?.ref?.componentRefreshChange;

    funcRefreshChange && funcRefreshChange();
  };

  const handleGuide = async (e) => {
    e.preventDefault();
    const tab = HistoryElementTabs[index_tab_active_array];
    const { Data } = await documentService.downloadDocument(tab.component, language);

    if (Data) {
      const url_file = `${ConfigConstants.BASE_URL}/document/${Data.documentLanguage}/${Data.urlFile}`;

      setNavState((prevState) => {
        return {
          ...prevState,
          isShowing: true,
          pdfURL: url_file,
          title_guide: Data.languageKey,
        };
      });
    } else {
      ErrorAlert(language === 'VI' ? 'Không có tài liệu hướng dẫn' : 'No documentation available');
    }
  };

  const handleChangePass = async (e) => {
    e.preventDefault();

    setNavState((prevState) => {
      return {
        ...prevState,
        isShowingChangePass: true,
      };
    });
  };

  const subscribe = (e) => {
    e.preventDefault();
    // OneSignal.showSlidedownPrompt();
  };

  const toggle = () => {
    setNavState((prevState) => {
      return {
        ...prevState,
        isShowing: !prevState.isShowing,
      };
    });
  };

  const toggleChangePass = () => {
    setNavState((prevState) => {
      return {
        ...prevState,
        isShowingChangePass: !prevState.isShowingChangePass,
      };
    });
  };

  const handleChangeLanguage = ({ detail }) => {
    if (detail) {
      const { breadcrumb } = getMenuHtml(detail);
      setBreadcrumb(() => {
        return breadcrumb;
      });
    }
  };

  useEffect(() => {
    document.addEventListener('changeLanguage', handleChangeLanguage);

    return () => document.removeEventListener('changeLanguage', handleChangeLanguage);
  }, []);

  useEffect(() => {
    handleChangeLanguage({ menu });

    if (HistoryElementTabs.length === 1) {
      historyDashboard.push(HistoryElementTabs[0].router);
    }
  }, [HistoryElementTabs]);

  const renderName = (code, name) => {
    const breadcrumbCurrent = breadcrumb.filter((x) => x.code === code)[0];
    return breadcrumbCurrent ? breadcrumbCurrent.name : name;
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // useEffect(() => {
  //   if (isMobile) {
  //     console.log('aaaa');
  //     document.body.classList.add('sidebar-closed', 'sidebar-collapse');
  //     $('a[data-widget="fullscreen"]').trigger('click');
  //     // console.log($('a[data-widget="fullscreen"]'));
  //   }
  // }, []);

  const sortable = useRef(null);
  const initSortable = async () => {
    const el = document.querySelector('[aria-label="tabsview-ul"]');
    if (!el) return false;
    if (sortable.current?.el) sortable.current?.destroy();
    sortable.current = Sortable.create(el, {
      animation: 300,
      dataIdAttr: 'tabindex',
      disabled: false,
    });
  };
  useEffect(() => {
    !isMobile && initSortable();
  }, []);
  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light sticky-top shadow-sm  ">
        <Tabs
          className={classes.tabs}
          variant="scrollable"
          value={index_tab_active_array}
          onChange={handleChange.bind(this)}
          aria-label="tabsview-ul"
        >
          {HistoryElementTabs.map((ele) => (
            <Tab
              key={ele.index}
              sx={{ mx: 0.1 }}
              label={
                <span>
                  {renderName(ele.code, ele.name)}
                  <a title={'Close tab'}>
                    <CloseIcon
                      onClick={(e) => handleCloseTab(e, ele)}
                      sx={{
                        // color: '#FFF',
                        color: 'transparent',
                        width: 20,
                        height: 20,
                        mt: -3,
                        ml: 2,
                        transition: '0.5s',
                      }}
                    />
                  </a>
                </span>
              }
            />
          ))}
        </Tabs>

        {/* <NotificationUpdater /> */}
        <ul className="navbar-nav ml-auto">
          {/* <li className="nav-item  d-none d-md-flex">
            <a className="nav-link" onClick={subscribe.bind(this)} href="#" role="button" title="subscribe">
              <i className="fa fa-bell" aria-hidden="true"></i>
            </a>
          </li> */}
          {/* <OneSignalRegister className={' d-none d-md-flex'} /> */}

          <li className="nav-item  d-none d-md-flex">
            <a
              className="nav-link"
              onClick={handleChangePass.bind(this)}
              href="#"
              role="button"
              title="change password"
            >
              <i className="fa fa-user" aria-hidden="true"></i>
            </a>
          </li>

          <li className="nav-item  d-none d-md-flex">
            <a className="nav-link" onClick={handleGuide.bind(this)} href="#" role="button" title="help">
              <i className="fa fa-question" aria-hidden="true"></i>
            </a>
          </li>

          <li className="nav-item  d-none d-md-flex">
            <span
              className="nav-link"
              onClick={handleCloseAllTabs.bind(this)}
              // href="#"
              role="button"
              title="close all tabs except selected"
            >
              <i className="fa fa-window-close-o" aria-hidden="true"></i>
            </span>
          </li>

          <li className="nav-item  d-none d-md-flex">
            <a
              className="nav-link"
              onClick={handleRefreshTab.bind(this)}
              href="#"
              role="button"
              title="refresh current tab"
            >
              <i className="fa fa-refresh" aria-hidden="true"></i>
            </a>
          </li>

          <li className="nav-item  d-none d-md-flex">
            <a
              className="nav-link"
              data-widget="fullscreen"
              href="#"
              role="button"
              title="fullscreen"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-expand-arrows-alt" aria-hidden="true"></i>
            </a>
          </li>

          <InstallAppBtn className={' d-none d-md-flex'} />

          {/* <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
              title="pushmenu"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-bars" aria-hidden="true"></i>
            </a>
          </li> */}

          {/* <!-- Language Dropdown Menu --> */}
          <Suspense fallback={<LoaderOverlay />}>
            <ChangeLanguage />
          </Suspense>

          <li className="nav-item  d-none d-md-flex">
            <a className="nav-link" href="#" role="button" onClick={signOut} title="logout">
              <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
            </a>
          </li>

          <IconButton aria-describedby={id} onClick={handleClick} className="d-inline-flex d-md-none">
            <Settings />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
          >
            <List>
              {/* {(process.env.NODE_ENV === 'development' || window.location.host == 's-wms.autonsi.com') && (
                <OneSignalRegister />
              )} */}

              <InstallAppBtn />
              <ListItem disablePadding>
                <ListItemButton onClick={handleChangePass.bind(this)}>
                  <Person />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleGuide.bind(this)}>
                  <QuestionMark />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleCloseAllTabs.bind(this)}>
                  <CancelPresentation />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleRefreshTab.bind(this)}>
                  <Cached />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={signOut}>
                  <Logout />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
        </ul>
      </nav>

      <PDFModal
        isShowing={navState.isShowing}
        hide={toggle.bind(this)}
        pdfURL={navState.pdfURL}
        title={navState.title_guide ? intl.formatMessage({ id: navState.title_guide }) : ''}
      />

      <Suspense fallback={<LoaderOverlay />}>
        <UserChangePassDialog isOpen={navState.isShowingChangePass} onClose={toggleChangePass.bind(this)} />
      </Suspense>
    </>
  );
};

const Transition_Slide_Down = React.forwardRef((props, ref) => {
  return <Slide ref={ref} {...props} />;
});
const PDFModal = ({ isShowing, hide, pdfURL, title }) => {
  const intl = useIntl();
  const [numPages, setNumPages] = React.useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onLoadError = (error) => {
    console.log('load-error', error);
  };

  return ReactDOM.createPortal(
    <React.Fragment>
      <div>
        <Dialog open={isShowing} maxWidth={'xl'} fullWidth={true} TransitionComponent={Transition_Slide_Down}>
          <DialogTitle
            sx={{
              color: '#FFFFFF',
              backgroundColor: '#0071ba',
            }}
          >
            {title}
          </DialogTitle>
          <DialogContent dividers={true}>
            <div>
              <Document file={pdfURL} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onLoadError}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} width={1000} />
                ))}
              </Document>
            </div>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" color="error" onClick={hide}>
              {intl.formatMessage({ id: 'button.close' })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>,
    document.body
  );
};

export default withTranslation()(withStyles(styles)(NavBar));
