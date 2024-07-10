import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MuiDateTimeField = forwardRef(
  ({ label, value, onChange, sx, variant, margin, error, helperText, disabled, required }, ref) => {
    const internalValue = useRef(value ?? null);

    // Expose the setValue method through the ref
    useImperativeHandle(ref, () => ({
      setValue: (value) => {
        internalValue.current.value = value;
      },
      getValue: () => {
        return internalValue.current.value;
      },
    }));

    let labelFormat = label;
    if (required) labelFormat += ' *';
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          ref={internalValue}
          disabled={disabled}
          label={labelFormat}
          value={value ? value : null}
          onChange={onChange}
          inputFormat="yyyy-MM-dd HH:mm"
          renderInput={(params) => (
            <TextField
              fullWidth
              size="small"
              sx={sx ?? { mb: 0.5 }}
              margin={margin}
              variant={variant ?? 'outlined'}
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

export default MuiDateTimeField;
