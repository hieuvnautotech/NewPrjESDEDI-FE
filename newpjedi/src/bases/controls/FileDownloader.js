import * as ConfigConstants from '@constants/ConfigConstants';
import DoneIcon from '@mui/icons-material/Done';
import { axios } from '@utils';
import { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';

import Grid from '@mui/material/Grid';

import { useEffect, useRef } from 'react';

import { useIntl } from 'react-intl';

const FileDownloader = ({ files = [], remove }) => {
  const intl = useIntl();

  return (
    <div className="downloader">
      <div className="card">
        <div className="card-header">{intl.formatMessage({ id: 'general.Download_File' })}</div>
        <ul className="list-group list-group-flush">
          {files.map((file) => {
            return <DownloadItem key={uuid()} removeFile={() => remove(file.downloadId)} {...file} />;
          })}
        </ul>
      </div>
    </div>
  );
};

const DownloadItem = ({ params, url, removeFile }) => {
  const intl = useIntl();

  const [downloadInfo, setDownloadInfo] = useState({
    progress: 0,
    completed: false,
    total: 0,
    loaded: 0,
  });

  const [fileName, setFileName] = useState('');

  const timeOut = useRef();

  const handleDownload = async () => {
    const options = {
      onDownloadProgress: (progressEvent) => {
        const loaded = progressEvent.loaded;
        const total = progressEvent.lengthComputable ? progressEvent.total : -1;

        setDownloadInfo({
          progress: Math.floor((loaded * 100) / total),
          loaded,
          total,
          completed: false,
        });
      },
    };

    try {
      const result = await axios.get(url, {
        params,
      });

      setFileName(() => {
        const index = result.indexOf('\\');
        return result.substring(index + 1);
      });

      const api = `${ConfigConstants.BASE_URL}/${result}`;

      axios.get(api, options).then(() => {
        setDownloadInfo((info) => ({
          ...info,
          completed: true,
        }));

        window.location.href = api;

        timeOut.current = setTimeout(() => {
          removeFile();
        }, 3000);
      });
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  useEffect(() => {
    handleDownload();
    return () => {
      // 👇️ clear timeout when the component unmounts
      clearTimeout(timeOut.current);
    };
  }, []);

  const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <li className="list-group-item" style={{ backgroundColor: '#000000' }}>
      <div
        style={{
          overflowWrap: 'break-word',
          fontWeight: 'bold',
          color: '#FFFFFF',
        }}
      >
        {fileName}
      </div>
      <div className="col-12 mt-2">
        <ProgressBar variant="success" now={downloadInfo.progress} striped={true} label={`${downloadInfo.progress}%`} />
      </div>
      <Grid container direction="row" alignItems="center" justifyContent="space-between">
        <small>
          {downloadInfo.loaded > 0 && (
            <>
              <span className="text-success">{formatBytes(downloadInfo.loaded)}</span>
              <span className="text-white"> / </span>
              <span className="text-white">{formatBytes(downloadInfo.total)}</span>
            </>
          )}

          {downloadInfo.loaded === 0 && (
            <span className="text-white">{intl.formatMessage({ id: 'general.Initializing' })}</span>
          )}
        </small>

        {downloadInfo.completed && (
          <span className="text-success">
            {intl.formatMessage({ id: 'general.success' })} <DoneIcon />
          </span>
        )}
      </Grid>
    </li>
  );
};

export default FileDownloader;
