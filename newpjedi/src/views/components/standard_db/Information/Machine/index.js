import { STANDARD } from '@constants/PermissionConstants';
import { ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField } from '@controls';
import { useModal, useSearch } from '@hooks';
import { FormControlLabel, Grid, Switch } from '@mui/material';
import { machineService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import MachineDialog from './MachineDialog';

export default function Machine() {
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
      MachineCode: '',
      MachineName: '',
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
      MachineCode: dataState.searchData.MachineCode,
      MachineName: dataState.searchData.MachineName,
      isActived: dataState.searchData.isActived,
    };

    const { Data, TotalRow } = await machineService.get(params);
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
    if (
      window.confirm(
        intl.formatMessage({ id: row.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted' })
      )
    ) {
      const res = await machineService.del(row);
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
        return index.api.getRowIndex(index.row.MachineId) + 1 + (dataState.page - 1) * dataState.pageSize;
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

      renderCell: (params) => {
        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
            <MuiIconButton
              ref={btnRef_modify}
              permission={STANDARD.INFORMATION.MACHINE.MODIFY}
              btnText="modify"
              onClick={() => handleUpdate(params.row)}
            />
            {params.row.isActived ? (
              <MuiIconButton
                ref={btnRef_delete}
                permission={STANDARD.INFORMATION.MACHINE.DELETE}
                btnText="delete"
                onClick={() => handleDelete(params.row)}
              />
            ) : (
              <MuiIconButton
                ref={btnRef_delete}
                permission="allowAll"
                btnText="reuse"
                onClick={() => handleDelete(params.row)}
              />
            )}
          </Grid>
        );
      },
    },
    {
      field: 'MachineCode',
      headerName: intl.formatMessage({ id: 'model.machine.field.machineCode' }),
      width: 150,
    },
    {
      field: 'MachineName',
      headerName: intl.formatMessage({ id: 'model.machine.field.machineName' }),
      width: 450,
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
          permission={STANDARD.INFORMATION.MACHINE.CREATE}
          ref={btnRef_create}
          btnText="create"
          onClick={handleAdd}
        />

        <MuiSearchField
          label="model.machine.field.machineCode"
          name="keyWord"
          onChange={(e) => handleSearch(e.target.value, 'MachineName')}
        />

        <MuiButton
          permission={STANDARD.INFORMATION.MACHINE.VIEW}
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
        getRowId={(rows) => rows.MachineId}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        reloadGrid={fetchData}
      />
      <MachineDialog
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
