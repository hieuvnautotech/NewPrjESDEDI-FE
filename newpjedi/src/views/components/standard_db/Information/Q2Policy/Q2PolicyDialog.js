import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiTextField } from '@controls';
import { Grid } from '@mui/material';
import { policyService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const Q2PolicyDialog = ({ initModal, isOpen, onClose, updateDataOnGrid, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    ITEM_CODE: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    TRAND_TP: yup
      .string()
      .nullable()
      .required(
        intl.formatMessage({
          id: 'general.field_required',
        })
      ),
    CTQ_NO: yup
      .number()
      .integer()
      .nullable()
      .moreThan(
        0,
        intl.formatMessage(
          {
            id: 'general.field_min',
          },
          {
            min: 1,
          }
        )
      )
      .required(
        intl.formatMessage({
          id: 'general.field_required',
        })
      ),
    MIN_VALUE: yup
      .number()
      .nullable()
      .required(
        intl.formatMessage({
          id: 'general.field_required',
        })
      ),
    MAX_VALUE: yup
      .number()
      .nullable()
      .required(
        intl.formatMessage({
          id: 'general.field_required',
        })
      )
      .when('MIN_VALUE', function (value) {
        if (value != '' && value != null)
          return yup
            .number()
            .nullable()
            .moreThan(
              value,
              intl.formatMessage(
                {
                  id: 'general.field_min',
                },
                {
                  min: value,
                }
              )
            )
            .required(
              intl.formatMessage({
                id: 'general.field_required',
              })
            );
      }),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode === ACTION.CREATE ? defaultValue : initModal,
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
      const res = await policyService.create(data);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
        await updateDataOnGrid();
        // handleCloseDialog(true);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await policyService.update(data);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });

        await updateDataOnGrid();
        // handleCloseDialog(true);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };
  return (
    <MuiDialog
      maxWidth={'sm'}
      title={intl.formatMessage({ id: mode == ACTION.CREATE ? 'general.create' : 'general.modify' })}
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
              value={values.ITEM_CODE}
              name="ITEM_CODE"
              onChange={handleChange}
              label="Item Code"
              required
              error={touched.ITEM_CODE && Boolean(errors.ITEM_CODE)}
              helperText={touched.ITEM_CODE && errors.ITEM_CODE}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              label="Send Type"
              name="TRAND_TP"
              fetchDataFunc={() =>
                policyService.getSendType({
                  commonMasterCode: '002',
                })
              }
              displayLabel="commonDetailName"
              displayValue="commonDetailCode"
              onChange={(e, item) => {
                setFieldValue('TRAND_TP', item?.commonDetailCode);
                setFieldValue('TRAND_TP_NAME', item?.commonDetailName);
              }}
              error={touched.TRAND_TP && Boolean(errors.TRAND_TP)}
              helperText={touched.TRAND_TP && errors.TRAND_TP}
              value={
                values.TRAND_TP
                  ? {
                      commonDetailName: values.TRAND_TP_NAME,
                      commonDetailCode: values.TRAND_TP,
                    }
                  : null
              }
            />
          </Grid>
          <Grid item xs={12}>
            <MuiTextField
              disabled={dialogState.isSubmit}
              value={values.CTQ_NO}
              name="CTQ_NO"
              onChange={handleChange}
              label="CTQ No"
              required
              error={touched.CTQ_NO && Boolean(errors.CTQ_NO)}
              helperText={touched.CTQ_NO && errors.CTQ_NO}
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <MuiTextField
              disabled={dialogState.isSubmit}
              value={values.MIN_VALUE}
              name="MIN_VALUE"
              onChange={handleChange}
              label="Min Value"
              required
              error={touched.MIN_VALUE && Boolean(errors.MIN_VALUE)}
              helperText={touched.MIN_VALUE && errors.MIN_VALUE}
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <MuiTextField
              disabled={dialogState.isSubmit}
              value={values.MAX_VALUE}
              name="MAX_VALUE"
              onChange={handleChange}
              label="Max Value"
              required
              error={touched.MAX_VALUE && Boolean(errors.MAX_VALUE)}
              helperText={touched.MAX_VALUE && errors.MAX_VALUE}
              type="number"
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
  ITEM_CODE: '',
  TRAND_TP: null,
  CTQ_NO: '',
  MIN_VALUE: '',
  MAX_VALUE: '',
};

export default Q2PolicyDialog;
