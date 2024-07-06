import { ACTION } from '@constants/ConfigConstants';
import { EDI } from '@constants/PermissionConstants';
import { MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField } from '@controls';
import { useModal, useSearch } from '@hooks';
import { Grid } from '@mui/material';
import { q1ManagementService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import Q1ManagementDialog from './Q1ManagementDialog';

function formatToTime(number) {
  let hours = Math.floor(number / 10000);
  let minutes = Math.floor((number % 10000) / 100);
  let seconds = number % 100;
  let formattedTime = ''
    .concat(hours.toString().padStart(2, '0'), ':')
    .concat(minutes.toString().padStart(2, '0'), ':')
    .concat(seconds.toString().padStart(2, '0'));
  return formattedTime;
}
export default function Q1Management() {
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
    };

    const { Data, TotalRow } = await q1ManagementService.getAll(params);
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
  }, [dataState.page, dataState.pageSize]);
  const handleDelete = async (row) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      const res = await q1ManagementService.del({ Id: row.Id });
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
      renderCell: (params) => {
        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
            <MuiIconButton
              ref={btnRef_modify}
              permission={EDI.Q1_MANAGEMENT.MODIFY}
              btnText="modify"
              onClick={() => handleUpdate(params.row)}
            />
            <MuiIconButton
              ref={btnRef_delete}
              permission={EDI.Q1_MANAGEMENT.DELETE}
              btnText="delete"
              onClick={() => handleDelete(params.row)}
            />
          </Grid>
        );
      },
    },
    {
      field: 'BUYER_COMPANY',
      headerName: 'Buyer Company',
      width: 150,
    },
    {
      field: 'BUYER_DIVISION',
      headerName: 'Buyer Division',
      width: 150,
    },
    {
      field: 'SELLER_COMPANY',
      headerName: 'Seller Company',
      width: 150,
    },
    {
      field: 'SELLER_DIVISION',
      headerName: 'Seller Division',
      width: 150,
    },
    {
      field: 'GBM',
      headerName: 'GBM',
      width: 150,
    },
    {
      field: 'INV_NO',
      headerName: 'INV NO',
      width: 150,
    },
    {
      field: 'INV_MAPPING_DTTM',
      headerName: 'INV MAPPING DTTM',
      width: 200,
    },
    {
      field: 'PPORTAL_ITEM_GROUP',
      headerName: 'PPORTAL ITEM GROUP',
      width: 150,
    },
    {
      field: 'QMS_ITEM_GROUP',
      headerName: 'QMS ITEM GROUP',
      width: 150,
    },
    {
      field: 'ITEM_CODE',
      headerName: 'ITEM CODE',
      width: 150,
    },
    {
      field: 'BARCODE_NO',
      headerName: 'BARCODE NO',
      width: 300,
    },
    {
      field: 'LARGEBOX_QTY',
      headerName: 'LARGEBOX QTY',
      width: 150,
      type: 'number',
    },
    {
      field: 'S_BARCODE_NO',
      headerName: 'S BARCODE NO',
      width: 300,
    },
    {
      field: 'SMALLBOX_QTY',
      headerName: 'SMALLBOX QTY',
      width: 150,
      type: 'number',
    },
    {
      field: 'QUAL_INFO1',
      headerName: 'QUAL INFO 1',
      width: 150,
    },
    {
      field: 'QUAL_INFO2',
      headerName: 'QUAL INFO 2',
      width: 150,
    },
    {
      field: 'QUAL_INFO3',
      headerName: 'QUAL INFO 3',
      width: 150,
    },
    {
      field: 'QUAL_INFO4',
      headerName: 'QUAL INFO 4',
      width: 150,
    },
    {
      field: 'QUAL_INFO5',
      headerName: 'QUAL INFO 5',
      width: 150,
    },
    {
      field: 'QUAL_INFO6',
      headerName: 'QUAL INFO 6',
      width: 150,
    },
    {
      field: 'QUAL_INFO7',
      headerName: 'QUAL INFO 7',
      width: 150,
    },
    {
      field: 'TRANSACTION_ID',
      headerName: 'TRANSACTION ID',
      width: 150,
    },
    {
      field: 'STATUS',
      headerName: 'STATUS',
      width: 150,
    },
    {
      field: 'ERR_FLAG',
      headerName: 'ERR FLAG',
      width: 150,
    },
    {
      field: 'SUP_CREATE_DATE',
      headerName: 'SUP CREATE DATE',
      width: 150,
    },
    {
      field: 'SUP_CREATE_TIME',
      headerName: 'SUP CREATE TIME',
      width: 150,
    },
    {
      field: 'SUP_DATE_ADDED',
      headerName: 'SUP DATE ADDED',
      width: 150,
    },
    {
      field: 'SUP_TIME_ADDED',
      headerName: 'SUP TIME ADDED',
      width: 150,
    },
    {
      field: 'SUP_SEND_DATE',
      headerName: 'SUP SEND DATE',
      width: 150,
      valueFormatter: function valueFormatter(params) {
        if (params.value !== null && params.value != '') {
          return moment(params === null || params === void 0 ? void 0 : params.value).format('YYYY-MM-DD');
        }
      },
    },
    {
      field: 'SUP_SEND_TIME',
      headerName: 'SUP SEND TIME',
      width: 150,
      valueFormatter: function valueFormatter(params) {
        if (params.value !== null && params.value != '') {
          return formatToTime(params === null || params === void 0 ? void 0 : params.value);
        }
      },
    },
  ];
  return (
    <React.Fragment>
      <MuiGridWrapper>
        <MuiButton permission={EDI.Q1_MANAGEMENT.CREATE} ref={btnRef_create} btnText="create" onClick={handleAdd} />

        <MuiSearchField
          label="model.q1management.field.itemCode"
          name="keyWord"
          onClick={() => fetchData()}
          onChange={(e) => handleSearch(e.target.value, 'ITEM_CODE')}
        />
        <MuiButton
          permission={EDI.Q1_MANAGEMENT.VIEW}
          ref={btnRef_search}
          btnText="search"
          onClick={() => fetchData()}
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
      <Q1ManagementDialog
        initModal={rowData}
        isOpen={isShowing}
        onClose={(fetchNewData) => {
          toggle();
          if (fetchNewData) fetchData();
        }}
        mode={mode}
      />
    </React.Fragment>
  );
}
