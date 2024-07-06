import { DIALOG } from '@constants/ConfigConstants';
import { MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { userService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const UserRoleDialog = ({ isOpen, onClose, rowData, setRowData, loadData }) => {
  const intl = useIntl();
  const isRendered = useRef(false);
  const [roleList, setRoleList] = useState([]);
  const [roleUser, setRoleUser] = useState([]);
  const [fullname, setfullname] = useState('');
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schema = yup.object().shape({});

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
    defaultValues: { ...rowData },
  });

  const handleReset = () => {
    reset();
    clearErrors();
    getRolesByUser(rowData.userId);
    // getUserById(rowData.userId);
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

  const getRolesByUser = async (userId) => {
    if (userId) {
      const res = await userService.getRoleByUser(userId);

      if (res) {
        setValue('Roles', res);
        setRoleUser(() => {
          return res;
        });
      }
    }
  };

  const onSubmit = async (data) => {
    data = { ...data, userId: rowData.userId };

    setDialogState((prevState) => {
      return { ...prevState, isSubmit: true };
    });

    const { HttpResponseCode, ResponseMessage, Data } = await userService.modifyUser(data);

    setDialogState((prevState) => {
      return { ...prevState, isSubmit: false };
    });

    if (HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
      setRowData(() => {
        return Data;
      });
      handleCloseDialog();
      // loadData();
    } else {
      ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
    }
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
    getRoles();
    getRolesByUser(rowData.userId);
    // getUserById(rowData.userId);
    reset({ ...rowData });
  }, [rowData, isOpen]);

  // useEffect(() => {
  //   console.log('rowData: ', rowData);

  // }, [rowData]);

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      bgColor={DIALOG.WARNING}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.roleName}
                    isOptionEqualToValue={(option, value) => option.roleId === value.roleId}
                    onChange={(e, item) => {
                      setValue('Roles', item ?? []);
                      setRoleUser(() => {
                        return item ?? [];
                      });
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          label={intl.formatMessage({ id: 'model.user.field.roleName' })}
                          error={!!errors.Roles}
                          helperText={errors?.Roles ? errors.Roles.message : null}
                        />
                      );
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label={intl.formatMessage({ id: 'model.user.field.fullName' })}
              {...register('fullName')}
              error={!!errors?.fullName}
              helperText={errors?.fullName ? errors.fullName.message : null}
              defaultValue={fullname}
              onChange={(e) => {
                setValue('fullName', e.target.value);
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

export default UserRoleDialog;
