import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import axios from 'axios';
import { LinearProgress } from '@mui/material';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewImage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setUploadComplete(true);
    } catch (error) {
      console.error('Upload error', error);
    }
  };

  return (
    <Box>
      <input style={{ display: 'none' }} id="contained-button-file" type="file" onChange={handleFileChange} />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span">
          Upload File
        </Button>
      </label>
      {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%' }} />}
      <Button variant="contained" onClick={handleUpload}>
        Submit
      </Button>
      {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} />}
      {uploadComplete && <p>Upload complete!</p>}
    </Box>
  );
};

export default FileUpload;
