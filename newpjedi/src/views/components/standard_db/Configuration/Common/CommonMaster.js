import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { STANDARD } from '@constants/PermissionConstants';
import { ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField } from '@controls';
import { useModal, useSearch, useSelectRow } from '@hooks';
import { CommonMasterDto } from '@models';
import StarIcon from '@mui/icons-material/Star';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { commonService } from '@services';
import { useUserStore } from '@stores';
import { ErrorAlert } from '@utils';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CommonDetail from './CommonDetail.js';
import CommonMasterDialog from './CommonMasterDialog.js';

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

const CommonMaster = () => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const btnRef_searchCommonMaster = useRef();
  const btnRef_createCommonMaster = useRef();
  const btnRef_modifyCommonMaster = useRef();
  const btnRef_deleteCommonMaster = useRef();
  const btnRef_reuseCommonMaster = useRef();

  const [commomMasterState, setcommomMasterState] = useState(initialState);

  const [mode, setMode] = useState(ACTION.CREATE);

  const commonMasterModal = useModal();

  const user = useUserStore((state) => state.user);

  const [role, setRole] = useState(false);

  const [dataModel, setDataModel] = useState(CommonMasterDto);

  const [selectedRow, setSelectedRow, handleRowSelection] = useSelectRow(
    CommonMasterDto,
    commomMasterState.data,
    'commonMasterCode'
  );

  const [newData, setNewData] = useState({ ...CommonMasterDto });
  const [updateData, setUpdateData] = useState({ ...CommonMasterDto });

  const fetchData = async () => {
    setcommomMasterState((prevState) => {
      return {
        ...prevState,
        isLoading: true,
        data: [],
      };
    });

    const params = {
      page: commomMasterState.page,
      pageSize: commomMasterState.pageSize,
      keyword: commomMasterState.searchData.keyWord,
      showDelete: commomMasterState.searchData.showDelete,
    };

    const { Data, TotalRow } = await commonService.getCommonMasterList(params);

    if (isRendered.current) {
      setcommomMasterState((prevState) => {
        return {
          ...prevState,
          data: Data ?? [],
          totalRow: TotalRow,
          isLoading: false,
        };
      });
    }
  };

  const handleCreate = () => {
    setMode(() => {
      return ACTION.CREATE;
    });
    setDataModel(() => {
      return CommonMasterDto;
    });
    commonMasterModal.toggle();
  };

  const handleModify = (row) => {
    setMode(() => {
      return ACTION.MODIFY;
    });

    setDataModel(() => {
      return { ...row };
    });
    commonMasterModal.toggle();
  };

  const handleSearch = useSearch(setcommomMasterState);

  const handleDeleteCommonMS = async (row) => {
    if (
      window.confirm(
        row.isActived
          ? intl.formatMessage({ id: 'general.confirm_delete' })
          : intl.formatMessage({ id: 'general.confirm_redo_deleted' })
      )
    ) {
      try {
        const { HttpResponseCode, ResponseMessage } = await commonService.deleteReuseCommonMater({
          commonMasterCode: row.commonMasterCode,
          isActived: row.isActived,
          row_version: row.row_version,
        });
        if (HttpResponseCode === 200) {
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
        }
      } catch (error) {}
    }
  };
  const setForRootStyle = (params) => {
    return {
      icon: <StarIcon style={{ fill: '#FF1493' }} />,
      label: `${params.commonMasterCode} - ${params.commonMasterName}`,
      style: {
        borderColor: '#FF1493',
        color: '#FF1493',
        padding: '0px',
      },
    };
  };
  const columns = [
    {
      field: 'id',
      headerName: '',
      // flex: 0.1,
      width: 80,
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.commonMasterCode) +
        1 +
        (commomMasterState.page - 1) * commomMasterState.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      // flex: 0.1,
      width: 100,
      align: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,

      renderCell: (params) => {
        return (
          <Grid container direction="row" alignItems="center" justifyContent="space-between">
            <MuiIconButton
              ref={btnRef_modifyCommonMaster}
              permission={STANDARD.CONFIGURATION.COMMON_MASTER.MODIFY}
              btnText="modify"
              onClick={() => handleModify(params.row)}
            />

            <MuiIconButton
              ref={btnRef_deleteCommonMaster}
              permission={STANDARD.CONFIGURATION.COMMON_MASTER.DELETE}
              btnText="delete"
              onClick={() => handleDeleteCommonMS(params.row)}
            />
          </Grid>
        );
      },
    },
    {
      field: 'code-name',
      headerName: intl.formatMessage({ id: 'model.commonMaster.field.commonMasterName' }),
      width: 300,
      renderCell: (params) => {
        if (params.row.forRoot) {
          return <Chip variant="outlined" {...setForRootStyle(params.row)} />;
        } else {
          return `${params.row.commonMasterCode} - ${params.row.commonMasterName}`;
        }
      },
    },
    {
      field: 'forRoot',
      headerName: 'For Root',
      width: 100,
      hide: role,
      renderCell: (params) => {
        if (params.value) {
          return (
            <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
              <Grid item>{params.row.forRoot && <Checkbox disabled checked />}</Grid>
            </Grid>
          );
        } else {
          return '';
        }
      },
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 200,
      type: 'dateTime',
    },
    { field: 'createdName', headerName: intl.formatMessage({ id: 'general.createdName' }), width: 200 },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      width: 200,
      type: 'dateTime',
    },

    { field: 'modifiedName', headerName: intl.formatMessage({ id: 'general.modifiedName' }), width: 200 },
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
    fetchData();
  }, [commomMasterState.page, commomMasterState.pageSize, commomMasterState.searchData.showDelete]);

  useEffect(() => {
    if (!_.isEmpty(newData) && !_.isEqual(newData, CommonMasterDto)) {
      const data = [newData, ...commomMasterState.data];
      if (data.length > commomMasterState.pageSize) {
        data.pop();
      }
      setcommomMasterState((prevState) => {
        return {
          ...prevState,
          data: [...data],
          totalRow: prevState.totalRow + 1,
        };
      });
    }
  }, [newData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, CommonMasterDto)) {
      let newArr = [...commomMasterState.data];
      const index = _.findIndex(newArr, (o) => {
        return o.commonMasterCode == updateData.commonMasterCode;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setcommomMasterState((prevState) => {
        return {
          ...prevState,
          data: newArr,
        };
      });
    }
  }, [updateData]);

  useEffect(() => {
    if (user && user.RoleCodeList) {
      const roles = user.RoleCodeList.replace(' ', '').split(',');
      roles.includes('000')
        ? setRole(() => {
            return false;
          })
        : setRole(() => {
            return true;
          });
    }
  }, [user]);

  return (
    <React.Fragment>
      <MuiGridWrapper>
        <MuiButton
          permission={STANDARD.CONFIGURATION.COMMON_MASTER.CREATE}
          ref={btnRef_createCommonMaster}
          btnText="create"
          onClick={handleCreate}
        />

        <MuiSearchField
          label="model.commonMaster.field.commonMasterName"
          onClick={fetchData}
          onChange={(e) => handleSearch(e.target.value, 'keyWord')}
        />
        <MuiButton
          permission={STANDARD.CONFIGURATION.COMMON_MASTER.VIEW}
          ref={btnRef_searchCommonMaster}
          btnText="search"
          onClick={fetchData}
        />
      </MuiGridWrapper>

      <MuiDataGrid
        showLoading={commomMasterState.isLoading}
        isPagingServer={true}
        columns={columns}
        rows={commomMasterState.data}
        page={commomMasterState.page - 1}
        pageSize={commomMasterState.pageSize}
        rowCount={commomMasterState.totalRow}
        onPageChange={(newPage) =>
          setcommomMasterState((prevState) => {
            return { ...prevState, page: newPage + 1 };
          })
        }
        getRowId={(rows) => rows.commonMasterCode}
        onSelectionModelChange={(newSelectedRowCode) => {
          handleRowSelection(newSelectedRowCode);
        }}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) {
            return `Mui-created`;
          }
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        reloadGrid={fetchData}
      />

      <CommonMasterDialog
        mode={mode}
        initModel={dataModel}
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        setModifyData={setSelectedRow}
        isOpen={commonMasterModal.isShowing}
        onClose={commonMasterModal.toggle}
      />

      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 1, pr: 1 }}>
        <Grid item xs>
          {selectedRow && <CommonDetail rowmaster={selectedRow} />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

User_Operations.toString = () => {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  return { language };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};
export default connect(mapStateToProps, mapDispatchToProps)(CommonMaster);
