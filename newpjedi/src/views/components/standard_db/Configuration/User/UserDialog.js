import { DIALOG } from '@constants/ConfigConstants';
import { MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { userService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
const UserDialog = ({ initModal, isOpen, onClose, setNewData, rowData }) => {
  const intl = useIntl();
  const [roleList, setRoleList] = useState([]);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [roleUser, setRoleUser] = useState([]);

  const schema = yup.object().shape({
    userName: yup.string().required(intl.formatMessage({ id: 'model.user.error_message.userName_required' })),
    fullName: yup.string().required(intl.formatMessage({ id: 'model.user.error_message.fullName_required' })),
    userPassword: yup.string().required(intl.formatMessage({ id: 'model.user.error_message.userPassword_required' })),
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
    defaultValues: {
      userName: '',
      userPassword: '',
    },
  });

  const handleReset = () => {
    reset();
    setRoleUser(() => {
      return [];
    });

    clearErrors();
  };

  const handleCloseDialog = () => {
    reset();
    clearErrors();
    onClose();
  };

  const getRoles = async () => {
    const { Data } = await userService.getAllRole();
    setRoleList(() => {
      return Data ?? [];
    });
  };

  const onSubmit = async (data) => {
    setDialogState((prevState) => {
      return { ...prevState, isSubmit: true };
    });

    const { HttpResponseCode, ResponseMessage, Data } = await userService.createUser(data);

    setDialogState((prevState) => {
      return { ...prevState, isSubmit: false };
    });

    if (HttpResponseCode === 200 && Data) {
      SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
      setNewData(() => {
        return Data;
      });
      handleReset();
      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      getRoles();
    }
  }, [isOpen]);

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      bgColor={DIALOG.SUCCESS}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label={intl.formatMessage({ id: 'model.user.field.userName' })}
              {...register('userName')}
              error={!!errors?.userName}
              helperText={errors?.userName ? errors.userName.message : null}
              defaultValue={rowData.userName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={intl.formatMessage({ id: 'model.user.field.fullName' })}
              {...register('fullName')}
              error={!!errors?.userName}
              helperText={errors?.userName ? errors.userName.message : null}
              defaultValue={rowData.userName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={intl.formatMessage({ id: 'model.user.field.userPassword' })}
              {...register('userPassword')}
              error={!!errors?.userPassword}
              helperText={errors?.userPassword ? errors.userPassword.message : null}
              defaultValue={rowData.userPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="Roles"
              render={({ field: { onChange, value } }) => {
                return (
                  <Autocomplete
                    multiple
                    fullWidth
                    size="small"
                    options={roleList}
                    autoHighlight
                    openOnFocus
                    value={roleUser}
                    getOptionLabel={(option) => option.roleName}
                    defaultValue={initModal}
                    onChange={(e, item) => {
                      setValue('Roles', item ?? []);
                      setRoleUser(() => {
                        return item ?? [];
                      });
                    }}
                    disableCloseOnSelect
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          label={intl.formatMessage({ id: 'model.user.field.roleName' })}
                          // error={!!errors.parentId}
                          // helperText={errors?.parentId ? errors.parentId.message : null}
                        />
                      );
                    }}
                  />
                );
              }}
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

export default UserDialog;
