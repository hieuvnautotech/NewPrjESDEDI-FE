import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField } from '@controls';
import StarIcon from '@mui/icons-material/Star';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { menuService } from '@services';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';
import ModifyMenuDialog from './ModifyMenuDialog';

import { MenuDto } from '@models';
import CreateMenuFormik from './CreateMenuFormik';

import { useModal, usePrintBIXOLON, useSearch, useSelectRow } from '@hooks';
import MenuPermissionDialog from './MenuPermissionDialog';

import { STANDARD } from '@constants/PermissionConstants';

const Menu = (props) => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const btnRef_searchMenu = useRef();
  const btnRef_createMenu = useRef();
  const btnRef_modifyMenu = useRef();
  const btnRef_deleteMenu = useRef();
  const btnRef_permissionMenu = useRef();

  const initMenuModel = {
    ...MenuDto,
  };

  const [menuState, setMenuState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      keyWord: '',
    },
  });

  const handleSearch = useSearch(setMenuState);

  const createModal = useModal();
  const modifyModal = useModal();
  const buttonModal = useModal();

  const [selectedRow, setSelectedRow, handleSelectedRow] = useSelectRow(initMenuModel, menuState.data, 'menuId');

  const [newData, setNewData] = useState(initMenuModel);
  const [updateData, setUpdateData] = useState(initMenuModel);

  const fetchData = async () => {
    setMenuState((prevState) => {
      return { ...prevState, isLoading: true, data: [] };
    });

    const params = {
      page: menuState.page,
      pageSize: menuState.pageSize,
      keyWord: menuState.searchData.keyWord,
    };

    const { Data, TotalRow } = await menuService.getMenuList(params);

    if (isRendered.current) {
      setMenuState((prevState) => {
        return {
          ...prevState,
          data: Data ? [...Data] : [],
          totalRow: TotalRow ?? 0,
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
  }, [menuState.page]);

  useEffect(() => {
    if (!_.isEmpty(newData) && !_.isEqual(newData, initMenuModel)) {
      const data = [newData, ...menuState.data];
      if (data.length > menuState.pageSize) {
        data.pop();
      }
      setMenuState((prevState) => {
        return {
          ...prevState,
          data: data,
          totalRow: prevState.totalRow + 1,
        };
      });
    }
  }, [newData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, initMenuModel)) {
      let newArr = [...menuState.data];
      const index = _.findLastIndex(newArr, (o) => {
        return o.menuId == updateData.menuId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setMenuState((prevState) => {
        return {
          ...prevState,
          data: newArr,
        };
      });
    }
  }, [updateData]);

  const handleDeleteMenu = async (menu) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        const { ResponseMessage } = await menuService.deleteMenu(menu);
        if (ResponseMessage === `general.success`) {
          await fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setForRootStyle = (params) => {
    return {
      icon: <StarIcon style={{ fill: '#FF1493' }} />,
      label: params.value,
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
      width: 70,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.menuId) + 1 + (menuState.page - 1) * menuState.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 120,
      // headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="center">
            <MuiIconButton
              ref={btnRef_modifyMenu}
              permission={STANDARD.CONFIGURATION.MENU.MODIFY}
              btnText="modify"
              onClick={modifyModal.toggle}
            />
            <MuiIconButton
              ref={btnRef_deleteMenu}
              permission={STANDARD.CONFIGURATION.MENU.DELETE}
              btnText="delete"
              onClick={() => handleDeleteMenu(params.row)}
            />
            {params.row.navigateUrl && (
              <MuiIconButton
                ref={btnRef_permissionMenu}
                permission={STANDARD.CONFIGURATION.MENU.SET_PERMISSION}
                btnText="permission"
                onClick={buttonModal.toggle}
              />
            )}
          </Grid>
        );
      },
    },
    {
      field: 'menuName',
      headerName: intl.formatMessage({ id: 'model.menu.field.menuName' }),
      width: 250,
      renderCell: (params) => {
        if (params.row.forRoot) {
          return <Chip variant="outlined" {...setForRootStyle(params)} />;
        } else {
          return params.value;
        }
      },
    },
    { field: 'parentMenuName', headerName: intl.formatMessage({ id: 'model.menu.field.parentMenuName' }), width: 150 },
    { field: 'menuLevel', headerName: intl.formatMessage({ id: 'model.menu.field.menuLevel' }), width: 80 },
    {
      field: 'sortOrder',
      headerName: intl.formatMessage({ id: 'model.menu.field.sortOrder' }),
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 80,
      // valueGetter: (params) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },

    { field: 'menuComponent', headerName: intl.formatMessage({ id: 'model.menu.field.menuComponent' }), width: 200 },
    { field: 'navigateUrl', headerName: intl.formatMessage({ id: 'model.menu.field.navigateUrl' }), width: 200 },
    {
      field: 'forRoot',
      headerName: intl.formatMessage({ id: 'general.rootOnly' }),
      width: 100,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
            <Grid item>{params.row.forRoot && <Checkbox disabled checked />}</Grid>
          </Grid>
        );
      },
    },
    {
      field: 'forApp',
      headerName: intl.formatMessage({ id: 'general.forApp' }),
      width: 150,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
            <Grid item>{params.row.forApp && <Checkbox disabled checked />}</Grid>
          </Grid>
        );
      },
    },
    { field: 'languageKey', headerName: intl.formatMessage({ id: 'model.menu.field.languageKey' }), width: 300 },
  ];
  const { printTable } = usePrintBIXOLON();
  return (
    <React.Fragment>
      <MuiGridWrapper>
        <MuiButton
          permission={STANDARD.CONFIGURATION.MENU.CREATE}
          ref={btnRef_createMenu}
          btnText="create"
          onClick={createModal.toggle}
        />
        {/* <MuiButton
          permission="menuPermission.standard.configuration.menu.create_menu"
          ref={btnRef_createMenu}
          btnText="print"
          onClick={printTable}
        /> */}
        <MuiSearchField
          label="model.menu.field.menuName"
          name="keyWord"
          onClick={() => fetchData()}
          onChange={(e) => handleSearch(e.target.value, 'keyWord')}
        />
        <MuiButton
          permission={STANDARD.CONFIGURATION.MENU.VIEW}
          ref={btnRef_searchMenu}
          btnText="search"
          onClick={() => fetchData()}
        />
      </MuiGridWrapper>

      <MuiDataGrid
        // ref={menuGridRef}
        showLoading={menuState.isLoading}
        isPagingServer={true}
        // rowHeight={30}
        // gridHeight={736}
        columns={columns}
        rows={menuState.data}
        page={menuState.page - 1}
        pageSize={menuState.pageSize}
        rowCount={menuState.totalRow}
        // rowsPerPageOptions={[5, 10, 20, 30]}
        disableGrid={menuState.isLoading}
        onPageChange={(newPage) => {
          setMenuState((prevState) => {
            return { ...prevState, page: newPage + 1 };
          });
        }}
        // onPageSizeChange={(newPageSize) => {
        //     setMenuState({ ...menuState, pageSize: newPageSize, page: 1 });
        // }}
        getRowId={(rows) => rows.menuId}
        onSelectionModelChange={(newSelectedRowId) => {
          handleSelectedRow(newSelectedRowId);
        }}
        // selectionModel={selectedRow.menuId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) {
            return `Mui-created`;
          }
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        reloadGrid={fetchData}
      />

      {/* <CreateMenuDialog
        initModel={initMenuModel}
        setNewData={setNewData}
        isOpen={createModal.isShowing}
        onClose={createModal.toggle}
      /> */}

      <CreateMenuFormik
        initModel={initMenuModel}
        setNewData={setNewData}
        isOpen={createModal.isShowing}
        onClose={createModal.toggle}
      />

      <ModifyMenuDialog
        initModel={selectedRow}
        setUpdateData={setUpdateData}
        setModifyData={setSelectedRow}
        isOpen={modifyModal.isShowing}
        onClose={modifyModal.toggle}
      />

      <MenuPermissionDialog initModel={selectedRow} isOpen={buttonModal.isShowing} onClose={buttonModal.toggle} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
