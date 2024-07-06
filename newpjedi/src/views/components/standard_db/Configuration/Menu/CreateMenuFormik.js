import {
  // Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

import { IconSelector, MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiTextField } from '@controls';
import { menuService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { DIALOG } from '@constants/ConfigConstants';

const CreateMenuFormik = (props) => {
  const intl = useIntl();
  const isRendered = useRef(true);

  const { initModel, isOpen, onClose, setNewData } = props;

  const [dialogState, setDialogState] = useState({
    isSubmit: false,
  });

  // const [parentMenuArr, setParentMenuArr] = useState([]);
  // const clearParent = useRef(null);

  // const getParentMenus = async (menuLevel) => {
  //   const { Data } = await menuService.getParentMenus(menuLevel);
  //   if (isRendered.current) {
  //     setParentMenuArr(() => {
  //       return Data ?? [];
  //     });
  //   }
  // };

  const schema = yup.object().shape({
    menuName: yup.string().required(intl.formatMessage({ id: 'model.menu.error_message.menuName_required' })),

    languageKey: yup.string().required(),

    navigateUrl: yup
      .string()
      .nullable()
      .when('menuLevel', (menuLevel) => {
        if (parseInt(menuLevel) === 3) {
          return yup.string().required(intl.formatMessage({ id: 'model.menu.error_message.navigateUrl_required' }));
        }
      }),

    menuComponent: yup
      .string()
      .nullable()
      .when('menuLevel', (menuLevel) => {
        if (parseInt(menuLevel) === 3) {
          return yup.string().required(intl.formatMessage({ id: 'model.menu.error_message.menuComponent_required' }));
        }
      })
      .when('navigateUrl', (navigateUrl) => {
        if (navigateUrl && navigateUrl.length > 0) {
          return yup.string().required(intl.formatMessage({ id: 'model.menu.error_message.navigateUrl_required' }));
        }
      }),

    menuLevel: yup.number().required(),

    parentId: yup
      .string()
      .nullable()
      .when('menuLevel', (menuLevel) => {
        if (parseInt(menuLevel) > 1) {
          return yup
            .number()
            .required()
            .min(1, intl.formatMessage({ id: 'model.menu.error_message.parentId_required' }))
            .typeError(intl.formatMessage({ id: 'model.menu.error_message.parentId_required' }));
        }
      }),
  });

  const formik = useFormik({
    validationSchema: schema,
    initialValues: { ...initModel },
    onSubmit: async (values) => {
      setDialogState((prevState) => {
        return { ...prevState, isSubmit: true };
      });

      const { ResponseMessage, Data } = await menuService.createMenu(values);

      if (ResponseMessage === `general.success`) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        setNewData(() => {
          return Data;
        });

        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
      }

      setDialogState((prevState) => {
        return { ...prevState, isSubmit: false };
      });
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  // const handleReset = () => {
  //   const ele = clearParent.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
  //   if (ele) ele.click();
  //   resetForm();
  // };

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
    };
  }, []);

  // useEffect(() => {
  //   if (isOpen) {
  //     getParentMenus(values.menuLevel);
  //   }
  // }, [isOpen, values.menuLevel]);

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage(
        { id: 'dialog.title.create' },
        { object: intl.formatMessage({ id: 'model.menu.default' }) }
      )}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      bgColor={DIALOG.SUCCESS}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <span
                  style={{
                    marginTop: '5px',
                    marginRight: '16px',
                    fontWeight: '700',
                  }}
                >
                  {intl.formatMessage({ id: 'model.menu.field.menuLevel' })}
                </span>

                <FormControl>
                  <RadioGroup
                    row
                    name="menuLevel"
                    value={values.menuLevel}
                    onChange={(event) => {
                      setFieldValue('parentId', 0);
                      setFieldValue('menuLevel', event.target.value);

                      // const ele = clearParent.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
                      // if (ele) ele.click();
                    }}
                  >
                    <FormControlLabel label="1" value={1} control={<Radio size="small" />} />
                    <FormControlLabel label="2" value={2} control={<Radio size="small" />} />
                    <FormControlLabel label="3" value={3} control={<Radio size="small" />} />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {values.menuLevel > 1 && (
                  /* <Autocomplete
                    ref={clearParent}
                    options={parentMenuArr}
                    getOptionLabel={(menuP) => menuP?.menuName}
                    onChange={(e, value) => setFieldValue('parentId', value?.menuId || '')}
                    onOpen={handleBlur}
                    includeInputInList
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        label="Parent"
                        name="parentId"
                        variant="outlined"
                        error={Boolean(errors.parentId)}
                        helperText={errors.parentId}
                      />
                    )}
                  /> */

                  <MuiAutocomplete
                    label={intl.formatMessage({ id: 'model.menu.field.parentMenuName' })}
                    fetchDataFunc={() => menuService.getParentMenus(values.menuLevel)}
                    displayLabel="parentMenuName"
                    displayValue="parentId"
                    value={
                      values.parentId && values.parentId !== 0
                        ? {
                            parentId: values.parentId,
                            parentMenuName: values.parentMenuName,
                          }
                        : null
                    }
                    onChange={(e, item) => {
                      setFieldValue('parentId', item?.parentId || '');
                      setFieldValue('parentMenuName', item?.parentMenuName || '');
                    }}
                    error={Boolean(touched.parentId && errors.parentId)}
                    helperText={touched.parentId && errors.parentId}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MuiTextField
                  autoFocus
                  label={intl.formatMessage({ id: 'model.menu.field.menuName' })}
                  name="menuName"
                  value={values.menuName}
                  onChange={handleChange}
                  error={Boolean(touched.menuName && errors.menuName)}
                  helperText={touched.menuName && errors.menuName}
                />
              </Grid>
              <Grid item xs={6}>
                <IconSelector
                  setIconValue={(v) => setFieldValue('menuIcon', v)}
                  iconValue={values.menuIcon}
                  label={intl.formatMessage({ id: 'model.menu.field.menuIcon' })}
                />
                {/* <MuiTextField
                  label={intl.formatMessage({ id: 'model.menu.field.menuIcon' })}
                  name="menuIcon"
                  value={values.menuIcon}
                  onChange={handleChange}
                /> */}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MuiTextField
                  label={intl.formatMessage({ id: 'model.menu.field.menuComponent' })}
                  name="menuComponent"
                  value={values.menuComponent}
                  onChange={handleChange}
                  error={Boolean(touched.menuComponent && errors.menuComponent)}
                  helperText={touched.menuComponent && errors.menuComponent}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  label={intl.formatMessage({ id: 'model.menu.field.navigateUrl' })}
                  name="navigateUrl"
                  value={values.navigateUrl}
                  onChange={handleChange}
                  error={Boolean(touched.navigateUrl && errors.navigateUrl)}
                  helperText={touched.navigateUrl && errors.navigateUrl}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MuiTextField
                  label={intl.formatMessage({ id: 'model.menu.field.languageKey' })}
                  name="languageKey"
                  value={values.languageKey}
                  onChange={handleChange}
                  error={Boolean(touched.languageKey && errors.languageKey)}
                  helperText={touched.languageKey && errors.languageKey}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  checked={values.forRoot}
                  onChange={() => setFieldValue('forRoot', !values.forRoot)}
                  control={<Checkbox />}
                  label={intl.formatMessage({ id: 'general.rootOnly' })}
                />

                <FormControlLabel
                  checked={values.forApp}
                  onChange={() => setFieldValue('forApp', !values.forApp)}
                  control={<Checkbox />}
                  label={intl.formatMessage({ id: 'general.forApp' })}
                />
              </Grid>
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

export default CreateMenuFormik;
