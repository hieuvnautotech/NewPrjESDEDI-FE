import { NotificationsActive } from '@mui/icons-material';
import { ListItem, ListItemButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import OneSignal from 'react-onesignal';
const OneSignalRegister = ({ className }) => {
  const registerWrapperRef = useRef(null);
  const [show, setShow] = useState(false);

  const notifyMe = (e) => {
    e.preventDefault();
    OneSignal?.showSlidedownPrompt({ force: true });
  };
  const onNotificationPermissionChange = (permissionChange) => {
    if (permissionChange.to === 'granted') {
      setShow(false);
    } else if (permissionChange.to === 'default') {
      setShow(true);
    }
  };
  useEffect(() => {
    OneSignal?.getNotificationPermission((permission) => {
      if (permission === 'granted') {
        setShow(false);
      } else if (permission === 'default') {
        setShow(true);
      }
    });

    OneSignal.on('notificationPermissionChange', onNotificationPermissionChange);
  }, [registerWrapperRef.current]);

  return (
    show && (
      <>
        {className ? (
          <li className={`nav-item ${className}`} ref={registerWrapperRef}>
            <a className={`nav-link cursor-pointer`} onClick={notifyMe} href="#" role="button" title="subscribe">
              <i className="fa fa-bell" aria-hidden="true"></i>
            </a>
          </li>
        ) : (
          <ListItem disablePadding ref={registerWrapperRef}>
            <ListItemButton onClick={notifyMe}>
              <NotificationsActive />
            </ListItemButton>
          </ListItem>
        )}
      </>
    )
  );
};

export default OneSignalRegister;
