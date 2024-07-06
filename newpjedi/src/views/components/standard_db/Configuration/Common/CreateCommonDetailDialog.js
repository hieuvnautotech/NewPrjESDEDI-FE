import { MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

import { commonService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';

const CreateCommonDetailDialog = (props) => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const { initModal, isOpen, onClose, setNewData } = props;

  const dataModalRef = useRef({ ...initModal });

  const [dialogState, setDialogState] = useState({
    isSubmit: false,
  });

  const schema = yup.object().shape({
    commonDetailName: yup.string().required(intl.formatMessage({ id: 'model.commonDetail.field.commonDetailName' })),
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
      ...initModal,
    },
  });

  const handleReset = () => {
    reset();
    clearErrors();
    if (isRendered.current) {
      setDialogState({
        ...dialogState,
      });
    }
  };

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
    setDialogState((currentDialogState) => {
      return { ...currentDialogState, isSubmit: true };
    });

    const { ResponseMessage, Data } = await commonService.createCommonDetail(dataModalRef.current);

    if (isRendered.current && Data) {
      SuccessAlert(intl.formatMessage({ id: ResponseMessage }));

      setNewData(() => {
        return Data;
      });

      handleReset();
      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
    }

    setDialogState((currentDialogState) => {
      return { ...currentDialogState, isSubmit: false };
    });
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
    reset({ ...initModal });
  }, [initModal]);

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'dialog.title.create' }, { object: '' })}
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
              name="commonDetailName"
              {...register('commonDetailName', {})}
              error={!!errors?.commonDetailName}
              helperText={errors?.commonDetailName ? errors.commonDetailName.message : null}
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

export default CreateCommonDetailDialog;
