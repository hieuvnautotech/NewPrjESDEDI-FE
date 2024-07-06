import { EDI } from '@constants/PermissionConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField, MuiGridWrapper, MuiSearchField } from '@controls';
import { useSearch } from '@hooks';
import { q2ManagementService } from '@services';
import { ErrorAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

export default function Q2Management() {
  const isRendered = useRef(false);
  const btnRef_search = useRef();
  const [dataState, setDataState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      ITEM_CODE: '',
      TRAND_TP: '',
      StartDate: new Date(),
      EndDate: new Date(),
    },
  });
  const handleSearch = useSearch(setDataState);

  const fetchData = async () => {
    if (new Date(dataState.searchData.EndDate) < new Date(dataState.searchData.StartDate)) {
      ErrorAlert('Ngày kết thúc không được nhỏ hơn ngày bắt đầu !');
      return;
    }

    setDataState((prevState) => {
      return { ...prevState, isLoading: true, data: [] };
    });

    const params = {
      page: dataState.page,
      pageSize: dataState.pageSize,
      ITEM_CODE: dataState.searchData.ITEM_CODE,
      TRAND_TP: dataState.searchData.TRAND_TP,
      StartDate: dataState.searchData.StartDate,
      EndDate: dataState.searchData.EndDate,
    };

    const { Data, TotalRow } = await q2ManagementService.get(params);
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
      field: 'PPORTAL_ITEM_GROUP',
      headerName: 'Pportal Item Group',
      width: 150,
    },
    {
      field: 'QMS_ITEM_GROUP',
      headerName: 'Item Group',
      width: 150,
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
      headerName: 'CTQ NO',
      width: 150,
    },
    {
      field: 'YYYYMMDDHH',
      headerName: 'YYYYMMDDHH',
      width: 150,
    },
    {
      field: 'PRC_QUAL_INFO01',
      headerName: 'PrcQ01',
      width: 200,
    },
    {
      field: 'TRANSACTION_ID',
      headerName: 'Transaction Id',
      width: 150,
    },
    {
      field: 'SUP_SEND_TIME',
      headerName: 'Sup Send Date',
      width: 150,
    },
    {
      field: 'REG_DT',
      headerName: 'Created Date',
      width: 150,
      valueFormatter: function valueFormatter(params) {
        if (params.value !== null) {
          return moment(params === null || params === void 0 ? void 0 : params.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
  ];
  return (
    <React.Fragment>
      <MuiGridWrapper>
        <MuiSearchField
          label="model.q2management.field.itemCode"
          name="keyWord"
          onChange={(e) => handleSearch(e.target.value, 'ITEM_CODE')}
        />
        <MuiAutocomplete
          variant="standard"
          label="Send Type"
          name="keyWord"
          fetchDataFunc={() =>
            q2ManagementService.getSendType({
              commonMasterCode: '002',
            })
          }
          displayLabel="commonDetailName"
          displayValue="commonDetailCode"
          onChange={(e, item) => {
            handleSearch(item?.commonDetailCode, 'TRAND_TP');
          }}
        />
        <MuiDateField
          variant="standard"
          label="From"
          value={dataState.searchData.StartDate}
          onChange={(e) => handleSearch(e, 'StartDate')}
        />
        <MuiDateField
          variant="standard"
          label="To"
          value={dataState.searchData.EndDate}
          onChange={(e) => handleSearch(e, 'EndDate')}
        />
        <MuiButton
          permission={EDI.Q2_MANAGEMENT.VIEW}
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
    </React.Fragment>
  );
}
