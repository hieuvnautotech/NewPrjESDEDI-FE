import React, { useImperativeHandle, useRef } from 'react';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import Tooltip from '@mui/material/Tooltip';

const StyledButton = styled(Button)(({ theme, color }) => ({
  width: 80,
  margin: theme.spacing(0.5),
  // backgroundColor: color ? theme.palette[color].light : undefined
}));

const MuiResetButton = React.forwardRef((props, ref) => {
  const { onClick, ...others } = props;

  // const internalValue = useRef('');

  // useImperativeHandle(ref, () => ({
  //   setValue: (value) => {
  //     internalValue.current = value;
  //   },
  //   getValue: () => {
  //     return internalValue.current;
  //   },
  // }));

  return (
    <Tooltip title={<FormattedMessage id="button.reset" />} followCursor>
      <span>
        <StyledButton ref={ref} variant="outlined" color="secondary" onClick={onClick} {...others}>
          <RefreshIcon />
        </StyledButton>
      </span>
    </Tooltip>
  );
});

export default MuiResetButton;
