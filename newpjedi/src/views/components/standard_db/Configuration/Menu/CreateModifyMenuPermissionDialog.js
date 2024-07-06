import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { ImageUpload, MuiDialog, MuiResetButton, MuiSubmitButton, MuiTextField } from '@controls';
import { menuService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

import { Checkbox, FormControlLabel, Grid } from '@mui/material';

const CreateModifyMenuPermissionDialog = ({
  mode,
  menuId,
  initModel,
  setCreateRow,
  setModifyRow,
  setSelectedRow,
  isOpen,
  onClose,
}) => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const [dialogState, setDialogState] = useState({
    isSubmit: false,
  });

  const [images, setImages] = useState([]);

  const schema = yup.object().shape({
    MP_Name: yup.string().nullable().required(),

    MP_Description: yup.string().nullable().required(),
  });

  const formik = useFormik({
    validationSchema: schema,
    initialValues: { ...initModel },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const postData = { ...values, menuId: menuId, photo: images[0]?.data_url ?? '' };

      const { HttpResponseCode, ResponseMessage, Data } =
        mode === ACTION.CREATE
          ? await menuService.createMenuPermission(postData)
          : await menuService.modifyMenuPermission(postData);

      if (isRendered.current && HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        if (mode === ACTION.CREATE) {
          setCreateRow(() => {
            return Data ?? initModel;
          });
        } else {
          setModifyRow(() => {
            return Data ?? initModel;
          });
          setSelectedRow(() => {
            return Data ?? initModel;
          });
        }
      } else {
        ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
      }
      setDialogState((currentDialogState) => {
        return { ...currentDialogState, isSubmit: false };
      });
      if (mode === ACTION.MODIFY) {
        handleCloseDialog();
      }
    },
  });
  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const loadImage = () => {
    if (initModel.photo)
      setImages([
        {
          data_url: initModel.photo,
          file: {
            name: initModel.MP_Name,
          },
        },
      ]);
  };

  const handleReset = () => {
    resetForm();
    loadImage();
  };

  const handleCloseDialog = () => {
    resetForm();
    setImages();
    onClose();
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
    if (isOpen) {
      formik.initialValues = { ...initModel };
      loadImage();
    }
  }, [initModel, isOpen]);

  return (
    <React.Fragment>
      <MuiDialog
        maxWidth="md"
        title={
          mode === ACTION.CREATE
            ? intl.formatMessage({ id: 'general.create' })
            : intl.formatMessage({ id: 'general.modify' })
        }
        isOpen={isOpen}
        disabledCloseBtn={dialogState.isSubmit}
        disable_animate={300}
        onClose={handleCloseDialog}
        bgColor={mode === ACTION.CREATE ? DIALOG.SUCCESS : DIALOG.WARNING}
      >
        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <MuiTextField
                    autoFocus
                    label={intl.formatMessage({ id: 'model.menuPermission.field.MP_Name' })}
                    name="MP_Name"
                    value={values.MP_Name}
                    onChange={handleChange}
                    error={Boolean(touched.MP_Name && errors.MP_Name)}
                    helperText={touched.MP_Name && errors.MP_Name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    checked={values.forRoot}
                    onChange={() => setFieldValue('forRoot', !values.forRoot)}
                    control={<Checkbox />}
                    label={intl.formatMessage({ id: 'model.menuPermission.field.forRoot' })}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <MuiTextField
                    label={intl.formatMessage({ id: 'model.menuPermission.field.MP_Description' })}
                    name="MP_Description"
                    value={values.MP_Description}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    error={Boolean(touched.MP_Description && errors.MP_Description)}
                    helperText={touched.MP_Description && errors.MP_Description}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <ImageUpload images={images} setImages={setImages} />
            </Grid>

            <Grid item xs={12}>
              <Grid container direction="row-reverse">
                <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
                <MuiResetButton onClick={handleReset} disabled={dialogState.isSubmit} />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </MuiDialog>
    </React.Fragment>
  );
};

export default CreateModifyMenuPermissionDialog;
