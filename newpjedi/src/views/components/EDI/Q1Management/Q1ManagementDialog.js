import { BASE_URL, ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiButton, MuiDialog, MuiResetButton, MuiSubmitButton, MuiTextField } from '@controls';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab } from '@mui/material';
import { q1ManagementService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import readXlsxFile from 'read-excel-file';
import * as yup from 'yup';

const Q1ManagementDialog = ({ initModal, isOpen, onClose, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [tabValue, setTabValue] = useState('tab1');
  const refFile = useRef();
  const btnUploadRef = useRef();
  const btnDownloadRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataReadFile, setDataReadFile] = useState([]);
  const [ExcelHistory, setExcelHistory] = useState([]);
  const schemaY = yup.object().shape({
    ITEM_CODE: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    INV_NO: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    INV_MAPPING_DTTM: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    BARCODE_NO: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    S_BARCODE_NO: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    LARGEBOX_QTY: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    SMALLBOX_QTY: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    QUAL_INFO1: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    QUAL_INFO2: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    QUAL_INFO3: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    QUAL_INFO4: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    QUAL_INFO5: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    QUAL_INFO6: yup.string().required(
      intl.formatMessage({
        id: 'general.field_required',
      })
    ),
    QUAL_INFO7: yup.string().required(
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

  const handleReset = () => {
    const file = document.getElementById('file');
    if (file) file.value = null;

    resetForm();
  };

  const handleCloseDialog = (fetchData) => {
    resetForm();
    onClose(fetchData);
  };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });
    if (mode == ACTION.CREATE) {
      const res = await q1ManagementService.create(data);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
        handleCloseDialog(true);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await q1ManagementService.update(data);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
        handleCloseDialog(true);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };

  const handleChangeTab = async (event, newValue) => {
    setTabValue(newValue);
  };
  const schema = {
    'Invoice No': {
      prop: 'INV_NO',
      type: String,
      required: true,
    },
    'Invoice Date': {
      prop: 'INV_MAPPING_DTTM',
      type: String,
      required: true,
    },
    'L) Box Barcode': {
      prop: 'BARCODE_NO',
      type: String,
      required: true,
    },
    'S) Box Barcode': {
      prop: 'S_BARCODE_NO',
      type: String,
      required: true,
    },
    'L Box Qty': {
      prop: 'LARGEBOX_QTY',
      type: String,
      required: true,
    },
    'S Box Qty': {
      prop: 'SMALLBOX_QTY',
      type: String,
      required: true,
    },
    'Etc1(Tray ID)': {
      prop: 'QUAL_INFO1',
      type: String,
      required: true,
    },
    'Etc2(Lot ID)': {
      prop: 'QUAL_INFO2',
      type: String,
      required: true,
    },
  };

  const handleUpload = async () => {
    setDialogState({ ...dialogState, isSubmit: true });
    if (!selectedFile) {
      ErrorAlert('Chưa chọn file update');
    }

    readXlsxFile(selectedFile, { schema }).then(({ rows, errors }) => {
      errors.length === 0;

      handleSubmitFile(rows);
    });
    document.getElementById('excelinput').text = '';

    setSelectedFile(null);
    refFile.current.value = '';
    refFile.current.text = '';
    setDataReadFile([]);
    setDialogState({ ...dialogState, isSubmit: false });
  };

  const handleSubmitFile = async (rows) => {
    const res = await q1ManagementService.createByExcel(rows);

    setExcelHistory([]);
    if (res.ResponseMessage !== '') {
      handleReset();
      handleCloseDialog(true);
      //setExcelHistory(res.ResponseMessage.split(','));
      SuccessAlert(intl.formatMessage({ id: 'general.success' }));
    } else {
      ErrorAlert(intl.formatMessage({ id: 'Files.Data_Invalid' }));
    }
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    // if (event.target.files[0]?.name !== 'Material.xlsx') {
    //   ErrorAlert(intl.formatMessage({ id: 'Files.Material' }));
    // }

    readXlsxFile(event.target.files[0]).then(function (data) {
      setDataReadFile(data);
    });
  };

  return (
    <MuiDialog
      maxWidth={tabValue == 'tab2' ? 'xl' : 'md'}
      title={intl.formatMessage({ id: mode == ACTION.CREATE ? 'general.create' : 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      bgColor={mode == ACTION.CREATE ? DIALOG.SUCCESS : DIALOG.WARNING}
    >
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label={'Single'} value="tab1" />
            {mode === ACTION.CREATE && <Tab label={'Excel'} value="tab2" />}
          </TabList>
        </Box>
        <TabPanel value="tab1" sx={{ padding: '10px', margin: 0 }}>
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
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.ITEM_CODE}
                  name="ITEM_CODE"
                  onChange={handleChange}
                  label="ITEM CODE"
                  required
                  error={touched.ITEM_CODE && Boolean(errors.ITEM_CODE)}
                  helperText={touched.ITEM_CODE && errors.ITEM_CODE}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.INV_NO}
                  name="INV_NO"
                  onChange={handleChange}
                  label="INV NO"
                  required
                  error={touched.INV_NO && Boolean(errors.INV_NO)}
                  helperText={touched.INV_NO && errors.INV_NO}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.INV_MAPPING_DTTM}
                  name="INV_MAPPING_DTTM"
                  onChange={handleChange}
                  label="INV MAPPING DTTM"
                  required
                  error={touched.INV_MAPPING_DTTM && Boolean(errors.INV_MAPPING_DTTM)}
                  helperText={touched.INV_MAPPING_DTTM && errors.INV_MAPPING_DTTM}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.BARCODE_NO}
                  name="BARCODE_NO"
                  onChange={handleChange}
                  label="BARCODE NO"
                  required
                  error={touched.BARCODE_NO && Boolean(errors.BARCODE_NO)}
                  helperText={touched.BARCODE_NO && errors.BARCODE_NO}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.S_BARCODE_NO}
                  name="S_BARCODE_NO"
                  onChange={handleChange}
                  label="S BARCODE NO"
                  required
                  error={touched.S_BARCODE_NO && Boolean(errors.S_BARCODE_NO)}
                  helperText={touched.S_BARCODE_NO && errors.S_BARCODE_NO}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.LARGEBOX_QTY}
                  name="LARGEBOX_QTY"
                  onChange={handleChange}
                  label="LARGEBOX QTY"
                  required
                  error={touched.LARGEBOX_QTY && Boolean(errors.LARGEBOX_QTY)}
                  helperText={touched.LARGEBOX_QTY && errors.LARGEBOX_QTY}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.SMALLBOX_QTY}
                  name="SMALLBOX_QTY"
                  onChange={handleChange}
                  label="SMALLBOX QTY"
                  required
                  error={touched.SMALLBOX_QTY && Boolean(errors.SMALLBOX_QTY)}
                  helperText={touched.SMALLBOX_QTY && errors.SMALLBOX_QTY}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.QUAL_INFO1}
                  name="QUAL_INFO1"
                  onChange={handleChange}
                  label="QUAL INFO 1"
                  required
                  error={touched.QUAL_INFO1 && Boolean(errors.QUAL_INFO1)}
                  helperText={touched.QUAL_INFO1 && errors.QUAL_INFO1}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.QUAL_INFO2}
                  name="QUAL_INFO2"
                  onChange={handleChange}
                  label="QUAL INFO 2"
                  required
                  error={touched.QUAL_INFO2 && Boolean(errors.QUAL_INFO2)}
                  helperText={touched.QUAL_INFO2 && errors.QUAL_INFO2}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.QUAL_INFO3}
                  name="QUAL_INFO3"
                  onChange={handleChange}
                  label="QUAL INFO 3"
                  required
                  error={touched.QUAL_INFO3 && Boolean(errors.QUAL_INFO3)}
                  helperText={touched.QUAL_INFO3 && errors.QUAL_INFO3}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.QUAL_INFO4}
                  name="QUAL_INFO4"
                  onChange={handleChange}
                  label="QUAL INFO 4"
                  required
                  error={touched.QUAL_INFO4 && Boolean(errors.QUAL_INFO4)}
                  helperText={touched.QUAL_INFO4 && errors.QUAL_INFO4}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.QUAL_INFO5}
                  name="QUAL_INFO5"
                  onChange={handleChange}
                  label="QUAL INFO 5"
                  required
                  error={touched.QUAL_INFO5 && Boolean(errors.QUAL_INFO5)}
                  helperText={touched.QUAL_INFO5 && errors.QUAL_INFO5}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.QUAL_INFO6}
                  name="QUAL_INFO6"
                  onChange={handleChange}
                  label="QUAL INFO 6"
                  required
                  error={touched.QUAL_INFO6 && Boolean(errors.QUAL_INFO6)}
                  helperText={touched.QUAL_INFO6 && errors.QUAL_INFO6}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiTextField
                  disabled={dialogState.isSubmit}
                  value={values.QUAL_INFO7}
                  name="QUAL_INFO7"
                  onChange={handleChange}
                  label="QUAL INFO 7"
                  required
                  error={touched.QUAL_INFO7 && Boolean(errors.QUAL_INFO7)}
                  helperText={touched.QUAL_INFO7 && errors.QUAL_INFO7}
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
        </TabPanel>

        {mode === ACTION.CREATE && (
          <TabPanel value="tab2" sx={{ padding: '10px', margin: 0 }}>
            <Grid>
              <Grid item xs={12} sx={{ p: 3 }}>
                <input type="file" name="file" id="excelinput" onChange={changeHandler} ref={refFile} />
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row-reverse">
                  <MuiButton
                    permission="allowAll"
                    btnText="upload"
                    onClick={handleUpload}
                    ref={btnUploadRef}
                    disabled={selectedFile ? false : true}
                  />
                  <MuiButton
                    btnText="download"
                    permission="allowAll"
                    ref={btnDownloadRef}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `${BASE_URL}/TemplateImport/Q1InfoImport.xlsx`;
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <table className="table table-striped" style={{ border: 'solid 1px #dee2e6' }}>
                <thead>
                  <tr>
                    {dataReadFile[0] && <th scope="col">STT</th>}
                    {dataReadFile[0]?.map((item, index) => {
                      return (
                        <th key={`TITLE ${index}`} scope="col">
                          {item}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {dataReadFile?.slice(1).length > 0 ? (
                    dataReadFile?.slice(1)?.map((item, index) => {
                      return (
                        <tr key={`ITEM${index}`}>
                          <td scope="col">{index + 1}</td>
                          {item?.map((data, index) => {
                            return (
                              <td key={`DATA${index}`} scope="col">
                                {_.isObject(data) ? moment(data).format('YYYY-MM-DD') : String(data)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  ) : ExcelHistory.length > 0 ? (
                    <>
                      <tr>
                        <th colSpan={3}>History</th>
                      </tr>
                      {ExcelHistory.map((item, index) => {
                        if (item != '')
                          return (
                            <tr key={`ITEM${index}`}>
                              <td style={{ width: '15%' }}>{index + 1}</td>
                              <td style={{ width: '20%' }}>{item.split('|')[0]}</td>
                              <td style={{ width: '65%' }}>{item.split('|')[1]}</td>
                            </tr>
                          );
                      })}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="100" className="text-center">
                        <i className="fa fa-database" aria-hidden="true" style={{ fontSize: '35px', opacity: 0.6 }} />
                        <h3 style={{ opacity: 0.6, marginTop: '5px' }}>No Data</h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </TabPanel>
        )}
      </TabContext>
    </MuiDialog>
  );
};

const defaultValue = {
  ITEM_CODE: '',
  INV_NO: '',
  INV_MAPPING_DTTM: '',
  BARCODE_NO: '',
  S_BARCODE_NO: '',
  LARGEBOX_QTY: '',
  SMALLBOX_QTY: '',
  QUAL_INFO1: '',
  QUAL_INFO2: '',
  QUAL_INFO3: '',
  QUAL_INFO4: '',
  QUAL_INFO5: '',
  QUAL_INFO6: '',
  QUAL_INFO7: '',
};

export default Q1ManagementDialog;
