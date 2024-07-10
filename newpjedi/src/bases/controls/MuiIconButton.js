import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsIcon from '@mui/icons-material/Details';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InfoIcon from '@mui/icons-material/Info';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
// import { visuallyHidden } from '@mui/utils';

import { useUserStore } from '@stores';

const MuiIconButton = React.forwardRef((props, ref) => {
  const { btnText, size, disabled, onClick, permission, ...others } = props;

  const missingPermission = useUserStore((state) => state.missingPermission);

  const [display, setDisplay] = useState(true);
  const [btnDisabled, setBtnDisabled] = useState(true);

  const internalValue = useRef(null);
  useImperativeHandle(ref, () => ({
    // setValue: (value) => {
    //   internalValue.current = value;
    // },
    // getValue: () => {
    //   return internalValue.current;
    // },
    permission: permission ?? null,
  }));

  const str = `button.${btnText ? btnText.toLowerCase() : 'info'}`;

  const renderColor = (btnText) => {
    const toLowerCase = btnText ? btnText.toLowerCase() : null;

    switch (toLowerCase) {
      case 'create':
        return '#53a14d';

      case 'modify':
        return '#ef7d00';

      case 'delete':
        return '#ff0000';

      case 'reuse':
        return '#ff0000';

      case 'save':
        return '#ffbf00';

      case 'cancel':
        return '#e42313';

      case 'download':
        return '#ffdab9';

      case 'upload':
        return '#2596be';

      case 'print':
        return '#b482c2';

      case 'check':
        return '#e42313';

      case 'scan':
        return '#243782';

      case 'findbin':
        return '#0000ff';

      case 'view':
        return '#0000ff';

      case 'permission':
        return '#ffbf00';

      default:
        return '#42a5f5';
    }
  };

  const renderIcon = (btnText) => {
    const toLowerCase = btnText ? btnText.toLowerCase() : null;

    switch (toLowerCase) {
      case 'create':
        return <AddIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'modify':
        return <DriveFileRenameOutlineIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'delete':
        return <DeleteIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'reuse':
        return <ReplayIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'save':
        return <SaveIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'cancel':
        return <BlockIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'download':
        return <FileDownloadIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'upload':
        return <FileUploadIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'print':
        return <LocalPrintshopIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'check':
        return <CheckBoxIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'scan':
        return <DocumentScannerIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'findbin':
        return <ContentPasteSearchIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'view':
        return <DetailsIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      case 'permission':
        return <SecurityIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;

      default:
        return <InfoIcon fontSize="inherit" sx={{ color: `${renderColor(btnText)}` }} />;
    }
  };

  const setButtonDisabled = () => {
    if (display === false) {
      setBtnDisabled(() => {
        return true;
      });
    } else {
      setBtnDisabled(() => {
        return !disabled ? false : true;
      });
    }
  };

  useEffect(() => {
    // if (missingPermission.includes(ref.current.permission)) {
    //   setDisplay(false);
    // }
    let flag = true;
    if (ref.current.permission && ref.current.permission !== 'allowAll') {
      for (let i = 0; i < missingPermission.length; i++) {
        if (missingPermission[i] === ref.current.permission) {
          setDisplay(() => {
            return false;
          });
          flag = false;
          break;
        }
      }
      if (flag) {
        setDisplay(() => {
          return true;
        });
      }
    }
  }, [missingPermission]);

  useEffect(() => {
    setButtonDisabled();
  }, [display, disabled]);

  return (
    <Tooltip title={<FormattedMessage id={str} />} followCursor>
      <span>
        <IconButton
          aria-label={str ?? 'this is icon button'}
          ref={internalValue}
          size={size ?? 'small'}
          sx={[{ '&:hover': { border: `1px solid ${renderColor(btnText)}` } }]}
          disabled={btnDisabled}
          onClick={onClick}
          style={display ? null : { display: 'none', disabled: 'true' }}
          {...others}
        >
          {/* <span className={visuallyHidden}>{str ?? 'this is icon button'}</span> */}
          {renderIcon(btnText)}
        </IconButton>
      </span>
    </Tooltip>
  );
});

export default MuiIconButton;
