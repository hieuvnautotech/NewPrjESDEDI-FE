import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InfoIcon from '@mui/icons-material/Info';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import React, { useImperativeHandle, useRef, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { useUserStore } from '@stores';

const StyledButton = styled(Button)(({ theme, text, color }) => ({
  width: 80,
  margin: theme.spacing(0.5),

  // textAlign: 'center',
  // backgroundColor: color ? theme.palette[color].light : undefined
}));

const MuiButton = React.forwardRef((props, ref) => {
  const { palette } = createTheme();

  const { augmentColor } = palette;

  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

  const theme = createTheme({
    palette: {
      create: createColor('#66bb6a'),
      modify: createColor('#ef7d00'),
      delete: createColor('#ff0000'),
      reuse: createColor('#ff0000'),
      save: createColor('#ffbf00'),
      cancel: createColor('#e42313'),
      search: createColor('#0000ff'),
      download: createColor('#e06666'),
      upload: createColor('#2596be'),
      print: createColor('#6a329f'),
      scan: createColor('#243782'),
      split: createColor('#ff0000'),
      receive: createColor('#bf9000'),
      info: createColor('#29b6f6'),
      close: createColor('#ff0000'),
    },
  });

  const { btnText, variant, color, onClick, disabled, type, permission, ...others } = props;

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

  const str = `button.${btnText.toLowerCase()}`;

  const renderIcon = (btnText) => {
    switch (btnText.toLowerCase()) {
      case 'create':
        return <AddIcon />;

      case 'modify':
        return <DriveFileRenameOutlineIcon />;

      case 'delete':
        return <DeleteIcon />;

      case 'reuse':
        return <ReplayIcon />;

      case 'save':
        return <SaveIcon />;

      case 'cancel':
        return <BlockIcon />;

      case 'search':
        return <SearchIcon />;

      case 'download':
        return <FileDownloadIcon />;

      case 'upload':
        return <FileUploadIcon />;

      case 'print':
        return <LocalPrintshopIcon />;

      case 'scan':
        return <DocumentScannerIcon />;

      case 'split':
        return <SplitscreenIcon />;

      case 'receive':
        return <VolunteerActivismIcon />;

      case 'close':
        return <CloseIcon />;

      default:
        return <InfoIcon />;
    }
  };

  const setBtnVariant = (btnText) => {
    if (['upload', 'download', 'close'].includes(btnText)) {
      return 'outlined';
    } else {
      return variant ?? 'contained';
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

    if (ref.current.permission && ref.current.permission !== 'allowAll') {
      let flag = true;
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
        <ThemeProvider theme={theme}>
          <StyledButton
            ref={internalValue}
            variant={setBtnVariant(btnText)}
            color={btnText ?? 'info'}
            disabled={btnDisabled}
            onClick={onClick}
            type={type ?? 'button'}
            style={display ? null : { display: 'none' }}
            {...others}
          >
            {renderIcon(btnText)}
          </StyledButton>
        </ThemeProvider>
      </span>
    </Tooltip>
  );
});

export default MuiButton;
