import { ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField } from '@controls';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { commonService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import CommonDetailDialog from './CommonDetailDialog';
// import CreateCommonDetailDialog from './CreateCommonDetailDialog';
// import ModifyCommonDetailDialog from './ModifyCommonDetailDialog';
import { STANDARD } from '@constants/PermissionConstants';
import { useModal, useSearch, useSelectRow } from '@hooks';
import { CommonDetailDto } from '@models';

const initialState = {
  isLoading: false,
  data: [],
  totalRow: 0,
  page: 1,
  pageSize: 7,
  searchData: {
    keyWord: '',
    showDelete: true,
  },
};

const CommonDetail = ({ rowmaster }) => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const searchInputRef = useRef();

  const btnRef_searchCommonDetail = useRef();
  const btnRef_createCommonDetail = useRef();
  const btnRef_modifyCommonDetail = useRef();
  const btnRef_deleteCommonDetail = useRef();
  const btnRef_reuseCommonDetail = useRef();

  const initCommonDetailModel = {
    ...CommonDetailDto,
    commonMasterCode: rowmaster.commonMasterCode,
  };

  const [commomDetailState, setCommomDetailState] = useState(initialState);
  const [mode, setMode] = useState();

  // const createModal = useModal();
  // const modifyModal = useModal();
  const commomDetailModal = useModal();

  const [selectedRow, setSelectedRow, handleRowSelection] = useSelectRow(
    initCommonDetailModel,
    commomDetailState.data,
    'commonDetailId'
  );

  const [createData, setCreateData] = useState(initCommonDetailModel);
  const [updateData, setUpdateData] = useState(initCommonDetailModel);

  const handleSearch = useSearch(setCommomDetailState);

  const fetchData = async () => {
    setCommomDetailState((prevState) => {
      return {
        ...prevState,
        isLoading: true,
        data: [],
      };
    });

    const params = {
      commonMasterCode: rowmaster.commonMasterCode,
      isActived: commomDetailState.searchData.showDelete,
      keyWord: commomDetailState.searchData.keyWord,
      page: commomDetailState.page,
      pageSize: commomDetailState.pageSize,
    };

    const { Data, TotalRow } = await commonService.getCommonDetailList(params);

    if (isRendered.current) {
      setCommomDetailState((prevState) => {
        return {
          ...prevState,
          data: Data ?? [],
          totalRow: TotalRow,
          isLoading: false,
        };
      });
    }
  };

  const handleDeleteReuseCommonDetail = async (item) => {
    const message = commomDetailState.searchData.showDelete
      ? intl.formatMessage({ id: 'general.confirm_delete' })
      : intl.formatMessage({ id: 'general.confirm_redo_deleted' });
    if (window.confirm(message)) {
      try {
        const { HttpResponseCode, ResponseMessage } = await commonService.deleteReuseCommonDetail({
          commonDetailId: item.commonDetailId,
          isActived: item.isActived,
          row_version: item.row_version,
        });

        if (HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 80,
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.commonDetailId) + 1 + (commomDetailState.page - 1) * commomDetailState.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 100,
      // headerAlign: 'center',
      align: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.row.isActived) {
          return (
            <MuiIconButton
              ref={btnRef_reuseCommonDetail}
              permission={STANDARD.CONFIGURATION.COMMON_DETAIL.DELETE}
              btnText="reuse"
              onClick={() => handleDeleteReuseCommonDetail(params.row)}
            />
          );
        } else {
          return (
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
              <MuiIconButton
                ref={btnRef_modifyCommonDetail}
                permission={STANDARD.CONFIGURATION.COMMON_DETAIL.MODIFY}
                btnText="modify"
                onClick={() => {
                  setMode(() => {
                    return ACTION.MODIFY;
                  });
                  commomDetailModal.toggle();
                }}
              />

              <MuiIconButton
                ref={btnRef_deleteCommonDetail}
                permission={STANDARD.CONFIGURATION.COMMON_DETAIL.DELETE}
                btnText="delete"
                onClick={() => handleDeleteReuseCommonDetail(params.row)}
              />
            </Grid>
          );
        }
      },
    },
    // { field: 'commonDetailId', headerName: 'Id', width: 150 },
    { field: 'commonMasterCode', headerName: 'Master Code', width: 150 },
    {
      field: 'code-name',
      headerName: intl.formatMessage({ id: 'model.commonDetail.field.commonDetailName' }),
      width: 250,
      renderCell: (params) => {
        return `${params.row.commonDetailCode} - ${params.row.commonDetailName}`;
      },
    },

    {
      field: 'createdDate',
      headerName: 'Created Date',
      width: 200,
      type: 'dateTime',
    },
    {
      field: 'modifiedDate',
      headerName: 'Modified Date',
      width: 200,
      type: 'dateTime',
    },
  ];

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
    };
  }, []);

  useEffect(() => {
    searchInputRef.current.setValue(null);
    setCommomDetailState((prevState) => {
      return {
        ...prevState,
        commonMasterCode: rowmaster.commonMasterCode,
        searchData: { keyWord: '', showDelete: true },
        page: 1,
      };
    });
  }, [rowmaster.commonMasterCode]);

  useEffect(() => {
    fetchData();
  }, [
    commomDetailState.commonMasterCode,
    commomDetailState.page,
    commomDetailState.pageSize,
    commomDetailState.searchData.showDelete,
  ]);

  useEffect(() => {
    if (!_.isEmpty(createData) && !_.isEqual(createData, initCommonDetailModel)) {
      const data = [createData, ...commomDetailState.data];
      if (data.length > commomDetailState.pageSize) {
        data.pop();
      }
      setCommomDetailState((prevState) => {
        return {
          ...prevState,
          data: [...data],
          totalRow: commomDetailState.totalRow + 1,
        };
      });
    }
  }, [createData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, initCommonDetailModel)) {
      let newArr = [...commomDetailState.data];
      const index = _.findIndex(newArr, (o) => {
        return o.commonDetailId == updateData.commonDetailId;
      });

      if (index !== -1) {
        newArr[index] = updateData;
      }

      if (isRendered.current) {
        setCommomDetailState((prevState) => {
          return {
            ...prevState,
            data: [...newArr],
          };
        });
      }
    }
  }, [updateData]);

  return (
    <React.Fragment>
      <MuiGridWrapper>
        <MuiButton
          permission={STANDARD.CONFIGURATION.COMMON_DETAIL.CREATE}
          ref={btnRef_createCommonDetail}
          disabled={rowmaster.commonMasterCode ? false : true}
          btnText="create"
          onClick={() => {
            setMode(() => {
              return ACTION.CREATE;
            });
            commomDetailModal.toggle();
          }}
        />
        <MuiSearchField
          label="model.commonDetail.field.commonDetailName"
          ref={searchInputRef}
          onClick={fetchData}
          onChange={(e) => handleSearch(e.target.value, 'keyWord')}
        />
        <MuiButton
          permission={STANDARD.CONFIGURATION.COMMON_DETAIL.WIEW}
          ref={btnRef_searchCommonDetail}
          btnText="search"
          onClick={fetchData}
        />

        <FormControlLabel
          sx={{ mb: 0 }}
          control={
            <Switch
              defaultChecked={true}
              color="primary"
              onChange={(e) => handleSearch(e.target.checked, 'showDelete')}
            />
          }
          label={commomDetailState.searchData.showDelete ? 'Active Data' : 'Delete Data'}
        />
      </MuiGridWrapper>

      <MuiDataGrid
        showLoading={commomDetailState.isLoading}
        isPagingServer={true}
        columns={columns}
        rows={commomDetailState.data}
        page={commomDetailState.page - 1}
        pageSize={commomDetailState.pageSize}
        rowCount={commomDetailState.totalRow}
        onPageChange={(newPage) =>
          setCommomDetailState((prevState) => {
            return { ...prevState, page: newPage + 1 };
          })
        }
        onPageSizeChange={(newPageSize) =>
          setCommomDetailState((prevState) => {
            return { ...prevState, pageSize: newPageSize, page: 1 };
          })
        }
        getRowId={(rows) => rows.commonDetailId}
        onSelectionModelChange={(newSelectedRowId) => {
          handleRowSelection(newSelectedRowId);
        }}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, createData)) {
            return `Mui-created`;
          }
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        reloadGrid={fetchData}
      />

      <CommonDetailDialog
        mode={mode}
        initModel={mode === ACTION.CREATE ? initCommonDetailModel : selectedRow}
        setCreateData={setCreateData}
        setUpdateData={setUpdateData}
        setModifyData={setSelectedRow}
        isOpen={commomDetailModal.isShowing}
        onClose={commomDetailModal.toggle}
      />

      {/* <CreateCommonDetailDialog
        initModal={initCommonDetailModel}
        setCreateData={setCreateData}
        isOpen={createModal.isShowing}
        onClose={createModal.toggle}
      /> */}

      {/* <ModifyCommonDetailDialog
        initModal={selectedRow}
        setModifyData={setSelectedRow}
        isOpen={modifyModal.isShowing}
        onClose={modifyModal.toggle}
      /> */}
    </React.Fragment>
  );
};

export default CommonDetail;
