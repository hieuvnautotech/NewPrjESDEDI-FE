import { ContentPaste } from '@mui/icons-material';
import { ClickAwayListener, InputAdornment, Tooltip, Zoom } from '@mui/material';
import TextField from '@mui/material/TextField';
import { ErrorAlert } from '@utils';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

// import { debounce } from 'lodash';
const CustomPaste = ({ onPasteText }) => {
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const refTimout = useRef(null);
  useEffect(() => {
    return clearTimeout(refTimout.current);
  }, []);
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          TransitionComponent={Zoom}
          PopperProps={{
            placement: 'right',
          }}
          arrow
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Pasted"
        >
          <InputAdornment
            position="start"
            className="cursor-pointer"
            onClick={() =>
              navigator.clipboard
                .readText()
                .then((clipText) => {
                  onPasteText(clipText);
                  handleTooltipOpen();
                  refTimout.current = setTimeout(handleTooltipClose, 1000);
                })
                .catch((error) => {
                  console.log(error);
                  ErrorAlert('Permission denied.');
                })
            }
          >
            <ContentPaste />
          </InputAdornment>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};
const MuiTextField = React.forwardRef((props, ref) => {
  const { label, type, name, value, autoFocus, required, disabled, onChange, onBlur, error, helperText } = props;

  const internalValue = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          if (internalValue.current) {
            internalValue.current.focus();
          }
        },
        setValue: (value) => {
          internalValue.current.value = value;
        },
        getValue: () => {
          return internalValue.current.value;
        },
      };
    },
    []
  );

  let labelFormat = label;

  if (required) {
    labelFormat += ' *';
  }

  return (
    <TextField
      fullWidth
      inputRef={internalValue}
      type={type ?? 'text'}
      size="small"
      label={labelFormat}
      disabled={disabled}
      autoFocus={autoFocus ?? false}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error ?? false}
      helperText={helperText ?? ''}
      InputProps={{
        step: 'any',
        style: {
          color: label === 'Lot & Material No' ? 'white' : 'black',
        },
        endAdornment: props?.onPasteText && <CustomPaste onPasteText={props?.onPasteText} />,
      }}
      {...props}
    />
  );
});

export default MuiTextField;
