import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';

const MuiDateField = forwardRef(
  ({ label, value, onChange, onBlur, sx, variant, margin, error, helperText, disabled, required }, ref) => {
    const internalValue = useRef(value ?? null);

    useImperativeHandle(ref, () => ({
      setValue: (value) => {
        internalValue.current.value = value;
      },
      getValue: () => {
        return internalValue.current.value;
      },
    }));

    let labelFomart = label;
    if (required) labelFomart += ' *';

    // const onKeyDown = (e) => {
    //   e.preventDefault();
    // };

    // const [textFontSize, setTextFontSize] = useState(INHERIT);

    // const handleChangeTextFontSize = useDebouncedCallback(async () => {
    //   if (window.innerWidth >= 1536) {
    //     setTextFontSize(() => {
    //       return INHERIT;
    //     });
    //   }

    //   if (window.innerWidth >= 900 && window.innerWidth < 1536) {
    //     setTextFontSize(() => {
    //       return REM_8;
    //     });
    //   }

    //   if (window.innerWidth >= 600 && window.innerWidth < 900) {
    //     setTextFontSize(() => {
    //       return REM_7;
    //     });
    //   }

    //   if (window.innerWidth < 600) {
    //     setTextFontSize(() => {
    //       return REM_6;
    //     });
    //   }
    // }, 300);

    // useEffect(() => {
    //   window.addEventListener('resize', handleChangeTextFontSize);

    //   return () => {
    //     window.removeEventListener('resize', handleChangeTextFontSize);
    //   };
    // }, []);

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          ref={internalValue}
          disabled={disabled}
          label={labelFomart}
          // sx={{ ...sx, fontSize: '10px' }}
          value={value ? value : null}
          onChange={(e) => onChange(e != null ? moment(e).format('YYYY-MM-DDT00:00:00') : null)}
          onBlur={onBlur}
          inputFormat="yyyy-MM-dd"
          renderInput={(params) => (
            <TextField
              fullWidth
              size="small"
              sx={{ ...sx, mb: 0.5 }}
              // onKeyDown={onKeyDown}
              margin={margin}
              variant={variant}
              {...params}
              error={error}
              helperText={helperText}
            />
          )}
        />
      </LocalizationProvider>
    );
  }
);

export default MuiDateField;
