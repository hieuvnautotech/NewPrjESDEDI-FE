import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiDialog, MuiResetButton, MuiSubmitButton, MuiTextField } from '@controls';
import Grid from '@mui/material/Grid';
import { commonService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const CommonDetailDialog = (props) => {
  const { mode, initModel, setCreateData, setModifyData, setUpdateData, isOpen, onClose } = props;

  const isRendered = useRef(false);

  const intl = useIntl();

  const [dialogState, setDialogState] = useState({
    ...initModel,
    isSubmit: false,
  });

  const schema = yup.object().shape({
    commonDetailName: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schema,
    initialValues: { ...initModel },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { ResponseMessage, Data, HttpResponseCode } =
        mode === ACTION.CREATE
          ? await commonService.createCommonDetail(values)
          : await commonService.modifyCommonDetail(values);
      if (isRendered.current && HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        if (mode === ACTION.CREATE) {
          setCreateData(() => {
            return Data ?? initModel;
          });
        } else {
          setModifyData(() => {
            return Data ?? initModel;
          });

          setUpdateData(() => {
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

  const handleCloseDialog = () => {
    resetForm();
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
    formik.initialValues = { ...initModel };
  }, [initModel]);

  return (
    <MuiDialog
      maxWidth="sm"
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
            <MuiTextField
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'model.commonDetail.field.commonDetailName' })}
              name="commonDetailName"
              value={values.commonDetailName}
              onChange={handleChange}
              error={touched.commonDetailName && Boolean(errors.commonDetailName)}
              helperText={touched.commonDetailName && errors.commonDetailName}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
              <MuiResetButton onClick={resetForm} disabled={dialogState.isSubmit} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

export default CommonDetailDialog;
