import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';

const MuiAutocomplete = React.forwardRef((props, ref) => {
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
    colorTxt,
  } = props;

  const isRendered = useRef(false);

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

  let labelFomart = label;
  if (required) labelFomart += ' *';

  const [open, setOpen] = useState(false);
  const [isFetchData, setIsFetchData] = useState(true);

  const [options, setOptions] = useState([]);

  const loading = open && isFetchData && options.length === 0;

  const setOptionData = async () => {
    const { Data } = await fetchDataFunc();

    if (isRendered.current) {
      setIsFetchData(() => {
        return false;
      });
      // setOptions(Data ?? []);
      setOptions(() => {
        return Data ?? [];
      });
    }
  };

  // const [textFontSize, setTextFontSize] = useState(INHERIT);

  // const handleChangeTextFontSize = useDebouncedCallback(async () => {
  //   if (window.innerWidth >= 1536) {
  //     setTextFontSize(() => {
  //       return INHERIT;
  //     });
  //   }

  //   if (window.innerWidth >= 900 && window.innerWidth < 1536) {
  //     setTextFontSize(() => {
  //       return REM_9;
  //     });
  //   }

  //   if (window.innerWidth < 900) {
  //     setTextFontSize(() => {
  //       return REM_8;
  //     });
  //   }
  // }, 300);

  // useEffect(() => {
  //   window.addEventListener('resize', handleChangeTextFontSize);

  //   return () => {
  //     window.removeEventListener('resize', handleChangeTextFontSize);
  //   };
  // }, []);

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    // (async () => {
    //   const { Data } = await fetchDataFunc();
    //   if (isRendered.current) {
    //     setIsFetchData(() => {
    //       return false;
    //     });
    //     setOptions(() => {
    //       return Data ?? [];
    //     });
    //   }
    // })();

    setOptionData();
  }, [
    loading,
    // , inputValue
  ]);

  useEffect(() => {
    if (!open) {
      setOptions(() => {
        return [];
      });
    } else {
      setIsFetchData(() => {
        return true;
      });
    }
  }, [open]);

  return (
    <React.Fragment>
      {!displayGroup ? (
        <Autocomplete
          ref={internalValue}
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
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                sx={sx ?? { mb: 0.5 }}
                variant={variant}
                label={labelFomart}
                error={error}
                helperText={helperText}
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { color: colorTxt ? colorTxt : 'black' },
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
          ref={internalValue}
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
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                sx={sx ?? { mb: 0.5 }}
                variant={variant}
                label={labelFomart}
                error={error}
                helperText={helperText}
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { color: colorTxt ? colorTxt : 'black' },
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

export default MuiAutocomplete;
