import { InputAdornment, Paper, Popover, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { fontAwesomeClassList } from './fontAwesomeClassList';
import './IconSelector.css';
export default function IconSelector({ iconValue, setIconValue, label }) {
  const [open, setOpen] = React.useState(false);
  const id = open ? 'virtual-element-popover' : undefined;
  const [state, setState] = useState({
    fontIconPrefix: iconValue || '',
    fontIconWidth: 0,
    fontIconSearch: '',
    iconList: fontAwesomeClassList.map((i) => `fa ${i}`),
  });
  const inputRef = useRef();
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      fontIconSearch: '',
    }));
  }, [open]);
  const getInputWidth = () => {
    setState((prev) => ({
      ...prev,
      fontIconWidth: inputRef.current.offsetWidth + 50,
    }));
  };

  useEffect(() => {
    getInputWidth();
    window.addEventListener('resize', getInputWidth);
    return window.removeEventListener('resize', getInputWidth);
  }, []);
  const onColClick = (v) => {
    setState((prev) => ({
      ...prev,
      fontIconPrefix: v,
    }));
    setIconValue(v);
    handleClose();
  };
  const onInputChagne = (e) => {
    setState((prev) => ({ ...prev, fontIconSearch: e.target.value }));
  };
  const fontIconSheetsFilterList = () => {
    const list = [...state.iconList];
    if (!state.fontIconSearch) return list;
    let search = state.fontIconSearch.trim().toLowerCase();
    return list.filter((item) => {
      if (item.toLowerCase().indexOf(search) !== -1) return item;
    });
  };
  useEffect(() => {
    iconValue !== state.fontIconPrefix &&
      setState((prev) => ({
        ...prev,
        fontIconPrefix: iconValue,
      }));
  }, [iconValue]);
  return (
    <div>
      <TextField
        onClick={() => setOpen(true)}
        inputRef={inputRef}
        id="outlined-basic"
        label={label ?? 'Icon'}
        size="small"
        variant="outlined"
        value={state.fontIconPrefix}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <i className={state.fontIconPrefix} style={{ fontSize: 14, color: '#000' }} />
            </InputAdornment>
          ),
        }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={inputRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: -50 }}
        onClose={handleClose}
        className="icon-selector-popper"
        PaperProps={{ style: { width: state.fontIconWidth } }}
      >
        <div className="icon-selector-warp">
          <div className="icon-selector-warp-title m-2 ml-3">
            <TextField
              value={state.fontIconSearch}
              onChange={onInputChagne}
              label="Search"
              size="small"
              variant="outlined"
            />
          </div>
          <div className="icon-selector-warp-row">
            <div className="scrollbar">
              <div className="scrollbar-wrap">
                <div className="row p-2 m-0">
                  {fontIconSheetsFilterList().map((item, i) => (
                    <div key={i} className="col-xs-3 col-sm-2 col-lg-2 col-xl-2">
                      <div
                        onClick={() => onColClick(item)}
                        className={`icon-selector-warp-item ${
                          state.fontIconPrefix === item ? 'icon-selector-active' : ''
                        }`}
                      >
                        <i className={item} style={{ fontSize: 14, color: '#000' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
