import { MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { userService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { DIALOG } from '@constants/ConfigConstants';

const UserPasswordDialog = ({ isOpen, onClose, setNewData, rowData }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [hide, setHide] = useState({ userPassword: false, newPassword: false });

  const schema = yup.object().shape({
    newPassword: yup.string().required(intl.formatMessage({ id: 'model.user.error_message.newPassword_required' })),
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
      newPassword: '',
      userId: rowData.userId,
    },
  });

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

    var data = { ...data, userId: rowData.userId };

    const { HttpResponseCode, ResponseMessage } = await userService.changePasswordByRoot(data);

    setDialogState((prevState) => {
      return { ...prevState, isSubmit: false };
    });

    if (HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
      handleReset();
      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
    }
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.changepassword' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      bgColor={DIALOG.WARNING}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel size="small" htmlFor="newPassword" style={errors?.newPassword ? { color: '#d32f2f' } : null}>
                {intl.formatMessage({ id: 'model.user.field.newPassword' })}
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="newPassword"
                type={hide.newPassword ? 'text' : 'password'}
                size="small"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setHide((prevState) => {
                          return { ...prevState, newPassword: !prevState.newPassword };
                        })
                      }
                      edge="end"
                    >
                      {hide.newPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label={intl.formatMessage({ id: 'model.user.field.newPassword' })}
                {...register('newPassword')}
                error={!!errors?.newPassword}
                helpertext={errors?.newPassword ? errors.newPassword.message : ''}
              />
              {errors?.newPassword && (
                <FormHelperText error id="newPassword">
                  {' '}
                  {errors?.newPassword.message}{' '}
                </FormHelperText>
              )}
            </FormControl>
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

export default UserPasswordDialog;
