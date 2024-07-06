import { MuiDialog, MuiSubmitButton } from '@controls';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

import { commonService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';

const ModifyCommonMasterDialog = (props) => {
  const intl = useIntl();

  const { initModal, isOpen, onClose, setModifyData } = props;

  const dataModalRef = useRef({ ...initModal });

  const [dialogState, setDialogState] = useState({
    ...initModal,
    isSubmit: false,
  });

  useEffect(() => {
    reset({ ...initModal });
  }, [initModal]);

  const schema = yup.object().shape({
    commonDetailName: yup.string().required(),
  });
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      ...initModal,
    },
  });

  const handleCloseDialog = () => {
    reset();
    clearErrors();
    setDialogState({
      ...dialogState,
    });
    onClose();
  };

  const onSubmit = async (data) => {
    dataModalRef.current = { ...initModal, ...data };
    setDialogState({ ...dialogState, isSubmit: true });

    const { ResponseMessage, Data } = await commonService.modifyCommonDetail(dataModalRef.current);

    if (Data) {
      SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
      setModifyData({ ...Data });

      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
    }

    setDialogState({ ...dialogState, isSubmit: false });
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label={intl.formatMessage({ id: 'model.commonDetail.field.commonDetailName' })}
              {...register('commonDetailName', {
                // onChange: (e) => handleInputChange(e)
              })}
              error={!!errors?.commonDetailName}
              helperText={errors?.commonDetailName ? errors.commonDetailName.message : null}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

export default ModifyCommonMasterDialog;
