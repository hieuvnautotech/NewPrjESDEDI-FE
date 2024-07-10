import { Button, Card } from '@mui/material';
import ImageUploading from 'react-images-uploading';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import drag_drop_image from '@static/images/drag_drop_image.png';

const ImageUpload = (props) => {
  const { images, setImages, multiple, maxNumber } = props;

  const onChange = (imageList, addUpdateIndex) => {
    //// data for submit
    // console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <ImageUploading
      multiple={multiple}
      value={images}
      onChange={onChange}
      maxNumber={maxNumber ?? 69}
      dataURLKey="data_url"
      acceptType={['jpg', 'jpeg', 'png']}
    >
      {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
        // write your building UI
        <Card>
          <Button onClick={onImageRemoveAll}>{multiple ? 'Remove all images' : 'Remove image'}</Button>

          {multiple ? (
            <ImageList
              sx={{
                minWidth: 200,
                minHeight: 200,
              }}
              {...dragProps}
            >
              {imageList.length ? (
                imageList.map((image, index) => (
                  <ImageListItem key={index}>
                    <img src={image.data_url} alt="" loading="lazy" style={{ height: '200px', objectFit: 'contain' }} />
                    <ImageListItemBar
                      title={image.file.name}
                      // subtitle={item.author}
                      actionIcon={
                        <IconButton
                          sx={{ color: 'rgba(255, 0, 0)' }}
                          aria-label={image.file.name}
                          onClick={() => onImageRemove(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))
              ) : (
                <Button
                  style={{
                    backgroundImage: `url(${drag_drop_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    height: 200,
                  }}
                  onClick={onImageUpload}
                  {...dragProps}
                />
              )}
            </ImageList>
          ) : (
            <ImageList
              sx={{
                minWidth: 200,
                minHeight: 200,
              }}
              {...dragProps}
            >
              <Button
                style={{
                  backgroundImage: !imageList.length ? `url(${drag_drop_image})` : null,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  height: 200,
                }}
                onClick={onImageUpload}
                {...dragProps}
              >
                {imageList.map((image, index) => (
                  <ImageListItem key={index}>
                    <img src={image.data_url} alt="" loading="lazy" style={{ height: '200px', objectFit: 'contain' }} />
                    <ImageListItemBar
                      title={image.file.name}
                      // subtitle={item.author}
                    />
                  </ImageListItem>
                ))}
              </Button>
            </ImageList>
          )}
        </Card>
      )}
    </ImageUploading>
  );
};

export default ImageUpload;
