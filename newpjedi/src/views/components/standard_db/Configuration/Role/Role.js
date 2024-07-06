import { STANDARD } from '@constants/PermissionConstants';
import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField } from '@controls';
import { useModal, useSearch } from '@hooks';
import { Grid } from '@mui/material';
import { roleService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import MenuGrid from './MenuGrid';

import RoleDialog from './RoleDialog';

import { useRoleStore } from '@stores';

import MenuTreeView from './MenuPermission/MenuTreeView';

const Role = () => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const btnRef_searchRole = useRef();
  const btnRef_createRole = useRef();
  const btnRef_modifyRole = useRef();
  const btnRef_deleteRole = useRef();

  const { selectedRoleId, dispatchSetSelectedRoleId, selectedRoleCode, dispatchSetSelectedRoleCode } = useRoleStore(
    (state) => state
  );

  const [mode, setMode] = useState(ACTION.CREATE);

  const roleDialogModal = useModal();

  const [roleState, setRoleState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
    searchData: {
      keyWord: '',
    },
  });

  const [newData, setNewData] = useState({});
  const [rowData, setRowData] = useState({});
  const [selectedRow, setSelectedRow] = useState({});

  const handleSearch = useSearch(setRoleState);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 80,
      filterable: false,
      renderCell: (index) => {
        return index.api.getRowIndex(index.id) + 1 + (roleState.page - 1) * roleState.pageSize;
      },
    },
    {
      field: 'action',
      headerName: '',
      width: 100,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container direction="row" alignItems="center" justifyContent="space-between">
            <MuiIconButton
              ref={btnRef_modifyRole}
              permission={STANDARD.CONFIGURATION.ROLE.MODIFY}
              btnText="modify"
              onClick={() => handleUpdate(params.row)}
            />
            {params.row.roleCode !== '000' && params.row.roleCode !== '001' && (
              <MuiIconButton
                ref={btnRef_deleteRole}
                permission={STANDARD.CONFIGURATION.ROLE.DELETE}
                btnText="delete"
                onClick={() => handleDelete(params.row)}
              />
            )}
          </Grid>
        );
      },
    },
    {
      field: 'roleCode',
      headerName: intl.formatMessage({ id: 'model.role.field.roleName' }),
      width: 300,
      renderCell: (params) => {
        return `${params.row.roleCode} - ${params.row.roleName}`;
      },
    },
    {
      field: 'roleDescription',
      headerName: intl.formatMessage({ id: 'model.role.field.roleDescription' }),
      width: 350,
    },
    {
      field: '',
      headerName: '',
      flex: 1,
    },
  ];

  const handleRoleClick = async (Id) => {
    dispatchSetSelectedRoleId(Id);
    const rowSelected = roleState.data.find((item) => item['roleId'] === Id);
    if (rowSelected) {
      dispatchSetSelectedRoleCode(rowSelected.roleCode);
    }
  };

  const handleAdd = () => {
    setMode(() => {
      return ACTION.CREATE;
    });

    setRowData(() => {
      return {};
    });

    roleDialogModal.toggle();
  };

  const handleUpdate = (row) => {
    setMode(() => {
      return ACTION.MODIFY;
    });

    setRowData(() => {
      return row;
    });

    setSelectedRow(() => {
      return row;
    });

    roleDialogModal.toggle();
  };

  const handleDelete = async (role) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let responseMessage = await roleService.deleteRole(selectedRoleId);
        if (responseMessage === 'general.success') {
          SuccessAlert(intl.formatMessage({ id: responseMessage }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: responseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchData = async () => {
    setRoleState((prevState) => {
      return {
        ...prevState,
        data: [],
        isLoading: true,
      };
    });

    const params = {
      page: roleState.page,
      pageSize: roleState.pageSize,
      keyWord: roleState.searchData.keyWord,
    };

    const { Data, TotalRow } = await roleService.getRoleList(params);

    if (isRendered.current) {
      setRoleState((prevState) => {
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
  }, [roleState.page, roleState.pageSize, roleState.searchData]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...roleState.data];
      if (data.length > roleState.pageSize) {
        data.pop();
      }

      if (isRendered.current) {
        setRoleState((prevState) => {
          return {
            ...prevState,
            data: data,
            totalRow: prevState.totalRow + 1,
          };
        });
      }
    }
  }, [newData]);

  useEffect(() => {
    let newArr = [];

    if (!_.isEmpty(rowData) && !_.isEqual(rowData, selectedRow) && isRendered.current) {
      newArr = [...roleState.data];

      const index = _.findIndex(newArr, (o) => {
        return o.roleId == rowData.roleId;
      });

      if (index !== -1) {
        newArr[index] = rowData;
      }

      setRoleState((prevState) => {
        return {
          ...prevState,
          data: [...newArr],
        };
      });

      setSelectedRow(() => {
        return rowData;
      });
    }
  }, [rowData]);

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={9}>
          <MuiGridWrapper>
            <MuiButton
              permission={STANDARD.CONFIGURATION.ROLE.CREATE}
              ref={btnRef_createRole}
              btnText="create"
              onClick={handleAdd}
            />
            <MuiSearchField
              fullWidth
              name="keyWord"
              size="small"
              label="model.role.field.roleName"
              onClick={fetchData}
              onChange={(e) => handleSearch(e.target.value, 'keyWord')}
            />
            <MuiButton
              permission={STANDARD.CONFIGURATION.ROLE.VIEW}
              ref={btnRef_searchRole}
              btnText="search"
              onClick={fetchData}
              sx={{ mt: 1, ml: 2 }}
            />
          </MuiGridWrapper>
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={2} direction="row" justifyContent="space-between" alignItems="end">
            <Grid item xs={12}>
              {/* ROLE GRID */}
              <MuiDataGrid
                showLoading={roleState.isLoading}
                isPagingServer={true}
                columns={columns}
                rows={roleState.data}
                page={roleState.page - 1}
                pageSize={roleState.pageSize}
                rowCount={roleState.totalRow}
                onPageChange={(newPage) =>
                  setRoleState((prevState) => {
                    return { ...prevState, page: newPage + 1 };
                  })
                }
                onSelectionModelChange={(newSelectedRowId) => handleRoleClick(newSelectedRowId[0])}
                getRowId={(rows) => rows.roleId}
                getRowClassName={(params) => {
                  if (_.isEqual(params.row, newData)) return `Mui-created`;
                }}
                initialState={{ pinnedColumns: { right: ['action'] } }}
                reloadGrid={fetchData}
              />
            </Grid>

            <Grid item xs={12}>
              <MenuGrid />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3}>
          <MenuTreeView />
        </Grid>
      </Grid>

      <RoleDialog
        isOpen={roleDialogModal.isShowing}
        onClose={roleDialogModal.toggle}
        setNewData={setNewData}
        setRowData={setRowData}
        initModal={rowData}
        mode={mode}
      />
    </React.Fragment>
  );
};

export default Role;
