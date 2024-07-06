import { Download } from '@mui/icons-material';
import { ListItem, ListItemButton } from '@mui/material';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useEffect, useRef, useState } from 'react';
export default function InstallAppBtn({ className }) {
  const installWrapperRef = useRef(null);
  const [show, setShow] = useState(false);
  const deferredPrompt = useRef(null);

  useEffect(() => {
    if ('BeforeInstallPromptEvent' in window) {
    } else {
      setShow(false);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt.current = e;

      setShow(true);
    });

    window.addEventListener('appinstalled', (e) => {
      SuccessAlert('Đã cài đặt ESD');
    });
  }, [installWrapperRef.current]);
  function installApp() {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      deferredPrompt.current.userChoice.then(({ outcome }) => {
        deferredPrompt.current = null;
        // Act on the user's choice
        if (outcome === 'accepted') {
        } else if (outcome === 'dismissed') {
          ErrorAlert('Bạn đã hủy cài đặt ứng dụng');
        }
        setShow(false);
      });
    }
  }

  return (
    show && (
      <>
        {className ? (
          <li className={`nav-item ${className}`} ref={installWrapperRef}>
            <a className="nav-link cursor-pointer" title="Install App" onClick={installApp}>
              <i className="fas fa-download"></i>
            </a>
          </li>
        ) : (
          <ListItem disablePadding ref={installWrapperRef}>
            <ListItemButton onClick={installApp}>
              <Download />
            </ListItemButton>
          </ListItem>
        )}
      </>
    )
  );
}
