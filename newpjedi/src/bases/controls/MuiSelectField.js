import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';

const MuiSelectField = forwardRef(
  (
    {
      value,
      options,
      displayLabel,
      displayValue,
      displayGroup,
      onChange,
      // onOpen,
      defaultValue,
      sx,
      margin,
      disabled,
      label,
      error,
      helperText,
      variant,
      required,
    },
    ref
  ) => {
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

    // const foo = () => {};

    return !displayGroup ? (
      <Autocomplete
        ref={internalValue}
        fullWidth
        disabled={disabled}
        size="small"
        margin={margin}
        options={options}
        value={value}
        autoHighlight
        openOnFocus
        getOptionLabel={(option) => option[displayLabel]}
        isOptionEqualToValue={(option, value) => option[displayValue] === value[displayValue]}
        defaultValue={defaultValue ?? null}
        onChange={onChange}
        // onOpen={onOpen ?? foo}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              sx={sx ?? { mb: 0.5 }}
              variant={variant}
              label={labelFomart}
              error={error}
              helperText={helperText}
            />
          );
        }}
      />
    ) : (
      <Autocomplete
        ref={internalValue}
        fullWidth
        disabled={disabled}
        size="small"
        margin={margin}
        options={options}
        value={value}
        autoHighlight
        openOnFocus
        groupBy={(option) => option[displayGroup]}
        getOptionLabel={(option) => option[displayLabel]}
        isOptionEqualToValue={(option, value) => option[displayValue] === value[displayValue]}
        defaultValue={defaultValue ?? null}
        onChange={onChange}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              sx={sx ?? { mb: 0.5 }}
              variant={variant}
              label={labelFomart}
              error={error}
              helperText={helperText}
            />
          );
        }}
        renderGroup={(params) => {
          return (
            <div key={'group' + params.key}>
              <div
                style={{
                  textIndent: '10px',
                  marginBottom: 10,
                  background: '#0288d1',
                }}
              >
                <span style={{ fontSize: 14, color: 'white' }}>{params.group}</span>
              </div>
              <div style={{ textIndent: '15px', marginBottom: 10 }}>{params.children}</div>
            </div>
          );
        }}
      />
    );
  }
);

export default MuiSelectField;
