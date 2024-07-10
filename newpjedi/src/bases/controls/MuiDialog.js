import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  Grow,
  IconButton,
  Paper,
  Slide,
  Zoom,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useIntl } from 'react-intl';
import ReactToPrint from 'react-to-print';
import { v4 as uuid } from 'uuid';
import { DIALOG } from '@constants/ConfigConstants';

import { isMobile } from 'react-device-detect';

const Transition_Zoom = React.forwardRef((props, ref) => {
  return <Zoom ref={ref} {...props} />;
});

const Transition_Fade = React.forwardRef((props, ref) => {
  return <Fade ref={ref} {...props} />;
});

const Transition_Grow = React.forwardRef((props, ref) => {
  return <Grow ref={ref} {...props} />;
});
const Transition_Slide_Down = React.forwardRef((props, ref) => {
  return <Slide ref={ref} {...props} />;
});

export const MuiDialog = ({
  isOpen,
  onClose,
  title,
  disable_animate,
  maxWidth,
  disabledCloseBtn,
  isShowButtonPrint,
  isLandscape,
  bgColor,
  ...others
}) => {
  const { animate } = others;

  const [dialogId, setDialogId] = React.useState(uuid());
  const [data, setData] = useState({});
  const componentPringtRef = React.useRef();
  const intl = useIntl();
  const btnRef_CloseDialog = useRef();
  const PaperComponent = React.useCallback((props) => {
    return (
      <Draggable handle={`#draggable-dialog-${dialogId}`} cancel={'[class*="MuiDialogContent-root"],.handleClose'}>
        <Paper {...props} />
      </Draggable>
    );
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      //console.log(reason);
      return;
    } else {
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      setData({});
    };
  }, [isOpen]);

  return (
    <Dialog
      TransitionComponent={
        animate === 'fade'
          ? Transition_Fade
          : animate === 'grow'
          ? Transition_Grow
          : animate === 'slide_down'
          ? Transition_Slide_Down
          : Transition_Zoom
      }
      transitionDuration={disable_animate || data[dialogId]?.disable_animate === true ? disable_animate : 250}
      PaperComponent={PaperComponent}
      aria-labelledby={`draggable-dialog-${dialogId}`}
      fullWidth
      maxWidth={maxWidth ?? 'md'}
      open={isOpen}
      onClose={handleClose}
      {...others}
      // fullScreen
    >
      <Paper
        sx={{
          cursor: 'move',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          backgroundColor: bgColor ?? DIALOG.INFO,
          borderBottomLeftRadius: '25px',
          borderBottomRightRadius: '25px',
        }}
      >
        <DialogTitle
        // sx={{
        //   cursor: 'move',
        //   textTransform: 'uppercase',
        //   color: '#0071ba',
        //   backgroundColor: '#CCCCCC',
        //   borderBottomLeftRadius: '25px',
        //   borderBottomRightRadius: '25px',
        // }}
        >
          {title}
          <IconButton
            className="handleClose"
            disabled={disabledCloseBtn}
            sx={{
              // top: '-12px',
              // right: '-12px',
              top: '10px',
              right: '5px',
              color: '#FF0000',
              borderRadius: '50%',
              position: 'absolute',
              backgroundColor: '#FFFFFF',
              // width: '35px',
              // height: '35px',
              '&:hover': {
                backgroundColor: '#FF0000',
                color: '#FFFFFF',
              },
              '&:disabled': {
                backgroundColor: 'aliceblue',
              },
              transition: '1s',
            }}
            onClick={handleClose}
            // color="primary"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Paper>
      {isLandscape && (
        <>
          <style type="text/css" media="print">
            {
              '\
                        @page { size: landscape}\
                        '
            }
          </style>
        </>
      )}
      <DialogContent ref={componentPringtRef}>{others.children}</DialogContent>
      {(isShowButtonPrint || isMobile) && (
        <DialogActions>
          <Grid container direction="row" alignItems="center" justifyContent="flex-end">
            {isShowButtonPrint && (
              <ReactToPrint
                trigger={() => {
                  return (
                    <Button variant="contained" color="primary">
                      {intl.formatMessage({ id: 'button.print' })}
                    </Button>
                  );
                }}
                content={() => componentPringtRef.current}
              />
            )}
          </Grid>
        </DialogActions>
      )}
      {others.footer && <>{others.footer}</>}
    </Dialog>
  );
};

export default MuiDialog;
// const mapStateToProps = (state) => ({})

// const mapDispatchToProps = {}

// export default connect(mapStateToProps, mapDispatchToProps)(MuiDialog)
