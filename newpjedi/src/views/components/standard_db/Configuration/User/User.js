import { STANDARD } from '@constants/PermissionConstants';
import { MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField } from '@controls';
import { useModal, useSearch } from '@hooks';
import { FormControlLabel, Grid, Switch, ThemeProvider, createTheme } from '@mui/material';
import { userService } from '@services';
import { useUserStore } from '@stores';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import UserDialog from './UserDialog';
import UserPasswordDialog from './UserPasswordDialog';
import UserRoleDialog from './UserRoleDialog';

const myTheme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        row: {
          '&.Mui-created': {
            backgroundColor: '#A0DB8E',
          },
        },
      },
    },
  },
});

const User = () => {
  const intl = useIntl();
  const isRendered = useRef(true);

  const btnRef_searchUser = useRef();
  const btnRef_createUser = useRef();
  const btnRef_modifyUser = useRef();
  const btnRef_deleteUser = useRef();
  const btnRef_reuseUser = useRef();
  const btnRef_changeUserPassword = useRef();

  const createUserModal = useModal();
  const modifyUserModal = useModal();
  const changeUserPasswordModal = useModal();

  const [userState, setUserState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      keyWord: '',
      showDelete: true,
    },
  });
  const [newData, setNewData] = useState({});
  const [rowData, setRowData] = useState({});
  const [selectedRow, setSelectedRow] = useState({});

  const user = useUserStore((state) => state.user);
  const [roleArr, setRoleArr] = useState([]);

  const handleSearch = useSearch(setUserState);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 100,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.id) + 1 + (userState.page - 1) * userState.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 150,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.row.isActived) {
          return (
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={roleArr.includes('000') ? 4 : 6} style={{ textAlign: 'center' }}>
                {params.row.isActived ? (
                  <MuiIconButton
                    ref={btnRef_deleteUser}
                    permission={STANDARD.CONFIGURATION.USER.DELETE}
                    btnText="delete"
                    onClick={() => handleDelete(params.row)}
                  />
                ) : (
                  <MuiIconButton
                    ref={btnRef_reuseUser}
                    permission={STANDARD.CONFIGURATION.USER.DELETE}
                    btnText="reuse"
                    onClick={() => handleDelete(params.row)}
                  />
                )}
              </Grid>
            </Grid>
          );
        } else {
          return (
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              <Grid
                item
                xs={roleArr.includes('000') || roleArr.includes('001') ? 4 : 6}
                style={{ textAlign: 'center' }}
              >
                {params.row.userId !== user.userId ? (
                  <MuiIconButton
                    ref={btnRef_deleteUser}
                    permission={STANDARD.CONFIGURATION.USER.DELETE}
                    btnText="delete"
                    onClick={() => handleDelete(params.row)}
                  />
                ) : (
                  ''
                )}
              </Grid>
              <Grid
                item
                xs={roleArr.includes('000') || roleArr.includes('001') ? 4 : 6}
                style={{ textAlign: 'center' }}
              >
                <MuiIconButton
                  ref={btnRef_modifyUser}
                  permission={STANDARD.CONFIGURATION.USER.MODIFY}
                  btnText="modify"
                  onClick={() => handleUpdate(params.row)}
                />
              </Grid>

              {(roleArr.includes('000') || roleArr.includes('001')) && params.row.isActived && (
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  <MuiIconButton
                    ref={btnRef_changeUserPassword}
                    permission={STANDARD.CONFIGURATION.USER.CHANGE_PASS}
                    // btnText="info"
                    onClick={() => handleChangePass(params.row)}
                  />
                </Grid>
              )}
            </Grid>
          );
        }
      },
    },
    { field: 'userId', headerName: 'Id', width: 200 },
    { field: 'userName', headerName: intl.formatMessage({ id: 'model.user.field.userName' }), width: 250 },
    { field: 'fullName', headerName: intl.formatMessage({ id: 'model.user.field.fullName' }), width: 250 },
    { field: 'RoleNameList', headerName: intl.formatMessage({ id: 'model.user.field.roleName' }), width: 500 },
  ];

  const handleDelete = async (user) => {
    if (
      window.confirm(
        intl.formatMessage({ id: user.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted' })
      )
    ) {
      try {
        let res = await userService.deleteUser({
          userId: user.userId,
          row_version: user.row_version,
        });
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdate = (row) => {
    setRowData(() => {
      return row;
    });
    modifyUserModal.toggle();

    setSelectedRow(() => {
      return row;
    });
  };

  const handleChangePass = (row) => {
    console.log('selected row: ', row);

    setRowData(() => {
      return row;
    });

    changeUserPasswordModal.toggle();

    setSelectedRow(() => {
      return row;
    });
  };

  const fetchData = async () => {
    setUserState((prevState) => {
      return {
        ...prevState,
        data: [],
        isLoading: true,
      };
    });
    const params = {
      page: userState.page,
      pageSize: userState.pageSize,
      keyword: userState.searchData.keyWord,
      showDelete: userState.searchData.showDelete,
    };
    const { Data, TotalRow } = await userService.getUserList(params);
    if (isRendered.current)
      setUserState((prevState) => {
        return {
          ...prevState,
          data: Data ?? [],
          totalRow: TotalRow,
          isLoading: false,
        };
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
    if (user && user.RoleCodeList) {
      const roles = user.RoleCodeList.replace(' ', '').split(',');
      setRoleArr(() => {
        return [...roles];
      });
    }

    return () => {};
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [userState.page, userState.pageSize, userState.searchData.showDelete]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...userState.data];
      if (data.length > userState.pageSize) {
        data.pop();
      }
      setUserState((prevState) => {
        return {
          ...prevState,
          data: [...data],
          totalRow: userState.totalRow + 1,
        };
      });
    }
  }, [newData]);

  useEffect(() => {
    let newArr = [];

    if (!_.isEmpty(rowData) && !_.isEqual(selectedRow, rowData)) {
      newArr = [...userState.data];
      const index = _.findLastIndex(newArr, (o) => {
        return o.userId == selectedRow.userId;
      });

      if (index !== -1) {
        newArr[index] = rowData;
      }

      if (isRendered.current) {
        setUserState((prevState) => {
          return {
            ...prevState,
            data: [...newArr],
          };
        });
      }
    }
  }, [rowData]);

  return (
    <React.Fragment>
      <ThemeProvider theme={myTheme}>
        <MuiGridWrapper>
          <MuiButton
            permission={STANDARD.CONFIGURATION.USER.CREATE}
            ref={btnRef_createUser}
            btnText="create"
            onClick={createUserModal.toggle}
          />
          <MuiSearchField
            fullWidth
            variant="keyWord"
            size="small"
            label="model.user.field.userName"
            onClick={fetchData}
            onChange={(e) => handleSearch(e.target.value, 'keyWord')}
          />
          <MuiButton
            permission={STANDARD.CONFIGURATION.USER.VIEW}
            ref={btnRef_searchUser}
            btnText="search"
            onClick={fetchData}
            sx={{ mt: 1, ml: 2 }}
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
            label={userState.searchData.showDelete ? 'Active Data' : 'Delete Data'}
          />
        </MuiGridWrapper>

        <MuiDataGrid
          showLoading={userState.isLoading}
          isPagingServer={true}
          columns={columns}
          rows={userState.data}
          page={userState.page - 1}
          pageSize={userState.pageSize}
          rowCount={userState.totalRow}
          onPageChange={(newPage) => {
            setUserState((prevState) => {
              return { ...prevState, page: newPage + 1 };
            });
          }}
          getRowId={(rows) => rows.userId}
          getRowClassName={(params) => {
            if (_.isEqual(params.row, newData)) {
              return `Mui-created`;
            }
          }}
          initialState={{ pinnedColumns: { left: ['id', 'userId', 'userName'], right: ['action'] } }}
          reloadGrid={fetchData}
        />

        <UserDialog
          setNewData={setNewData}
          rowData={rowData}
          isOpen={createUserModal.isShowing}
          onClose={createUserModal.toggle}
        />

        <UserRoleDialog
          rowData={rowData}
          setRowData={setRowData}
          isOpen={modifyUserModal.isShowing}
          onClose={modifyUserModal.toggle}
          loadData={fetchData}
        />

        <UserPasswordDialog
          setNewData={setNewData}
          rowData={rowData}
          isOpen={changeUserPasswordModal.isShowing}
          onClose={changeUserPasswordModal.toggle}
        />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default User;
