// import SearchIcon from '@mui/icons-material/Search';
// import FormControl from '@mui/material/FormControl';
// import IconButton from '@mui/material/IconButton';
// import Input from '@mui/material/Input';
// import InputAdornment from '@mui/material/InputAdornment';
// import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import React, { useRef, useImperativeHandle, useState, useEffect } from 'react';

import { useIntl } from 'react-intl';

import { debounce } from 'lodash';

const MuiSearchField = React.forwardRef((props, ref) => {
  const intl = useIntl();
  const { label, name, type, value, disabled, onClick, onChange, defaultValue, className } = props;

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

  // const handleChangeTextFontSize = () => {

  // }

  // let timer;

  // const handleMouseDown = (event) => {
  //   event.preventDefault();
  // };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      // console.log('value', e.target.value);
      onClick();
    }
  };

  // const handleChange = () => {
  //   timer = setTimeout(() => onChange(), 200);
  // };

  // useEffect(() => {
  //   // if (inputRef) {
  //   //   timer = setTimeout(() => lotInputRef.current.focus(), 500);
  //   // }

  //   return () => {
  //     if (timer) {
  //       console.log('clear timer');
  //       clearTimeout(timer);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   window.addEventListener('resize', handleChangeTextFontSize);

  //   return () => {
  //     window.removeEventListener('resize', handleChangeTextFontSize);
  //   };
  // }, []);

  return (
    <TextField
      sx={{ paddingBottom: '4px' }}
      inputRef={internalValue}
      fullWidth
      type={type ?? 'text'}
      size="small"
      variant="standard"
      // className={className ? className : ''}
      label={intl.formatMessage({ id: label })}
      disabled={disabled ?? false}
      name={name}
      // value={value}
      onChange={debounce(onChange, 200)}
      onKeyDown={keyPress}
      defaultValue={defaultValue || ''}
      // inputProps={{ style: { fontSize: textFontSize } }} // font size of input text
      // InputLabelProps={{ style: { fontSize: textFontSize } }} // font size of input label
    />
  );
});

export default MuiSearchField;
