import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, TextField } from '@mui/material';
import { roleService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const RoleDialog = ({ initModal, isOpen, onClose, setNewData, setRowData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const schema = yup.object().shape({
    roleName: yup.string().required(intl.formatMessage({ id: 'model.role.error_message.roleName_required' })),
  });

  const {
    control,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: initModal,
  });

  useEffect(() => {
    if (mode == ACTION.CREATE) reset({});
    else reset(initModal);
  }, [initModal, mode]);

  const handleReset = () => {
    reset();
    clearErrors();
  };

  const handleCloseDialog = () => {
    reset();
    clearErrors();
    onClose();
  };

  const onSubmit = async (data) => {
    setDialogState((prevState) => {
      return { ...prevState, isSubmit: true };
    });

    if (mode == ACTION.CREATE) {
      const { HttpResponseCode, ResponseMessage, Data } = await roleService.createRole({ ...data });

      setDialogState((prevState) => {
        return { ...prevState, isSubmit: false };
      });

      if (HttpResponseCode === 200 && Data) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        setNewData(() => {
          return Data;
        });

        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const { HttpResponseCode, ResponseMessage, Data } = await roleService.updateRole({
        ...data,
        roleId: initModal.roleId,
        row_version: initModal.row_version,
      });

      setDialogState((prevState) => {
        return { ...prevState, isSubmit: false };
      });

      if (HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        setRowData(() => {
          return Data;
        });
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
      }
    }
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: mode == ACTION.CREATE ? 'general.create' : 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      bgColor={mode == ACTION.CREATE ? DIALOG.SUCCESS : DIALOG.WARNING}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label={intl.formatMessage({ id: 'model.role.field.roleName' })}
              {...register('roleName')}
              error={!!errors?.roleName}
              helperText={errors?.roleName ? errors.roleName.message : null}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={intl.formatMessage({ id: 'model.role.field.roleDescription' })}
              {...register('roleDescription')}
            />
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

export default RoleDialog;
