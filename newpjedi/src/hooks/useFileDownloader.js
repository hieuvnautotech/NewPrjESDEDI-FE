import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import FileDownloader from '../bases/controls/FileDownloader';

const useFileDownloader = () => {
  const [files, setFiles] = useState(() => []);

  const download = ({ params, url }) => {
    const file = {
      params: params,
      url: url,
      downloadId: '',
    };
    // console.log('🚀 ~ file: useFileDownloader.js:14 ~ download ~ file:', file);

    setFiles((fileList) => {
      return [...fileList, { ...file, downloadId: uuid() }];
    });
  };

  const remove = (removeId) =>
    setFiles((files) => {
      const newArr = [...files.filter((file) => file.downloadId !== removeId)];
      return newArr;
    });

  return [(e) => download(e), files.length > 0 ? <FileDownloader files={files} remove={(e) => remove(e)} /> : null];
};

export default useFileDownloader;
