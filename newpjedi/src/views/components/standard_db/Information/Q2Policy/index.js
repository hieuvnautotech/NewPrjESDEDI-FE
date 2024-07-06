import { ACTION } from '@constants/ConfigConstants';
import { STANDARD } from '@constants/PermissionConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField } from '@controls';
import { useModal, useSearch } from '@hooks';
import { FormControlLabel, Grid, Switch } from '@mui/material';
import { policyService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import Q2PolicyDialog from './Q2PolicyDialog';

export default function Q2Policy() {
  const intl = useIntl();
  const isRendered = useRef(false);
  const btnRef_search = useRef();
  const btnRef_create = useRef();
  const btnRef_modify = useRef();
  const btnRef_delete = useRef();
  const { isShowing, toggle } = useModal();
  const [rowData, setRowData] = useState({});
  const [mode, setMode] = useState(ACTION.CREATE);
  const [dataState, setDataState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      ITEM_CODE: '',
      TRAND_TP: '',
      CTQ_NO: null,
      isActived: true,
    },
  });
  const handleSearch = useSearch(setDataState);
  const fetchData = async () => {
    setDataState((prevState) => {
      return { ...prevState, isLoading: true, data: [] };
    });

    const params = {
      page: dataState.page,
      pageSize: dataState.pageSize,
      ITEM_CODE: dataState.searchData.ITEM_CODE,
      TRAND_TP: dataState.searchData.TRAND_TP,
      CTQ_NO: dataState.searchData.CTQ_NO,
      isActived: dataState.searchData.isActived,
    };

    const { Data, TotalRow } = await policyService.get(params);
    if (isRendered.current) {
      setDataState((prevState) => {
        return {
          ...prevState,
          data: Data ?? [],
          totalRow: TotalRow,
          isLoading: false,
        };
      });
    }
  };
  const handleAdd = () => {
    setMode(ACTION.CREATE);
    setRowData();
    toggle();
  };

  const handleUpdate = async (row) => {
    setMode(ACTION.MODIFY);
    setRowData(row);
    toggle();
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
    fetchData();
  }, [dataState.page, dataState.pageSize, dataState.searchData.isActived]);
  const handleDelete = async (row) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      const res = await policyService.del(row);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        fetchData();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    }
  };
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: function renderCell(index) {
        return index.api.getRowIndex(index.row.Id) + 1 + (dataState.page - 1) * dataState.pageSize;
      },
    },
    {
      field: 'action',
      headerName: '',
      width: 100,
      // headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      hide: !dataState.searchData.isActived,
      renderCell: (params) => {
        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
            <MuiIconButton
              ref={btnRef_modify}
              permission={STANDARD.INFORMATION.Q2_POLICY.MODIFY}
              btnText="modify"
              onClick={() => handleUpdate(params.row)}
            />
            <MuiIconButton
              ref={btnRef_delete}
              permission={STANDARD.INFORMATION.Q2_POLICY.DELETE}
              btnText="delete"
              onClick={() => handleDelete(params.row)}
            />
          </Grid>
        );
      },
    },
    {
      field: 'ITEM_CODE',
      headerName: 'Item Code',
      width: 150,
    },
    {
      field: 'TRAND_TP_NAME',
      headerName: 'Send Type',
      width: 150,
    },
    {
      field: 'CTQ_NO',
      headerName: 'CTQ No',
      width: 150,
    },
    {
      field: 'MIN_VALUE',
      headerName: 'Min value',
      width: 150,
    },
    {
      field: 'MAX_VALUE',
      headerName: 'Max Value',
      width: 150,
    },
    {
      field: 'createdName',
      headerName: 'User Create',
      width: 150,
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      width: 200,
      type: 'dateTime',
    },
    {
      field: 'modifiedName',
      headerName: 'User Update',
      width: 150,
    },
    {
      field: 'modifiedDate',
      headerName: 'Modified Date',
      width: 200,
      type: 'dateTime',
    },
  ];
  return (
    <React.Fragment>
      <MuiGridWrapper>
        <MuiButton
          permission={STANDARD.INFORMATION.Q2_POLICY.CREATE}
          ref={btnRef_create}
          btnText="create"
          onClick={handleAdd}
        />

        <MuiSearchField
          label="model.q1management.field.itemCode"
          name="keyWord"
          onChange={(e) => handleSearch(e.target.value, 'ITEM_CODE')}
        />
        <MuiAutocomplete
          label="Send Type"
          name="TRAND_TP"
          variant="standard"
          fetchDataFunc={() =>
            policyService.getSendType({
              commonMasterCode: '002',
            })
          }
          displayLabel="commonDetailName"
          displayValue="commonDetailCode"
          onChange={(e, item) => {
            handleSearch(item?.commonDetailCode, 'TRAND_TP');
          }}
        />
        <MuiSearchField
          label="model.q1management.field.ctqNo"
          name="CTQ_NO"
          onChange={(e) => handleSearch(e.target.value, 'CTQ_NO')}
          type="number"
        />
        <MuiButton
          permission={STANDARD.INFORMATION.Q2_POLICY.VIEW}
          ref={btnRef_search}
          btnText="search"
          onClick={() => fetchData()}
        />
        <FormControlLabel
          sx={{ mb: 0 }}
          control={
            <Switch
              defaultChecked={true}
              color="primary"
              onChange={(e) => handleSearch(e.target.checked, 'isActived')}
            />
          }
          label={dataState.searchData.isActived ? 'Active Data' : 'Delete Data'}
        />
      </MuiGridWrapper>
      <MuiDataGrid
        showLoading={dataState.isLoading}
        isPagingServer={true}
        columns={columns}
        rows={dataState.data}
        page={dataState.page - 1}
        pageSize={dataState.pageSize}
        rowCount={dataState.totalRow}
        disableGrid={dataState.isLoading}
        onPageChange={(newPage) => {
          setDataState((prevState) => {
            return { ...prevState, page: newPage + 1 };
          });
        }}
        getRowId={(rows) => rows.Id}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        reloadGrid={fetchData}
      />
      <Q2PolicyDialog
        initModal={rowData}
        isOpen={isShowing}
        onClose={(fetchNewData) => {
          toggle();
          if (fetchNewData) fetchData();
        }}
        updateDataOnGrid={fetchData}
        mode={mode}
      />
    </React.Fragment>
  );
}
