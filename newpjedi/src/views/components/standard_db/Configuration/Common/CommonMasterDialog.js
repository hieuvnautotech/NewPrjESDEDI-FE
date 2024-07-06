import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiDialog, MuiResetButton, MuiSubmitButton, MuiTextField } from '@controls';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { commonService } from '@services';
import { useUserStore } from '@stores';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const CommonMasterDialog = (props) => {
  const { mode, initModel, setNewData, setModifyData, setUpdateData, isOpen, onClose } = props;

  const isRendered = useRef(false);

  const intl = useIntl();

  const user = useUserStore((state) => state.user);

  const [dialogState, setDialogState] = useState({
    ...initModel,
    isSubmit: false,
  });

  const [roleArr, setRoleArr] = useState([]);

  const schema = yup.object().shape({
    commonMasterName: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schema,
    initialValues: { ...initModel },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { ResponseMessage, Data } =
        mode === ACTION.CREATE
          ? await commonService.createCommonMaster(values)
          : await commonService.modifyCommonMaster(values);
      if (isRendered.current) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        if (mode === ACTION.CREATE) {
          setNewData(() => {
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
        setDialogState((currentDialogState) => {
          return { ...currentDialogState, isSubmit: false };
        });
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
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
    if (user && user.RoleCodeList) {
      const roles = user.RoleCodeList.replace(' ', '').split(',');
      setRoleArr(() => {
        return [...roles];
      });
    }
  }, [user]);

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
            <Grid container spacing={2}>
              <Grid item xs={roleArr.includes('000') ? 9 : 12}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'model.commonMaster.field.commonMasterName' })}
                  name="commonMasterName"
                  value={values.commonMasterName}
                  onChange={handleChange}
                  error={touched.commonMasterName && Boolean(errors.commonMasterName)}
                  helperText={touched.commonMasterName && errors.commonMasterName}
                />
              </Grid>
              {roleArr.includes('000') && (
                <Grid item xs={3}>
                  <FormControlLabel
                    control={<Checkbox checked={values.forRoot} />}
                    label="For Root"
                    name="forRoot"
                    onChange={formik.handleChange}
                  />
                </Grid>
              )}
            </Grid>
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

export default CommonMasterDialog;
