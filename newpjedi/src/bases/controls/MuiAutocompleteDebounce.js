import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';

import { useDebouncedCallback } from 'use-debounce';

const MuiAutocompleteDebounce = React.forwardRef((props, ref) => {
  const {
    value,
    fetchDataFunc,
    displayLabel,
    displayValue,
    displayGroup,
    onChange,
    defaultValue,
    sx,
    margin,
    disabled,
    label,
    error,
    helperText,
    variant,
    required,
    multiple,

    inputValue,
    onInputChange,
  } = props;

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

  const isRendered = useRef(false);
  const isFetchData = useRef(false);

  let labelFomart = label;
  if (required) labelFomart += ' *';

  const [open, setOpen] = useState(false);

  const [options, setOptions] = useState([]);

  const loading = open && isFetchData.current;

  const debounced = useDebouncedCallback(async () => {
    const { Data } = await fetchDataFunc();
    if (isRendered.current) {
      isFetchData.current = false;
      setOptions(() => {
        return Data ?? [];
      });
    }
  }, 300);

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
    };
  }, []);

  useEffect(() => {
    isFetchData.current = true;
    return () => {
      isFetchData.current = false;
    };
  }, []);

  useEffect(() => {
    // if (!loading) {
    //   return undefined;
    // }

    if (!open) {
      setOptions(() => {
        return [];
      });
    } else {
      isFetchData.current = true;
    }

    if (inputValue) {
      debounced();
    } else {
      setOptions(() => {
        return [];
      });
    }
  }, [open, inputValue]);

  return (
    <React.Fragment>
      {!displayGroup ? (
        <Autocomplete
          ref={ref}
          multiple={multiple}
          disableCloseOnSelect={multiple}
          fullWidth
          open={open}
          onOpen={() => {
            setOpen(() => {
              return true;
            });
          }}
          onClose={() => {
            setOpen(() => {
              return false;
            });
          }}
          disabled={disabled}
          size="small"
          margin={margin}
          options={options}
          value={value}
          autoHighlight
          openOnFocus
          getOptionLabel={(option) => option[displayLabel]}
          isOptionEqualToValue={(option, value) => option[displayValue] === value[displayValue]}
          defaultValue={defaultValue ?? (multiple ? [] : null)}
          onChange={onChange}
          inputValue={inputValue}
          onInputChange={onInputChange}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                sx={sx ?? { mb: 0.5 }}
                variant={variant}
                label={labelFomart}
                error={error}
                helperText={helperText}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            );
          }}
        />
      ) : (
        <Autocomplete
          ref={ref}
          multiple={multiple}
          disableCloseOnSelect={multiple}
          fullWidth
          open={open}
          onOpen={() => {
            setOpen(() => {
              return true;
            });
          }}
          onClose={() => {
            setOpen(() => {
              return false;
            });
          }}
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
          defaultValue={defaultValue ?? (multiple ? [] : null)}
          onChange={onChange}
          inputValue={inputValue}
          onInputChange={onInputChange}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                sx={sx ?? { mb: 0.5 }}
                variant={variant}
                label={labelFomart}
                error={error}
                helperText={helperText}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
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
      )}
    </React.Fragment>
  );
});

export default MuiAutocompleteDebounce;
