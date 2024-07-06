import { STANDARD } from '@constants/PermissionConstants';
import { ACTION, DIALOG } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiDialog, MuiIconButton } from '@controls';
import { useModal, useSelectRow } from '@hooks';
import { MenuPermissionDto } from '@models';
import { Checkbox, Grid } from '@mui/material';
import { menuService } from '@services';
import { SuccessAlert } from '@utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import CreateModifyMenuPermissionDialog from './CreateModifyMenuPermissionDialog';

const initialState = {
  isLoading: false,
  data: [],
  totalRow: 0,
  page: 1,
  pageSize: 8,
  searchData: {
    keyWord: '',
  },
};

const MenuPermissionDialog = ({ initModel, isOpen, onClose }) => {
  const intl = useIntl();

  const isRendered = useRef(false);

  const btnRef_createMenuPermission = useRef();
  const btnRef_modifyMenuPermission = useRef();
  const btnRef_deleteMenuPermission = useRef();

  const menuPermissionModal = useModal();

  const [dialogState, setDialogState] = useState(initialState);
  const [mode, setMode] = useState(ACTION.CREATE);
  const [createRow, setCreateRow] = useState(MenuPermissionDto);
  const [modifyRow, setModifyRow] = useState(MenuPermissionDto);
  const [selectedRow, setSelectedRow, handleSelectedRow] = useSelectRow(MenuPermissionDto, dialogState.data, 'Id');

  const fetchData = useCallback(async (menuId) => {
    setDialogState((prevState) => {
      return { ...prevState, isLoading: true, data: [] };
    });

    const { Data, TotalRow } = await menuService.getMenuPermission(menuId);

    if (isRendered.current) {
      setDialogState((prevState) => {
        return {
          ...prevState,
          data: Data ?? [],
          totalRow: TotalRow,
          isLoading: false,
        };
      });
    }
  }, []);

  const handleCloseDialog = () => {
    onClose();
  };

  const handleDeleteMenu = async (menuPermission) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        const { ResponseMessage } = await menuService.deleteMenuPermission(menuPermission.Id);
        if (ResponseMessage === `general.success`) {
          await fetchData(initModel.menuId);
          SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
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
      width: 100,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.id) + 1,
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
          <Grid container direction="row" alignItems="center" justifyContent="space-between">
            <MuiIconButton
              ref={btnRef_modifyMenuPermission}
              permission={STANDARD.CONFIGURATION.MENU.SET_PERMISSION}
              btnText="modify"
              onClick={() => {
                setMode(() => {
                  return ACTION.MODIFY;
                });
                menuPermissionModal.toggle();
              }}
            />
            <MuiIconButton
              ref={btnRef_deleteMenuPermission}
              permission={STANDARD.CONFIGURATION.MENU.SET_PERMISSION}
              btnText="delete"
              onClick={() => handleDeleteMenu(params.row)}
            />
          </Grid>
        );
      },
    },

    { field: 'MP_Name', headerName: intl.formatMessage({ id: 'model.menuPermission.field.MP_Name' }), width: 250 },

    {
      field: 'MP_Description',
      headerName: intl.formatMessage({ id: 'model.menuPermission.field.MP_Description' }),
      width: 400,
      renderCell: (params) => intl.formatMessage({ id: params.row.MP_Description }),
    },
    {
      field: 'photo',
      headerName: intl.formatMessage({ id: 'model.menuPermission.field.photo' }),
      width: 200,
      renderCell: (params) => {
        return (
          params.row.photo && (
            <PhotoProvider>
              <PhotoView src={params.row.photo}>
                <img
                  src={params.row.photo}
                  alt="params.row.MP_Name"
                  style={{ height: 25, width: 200, cursor: 'pointer', border: '1px solid', borderRadius: '5px' }}
                />
              </PhotoView>
            </PhotoProvider>
          )
        );
      },
    },

    {
      field: 'forRoot',
      headerName: intl.formatMessage({ id: 'model.menuPermission.field.forRoot' }),
      width: 120,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
            <Grid item>{params.row.forRoot && <Checkbox disabled checked />}</Grid>
          </Grid>
        );
      },
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
    if (isOpen) {
      fetchData(initModel.menuId);
    }
  }, [initModel, isOpen]);

  useEffect(() => {
    if (!_.isEmpty(createRow) && !_.isEqual(createRow, MenuPermissionDto)) {
      const data = [createRow, ...dialogState.data];
      if (data.length > dialogState.pageSize) {
        data.pop();
      }
      setDialogState((prevState) => {
        return {
          ...prevState,
          data: [...data],
          totalRow: dialogState.totalRow + 1,
        };
      });
    }
  }, [createRow]);

  useEffect(() => {
    if (!_.isEmpty(modifyRow) && !_.isEqual(modifyRow, MenuPermissionDto)) {
      let newArr = [...dialogState.data];
      const index = _.findIndex(newArr, (o) => {
        return o.Id == modifyRow.Id;
      });

      if (index !== -1) {
        newArr[index] = modifyRow;
      }

      if (isRendered.current) {
        setDialogState((prevState) => {
          return {
            ...prevState,
            data: [...newArr],
          };
        });
      }
    }
  }, [modifyRow]);

  return (
    <React.Fragment>
      <MuiDialog
        maxWidth="xl"
        title={initModel.menuName}
        isOpen={isOpen}
        // disabledCloseBtn={dialogState.isSubmit}
        disable_animate={300}
        onClose={handleCloseDialog}
        bgColor={DIALOG.INFO}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          // style={{ paddingTop: '10px' }}
        >
          <Grid item xs={5}>
            <MuiButton
              permission={STANDARD.CONFIGURATION.MENU.SET_PERMISSION}
              ref={btnRef_createMenuPermission}
              btnText="create"
              disabled={initModel.menuId ? false : true}
              onClick={() => {
                setMode(() => {
                  return ACTION.CREATE;
                });
                menuPermissionModal.toggle();
              }}
            />
          </Grid>
        </Grid>

        <MuiDataGrid
          showLoading={dialogState.isLoading}
          disableGrid={dialogState.isLoading}
          columns={columns}
          rows={dialogState.data}
          rowCount={dialogState.totalRow}
          page={dialogState.page - 1}
          pageSize={dialogState.pageSize}
          onPageChange={(newPage) => {
            setDialogState((prevState) => {
              return { ...prevState, page: newPage + 1 };
            });
          }}
          getRowId={(rows) => rows.Id}
          onSelectionModelChange={(newSelectedRowId) => {
            handleSelectedRow(newSelectedRowId);
          }}
          getRowClassName={(params) => {
            if (_.isEqual(params.row, createRow)) {
              return `Mui-created`;
            }
          }}
          initialState={{ pinnedColumns: { right: ['action'] } }}
          reloadGrid={() => fetchData(initModel.menuId)}
        />
      </MuiDialog>

      <CreateModifyMenuPermissionDialog
        mode={mode}
        menuId={initModel.menuId}
        initModel={mode === ACTION.CREATE ? MenuPermissionDto : selectedRow}
        setCreateRow={setCreateRow}
        setModifyRow={setModifyRow}
        setSelectedRow={setSelectedRow}
        isOpen={menuPermissionModal.isShowing}
        onClose={menuPermissionModal.toggle}
      />
    </React.Fragment>
  );
};

export default MenuPermissionDialog;
