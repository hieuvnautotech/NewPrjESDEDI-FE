import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const StyledButton = styled(LoadingButton)(({ theme, color }) => ({
  width: 80,
  margin: theme.spacing(0.5),
  backgroundColor: color ? theme.palette[color].light : undefined,
}));

const MuiSubmitButton = forwardRef((props, ref) => {
  const { loading, variant, text, fullWidth } = props;

  // const internalValue = useRef('');

  // // Expose the setValue method through the ref
  // useImperativeHandle(ref, () => ({
  //   setValue: (value) => {
  //     internalValue.current = value;
  //   },
  //   getValue: () => {
  //     return internalValue.current;
  //   },
  // }));

  const str = `general.${text}`;

  const { palette } = createTheme();

  const { augmentColor } = palette;

  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

  const theme = createTheme({
    palette: {
      save: createColor('#ffbf00'),
    },
  });

  return (
    <Tooltip title={<FormattedMessage id={str} />} followCursor>
      <span>
        <ThemeProvider theme={theme}>
          <StyledButton
            loading={loading ?? false}
            variant={variant ?? 'contained'}
            type="submit"
            color="save"
            disabled={loading ?? false}
            fullWidth={fullWidth ? true : false}
          >
            <SaveIcon />
          </StyledButton>
        </ThemeProvider>
      </span>
    </Tooltip>
  );
});

export default MuiSubmitButton;
