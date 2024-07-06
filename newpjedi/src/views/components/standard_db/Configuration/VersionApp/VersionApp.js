import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import AndroidIcon from '@mui/icons-material/Android';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Card, CardActions, Collapse, Grid, IconButton, TextField } from '@mui/material';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { versionAppService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { LinearProgressWithLabel, MuiGridWrapper } from '@controls';

import { VersionAppDto } from '@models';

// const CHPLAY_URL = 'https://play.google.com/store/apps/details?id=com.evilhero.solumapp';
const CHPLAY_URL = '';

const VersionApp = ({ t, ...props }) => {
  const { language } = props;

  const isRendered = useRef(true);
  const intl = useIntl();

  const [appList, setAppList] = useState([]);
  const [data, setData] = useState({ ...VersionAppDto, isShowing: false });
  const [error, setError] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputKey, setInputKey] = useState(null);

  const getListApkApp = async () => {
    const { HttpResponseCode, ResponseMessage, Data } = await versionAppService.getListApkApp();

    if (isRendered.current)
      if (HttpResponseCode === 200 && Data) {
        setAppList(() => {
          return Data;
        });
      } else {
        setAppList(() => {
          return [];
        });
      }
  };

  const openConfig = (appCode) => {
    if (data && data.app_code === appCode) {
      setData(() => {
        return { ...VersionAppDto, isShowing: false };
      });
    } else {
      const selectedApp = appList.find((item) => appCode === item.app_code);
      setData(() => {
        return { ...selectedApp, isShowing: true };
      });
    }

    resetInputFile();
  };

  const changeHandler = async (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const resetInputFile = async () => {
    const randomKey = Math.random().toString(36);
    setInputKey(randomKey);
    setSelectedFile(null);
  };

  const handleDownload = async (appCode) => {
    try {
      await versionAppService.downloadApp(appCode);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (app) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('id_app', app.id_app ?? 0);
    formData.append('app_code', app.app_code ?? '');
    formData.append('app_version', app.app_version);
    formData.append('CHPlay_version', app.CHPlay_version);
    formData.append('link_url', app.link_url ?? CHPLAY_URL);
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);

        if (percent <= 100) {
          setUploadPercentage((prev) => percent);
        }
      },
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    setUploading(true);
    const { HttpResponseCode, ResponseMessage, Data } = await versionAppService.modify(formData, options);
    if (HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
      setData(() => {
        return { ...VersionAppDto, isShowing: false };
      });
      setAppList(() => {
        return Data;
      });
      await resetInputFile();
    } else {
      ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
    }
    setUploading(false);
    setUploadPercentage(0);
  };

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
    };
  }, []);

  useEffect(() => {
    window.i18n.changeLanguage(language.toString().toLowerCase());

    getListApkApp();
  }, [language]);

  return (
    <React.Fragment>
      <MuiGridWrapper>
        {appList.length &&
          appList.map((app) => {
            /* console.log('🚀 ~ file: VersionApp.js:204 ~ appList.map ~ app:', app); */
            return (
              <Card sx={{ textAlign: 'center' }} key={app.app_code}>
                {app != null ? (
                  <>
                    <AndroidIcon sx={{ fontSize: 180, margin: 'auto', display: 'block' }} />
                    <p style={{ fontWeight: 600, fontSize: '28px' }}> {app.name_file}</p>
                    <p>App code: {app.app_code}</p>
                    <p>Version: {app.app_version}</p>
                    <p>Date: {app.change_date}</p>
                    <Button
                      variant="contained"
                      sx={{ m: 1 }}
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(app.app_code)}
                    >
                      {t('Download')}
                    </Button>
                  </>
                ) : null}

                <CardActions disableSpacing>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => openConfig(app.app_code)}
                    sx={{ mr: 2 }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </CardActions>
              </Card>
            );
          })}
      </MuiGridWrapper>

      <Grid container direction={'row'} justifyContent={'center'} alignItems={'center'} sx={{ mt: 2 }}>
        <Card sx={{ textAlign: 'center', width: 700 }}>
          <Collapse in={data.isShowing} timeout="auto" unmountOnExit sx={{ pr: 3, pl: 3 }}>
            <TextField fullWidth type="text" margin="dense" label="App Code" value={data.app_code ?? ''} disabled />
            {/* <TextField
              fullWidth
              type="text"
              margin="dense"
              label="Version"
              value={data.app_version ?? ''}
              onChange={(e) => {
                setData({ ...data, app_version: e.target.value });
                setError({
                  ...error,
                  app_version:
                    e.target.value == ''
                      ? 'This field is required.'
                      : e.target.value.length > 8
                      ? 'Max length is 8 letter.'
                      : '',
                });
              }}
              error={error.app_version ? true : false}
              helperText={error.app_version ? error.app_version : ''}
            /> */}
            <TextField
              fullWidth
              type="text"
              margin="dense"
              label="CH Play Version"
              value={data.CHPlay_version ?? ''}
              onChange={(e) => {
                setData({ ...data, CHPlay_version: e.target.value });
                setError({
                  ...error,
                  CHPlay_version:
                    e.target.value == ''
                      ? 'This field is required.'
                      : e.target.value.length > 8
                      ? 'Max length is 8 letter.'
                      : '',
                });
              }}
              error={error.CHPlay_version ? true : false}
              helperText={error.CHPlay_version ? error.CHPlay_version : ''}
            />
            <TextField
              fullWidth
              type="text"
              margin="dense"
              label="Url"
              disabled={data.app_code === 'ESD_PDA'}
              value={data.link_url ?? ''}
              onChange={(e) => {
                setData({ ...data, link_url: e.target.value });
              }}
            />
            <input
              type="file"
              name="file"
              key={inputKey || ''}
              onChange={changeHandler}
              style={{ float: 'left', marginTop: '20px' }}
              disabled={data.app_code === 'ESD_PDA'}
            />
            {uploading && (
              <Box sx={{ display: 'inline-block', width: '100%' }}>
                <LinearProgressWithLabel value={uploadPercentage} />
              </Box>
            )}
            <div style={{ marginBottom: '20px' }}>
              <Button
                disabled={uploading}
                variant="contained"
                sx={{ mt: 3, width: '100%', height: '56px' }}
                startIcon={<FileUploadIcon />}
                onClick={() => handleUpload(data)}
              >
                {t('Upload')}
              </Button>
            </div>
          </Collapse>
        </Card>
      </Grid>
    </React.Fragment>
  );
};

User_Operations.toString = () => {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  return { language };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionApp);
