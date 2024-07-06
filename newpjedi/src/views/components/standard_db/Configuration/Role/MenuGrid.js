import { STANDARD } from '@constants/PermissionConstants';
import { MuiDataGrid, MuiIconButton } from '@controls';
import { roleService } from '@services';
import { useRoleStore } from '@stores';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { useModal } from '@hooks';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { ErrorAlert, SuccessAlert } from '@utils';
import RolePermissionDialog from './RolePermissionDialog';

const MenuGrid = () => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const btnRef_permissionMenu = useRef();
  const btnRef_deleteMenu = useRef();

  const {
    selectedRoleId,
    selectedMenu,
    dispatchSetSelectedRoleId,
    dispatchSetSelectedMenu,
    selectedRoleCode,
    dispatchSetSelectedRoleCode,
  } = useRoleStore((state) => state);

  const [selectedRow, setSelectedRow] = useState([]);

  const permissionDialog = useModal();
  const [menuState, setMenuState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      keyWord: '',
    },
  });

  const setMenuNameStyle = (params) => {
    if (params.menuLevel === 1) {
      return {
        icon: <StarIcon style={{ fill: '#FF1493' }} />,
        // label: params.menuName,
        label: intl.formatMessage({ id: params.languageKey }),
        style: {
          borderColor: '#FF1493',
          color: '#FF1493',
          padding: '0px',
        },
      };
    } else {
      return {
        icon: <StarHalfIcon style={{ fill: '#05C4BC' }} />,
        // label: params.menuName,
        label: intl.formatMessage({ id: params.languageKey }),
        style: {
          borderColor: '#05C4BC',
          color: '#05C4BC',
        },
      };
    }
  };

  const setMenuParentStyle = (params) => {
    if (params.menuLevel === 2) {
      return {
        icon: <StarIcon style={{ fill: '#FF1493' }} />,
        // label: params.parentMenuName,
        label: intl.formatMessage({ id: params.ParentMenuLanguageKey }),
        style: {
          borderColor: '#FF1493',
          color: '#FF1493',
          padding: '0px',
        },
      };
    } else {
      return {
        icon: <StarHalfIcon style={{ fill: '#05C4BC' }} />,
        // label: params.parentMenuName,
        label: intl.formatMessage({ id: params.ParentMenuLanguageKey }),
        style: {
          borderColor: '#05C4BC',
          color: '#05C4BC',
        },
      };
    }
  };

  const menuColumns = [
    {
      field: 'id',
      headerName: '',
      width: 80,
      filterable: false,
      renderCell: (index) => {
        return index.api.getRowIndex(index.id) + 1;
      },
    },
    {
      field: 'parentMenuName',
      headerName: 'Parent',
      width: 250,
      renderCell: (params) => {
        if (params.row.menuLevel > 1) {
          return <Chip variant="outlined" {...setMenuParentStyle(params.row)} />;
        } else {
          return null;
        }
      },
    },
    {
      field: 'menuName',
      headerName: intl.formatMessage({ id: 'model.menu.field.menuName' }),
      width: 250,
      renderCell: (params) => {
        if (!params.row.navigateUrl) {
          return <Chip variant="outlined" {...setMenuNameStyle(params.row)} />;
        } else {
          return intl.formatMessage({ id: params.row.languageKey });
        }
      },
    },
    { field: 'menuLevel', headerName: 'Level', width: 80 },
    { field: 'navigateUrl', headerName: 'Url', width: 250 },
    {
      field: 'permission',
      headerName: 'Permission',
      width: 100,
      renderCell: (params) => {
        return (
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <MuiIconButton
              ref={btnRef_deleteMenu}
              permission={STANDARD.CONFIGURATION.ROLE.SET_MENU}
              btnText="delete"
              onClick={() => handleDeleteMenu(params.row)}
            />
            {params.row.navigateUrl && (
              <MuiIconButton
                ref={btnRef_permissionMenu}
                permission={STANDARD.CONFIGURATION.ROLE.SET_PERMISSION}
                btnText="permission"
                onClick={() => handleUpdate(params.row)}
              />
            )}
          </Grid>
        );
      },
    },
    {
      field: '',
      headerName: '',
      flex: 1,
    },
  ];

  const handleUpdate = (row) => {
    setSelectedRow(row);
    permissionDialog.toggle();
  };

  const getMenuByRole = async () => {
    setMenuState((prevState) => {
      return {
        ...prevState,
        isLoading: true,
      };
    });

    const { Data, TotalRow } = await roleService.GetMenuByRole(selectedRoleId ?? 0, {
      page: 1,
      pageSize: 0,
      keyWord: null,
    });

    if (Data) {
      const selectedMenuIdArr = Data.map((item) => {
        return item.menuId;
      });

      dispatchSetSelectedMenu(selectedMenuIdArr, null);
    }

    if (isRendered.current) {
      setMenuState((prevState) => {
        return {
          ...prevState,
          data: Data ?? [],
          totalRow: TotalRow,
          isLoading: false,
        };
      });
    }
  };

  const reloadGrid = async () => {
    if (selectedRoleId) {
      setMenuState((prevState) => {
        return {
          ...prevState,
          data: [],
          totalRow: 0,
          isLoading: true,
        };
      });

      const { Data, TotalRow } = await roleService.GetMenuByRole(selectedRoleId ?? 0, {
        page: 1,
        pageSize: 0,
        keyWord: null,
      });

      if (isRendered.current) {
        setMenuState((prevState) => {
          return {
            ...prevState,
            data: Data ?? [],
            totalRow: TotalRow,
            isLoading: false,
          };
        });
      }
    }
  };

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      dispatchSetSelectedRoleId(0);
      dispatchSetSelectedMenu([], null);
      isRendered.current = false;
    };
  }, []);

  useEffect(() => {
    if (selectedRoleId) getMenuByRole();
  }, [selectedRoleId]);

  useEffect(() => {
    reloadGrid();
  }, [selectedMenu]);

  const handleDeleteMenu = async (row) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      const data = {
        roleId: selectedRoleId,
        roleCode: selectedRoleCode,
        menuId: row.menuId,
      };

      setMenuState((prevState) => {
        return { ...prevState, isLoading: true };
      });
      const { ResponseMessage, Data } = await roleService.deleteMenu(data);

      setMenuState((prevState) => {
        return { ...prevState, isLoading: false };
      });

      if (ResponseMessage === `general.success`) {
        SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
        getMenuByRole();
      } else {
        ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
      }
    }
  };
  return (
    <React.Fragment>
      <Grid container spacing={4} direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid item xs={12} md={12}>
          <MuiDataGrid
            showLoading={menuState.isLoading}
            columns={menuColumns}
            rows={menuState.data}
            page={menuState.page - 1}
            pageSize={menuState.pageSize}
            rowCount={menuState.totalRow}
            onPageChange={(newPage) =>
              setMenuState((prevState) => {
                return { ...prevState, page: newPage + 1 };
              })
            }
            // checkboxSelection={true}
            // selectionModel={selectedRow}
            // onSelectionModelChange={(ids) => {
            //   setSelectedRow(() => {
            //     return ids;
            //   });
            // }}
            getRowId={(rows) => rows.menuId}
            // getRowClassName={(params) => {
            //   if (params.row.menuLevel === 1) return `Mui-textColor-pink`;
            //   if (params.row.menuLevel === 2) return `Mui-cyan`;
            // }}
            reloadGrid={reloadGrid}
          />
          <RolePermissionDialog
            initModel={selectedRow}
            isOpen={permissionDialog.isShowing}
            onClose={permissionDialog.toggle}
            selectedRoleId={selectedRoleId}
            selectedRoleCode={selectedRoleCode}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default MenuGrid;
