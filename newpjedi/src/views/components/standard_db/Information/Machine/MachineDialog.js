import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiDialog, MuiResetButton, MuiSubmitButton, MuiTextField } from '@controls';
import { Grid } from '@mui/material';
import { machineService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const MachineDialog = ({ initModal, isOpen, onClose, updateDataOnGrid, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    MachineCode: yup
      .string()
      .nullable()
      .required(
        intl.formatMessage({
          id: 'general.field_required',
        })
      ),
    MachineName: yup
      .string()
      .nullable()
      .required(
        intl.formatMessage({
          id: 'general.field_required',
        })
      ),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode == ACTION.CREATE ? defaultValue : initModal,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleCloseDialog = (fetchData) => {
    resetForm();
    onClose(fetchData);
  };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });
    if (mode == ACTION.CREATE) {
      const res = await machineService.create(data);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
        updateDataOnGrid();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await machineService.update(data);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        updateDataOnGrid();
        setDialogState({ ...dialogState, isSubmit: false });
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };
  return (
    <MuiDialog
      maxWidth={'sm'}
      title={intl.formatMessage({ id: mode === ACTION.CREATE ? 'general.create' : 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      bgColor={mode === ACTION.CREATE ? DIALOG.SUCCESS : DIALOG.WARNING}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{
            xs: 1,
            sm: 2,
            md: 3,
          }}
        >
          <Grid item xs={12}>
            <MuiTextField
              disabled={dialogState.isSubmit}
              value={values.MachineCode}
              name="MachineCode"
              onChange={handleChange}
              label={intl.formatMessage({ id: 'model.machine.field.machineCode' })}
              required
              error={touched.MachineCode && Boolean(errors.MachineCode)}
              helperText={touched.MachineCode && errors.MachineCode}
            />
          </Grid>

          <Grid item xs={12}>
            <MuiTextField
              disabled={dialogState.isSubmit}
              value={values.MachineName}
              name="MachineName"
              onChange={handleChange}
              label={intl.formatMessage({ id: 'model.machine.field.machineName' })}
              required
              error={touched.MachineName && Boolean(errors.MachineName)}
              helperText={touched.MachineName && errors.MachineName}
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

const defaultValue = {
  MachineCode: '',
  MachineName: '',
};

export default MachineDialog;
