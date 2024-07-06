import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiDialog, MuiResetButton, MuiSelectField, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { documentService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const DocumentDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode, valueOption }) => {
  console.log('🚀 ~ file: DocumentDialog.js:12 ~ DocumentDialog ~ valueOption:', valueOption);

  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [selectedFile, setSelectedFile] = useState();

  const schema = yup.object().shape({
    menuComponent: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    documentLanguage: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schema,
    initialValues: mode === ACTION.CREATE ? defaultValue : initModal,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleReset = () => {
    document.getElementById('file').value = null;
    setSelectedFile(null);
    resetForm();
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (data) => {
    console.log('🚀 ~ file: DocumentDialog.js:48 ~ onSubmit ~ data:', data);

    setDialogState({ ...dialogState, isSubmit: true });

    if (mode === ACTION.CREATE) {
      const { HttpResponseCode, ResponseMessage, Data } = await documentService.createDocument(data, selectedFile);
      if (HttpResponseCode === 200 && Data) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        setNewData({ ...Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const { HttpResponseCode, ResponseMessage, Data } = await documentService.modifyDocument(data, selectedFile);
      if (HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        setUpdateData({ ...Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: mode === ACTION.CREATE ? 'general.create' : 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      bgColor={mode === ACTION.CREATE ? DIALOG.SUCCESS : DIALOG.WARNING}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            {mode === ACTION.CREATE ? (
              <MuiSelectField
                required
                value={values.menuComponent ? { menuComponent: values.menuComponent } : null}
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'model.document.field.menuComponent' })}
                options={valueOption.menuComponentList}
                displayLabel="menuComponent"
                displayValue="menuComponent"
                onChange={(e, value) => setFieldValue('menuComponent', value?.menuComponent || '')}
                error={touched.menuComponent && Boolean(errors.menuComponent)}
                helperText={touched.menuComponent && errors.menuComponent}
              />
            ) : (
              <TextField
                fullWidth
                size="small"
                disabled
                value={values.menuComponent}
                label={intl.formatMessage({ id: 'model.document.field.menuComponent' })}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            {mode === ACTION.CREATE ? (
              <MuiSelectField
                required
                value={values.documentLanguage ? { commonDetailName: values.documentLanguage } : null}
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'model.document.field.documentLanguage' })}
                options={valueOption.languageList}
                displayLabel="commonDetailName"
                displayValue="commonDetailName"
                onChange={(e, value) => setFieldValue('documentLanguage', value?.commonDetailName || '')}
                error={touched.documentLanguage && Boolean(errors.documentLanguage)}
                helperText={touched.documentLanguage && errors.documentLanguage}
              />
            ) : (
              <TextField
                fullWidth
                size="small"
                disabled
                value={values.documentLanguage}
                label={intl.formatMessage({ id: 'model.document.field.documentLanguage' })}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <input type="file" id="file" name="file" onChange={changeHandler} />
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
  );
};

const defaultValue = {
  documentId: null,
  menuComponent: '',
  menuName: '',
  documentLanguage: '',
  urlFile: '',
};

export default DocumentDialog;
