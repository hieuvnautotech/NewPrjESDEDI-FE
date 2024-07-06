import { STANDARD } from '@constants/PermissionConstants';
import { MuiButton, MuiDataGrid, MuiDialog } from '@controls';
import { Grid } from '@mui/material';
import { roleService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const RolePermissionDialog = ({ initModel, isOpen, onClose, selectedRoleId, selectedRoleCode }) => {
  const intl = useIntl();
  const btnRef_saveRoleMenuPermission = useRef();

  const [permissionRole, setPermissionRole] = useState([]);
  const [permissionMenu, setPermissionMenu] = useState([]);
  const [gridTotalRow, setGridTotalRow] = useState(0);
  const [dialogState, setDialogState] = useState({ isLoading: false });

  const getPermission = async () => {
    setDialogState((prev) => ({ ...prev, isLoading: true }));

    const menuPermissionIdArr = await roleService.getRoleMenuPermission({
      roleId: selectedRoleId,
      menuId: initModel.menuId,
    });

    setPermissionRole(() => {
      return menuPermissionIdArr ?? [];
    });

    const { Data } = await roleService.getMenuPermission({
      menuId: initModel.menuId,
    });

    setPermissionMenu(() => {
      return Data ?? [];
    });

    setGridTotalRow(() => {
      return Data ? Data.length : 0;
    });

    setDialogState((prev) => ({ ...prev, isLoading: false }));
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.id) + 1,
    },

    { field: 'MP_Name', headerName: intl.formatMessage({ id: 'model.menuPermission.field.MP_Name' }), width: 250 },

    {
      field: 'MP_Description',
      headerName: intl.formatMessage({ id: 'model.menuPermission.field.MP_Description' }),
      width: 600,
      renderCell: (params) => intl.formatMessage({ id: params.row.MP_Description }),
    },
    {
      field: 'photo',
      headerName: intl.formatMessage({ id: 'model.menuPermission.field.photo' }),
      width: 200,
      alignItems: 'center',
      renderCell: (params) => {
        return (
          params.row.photo && (
            <PhotoProvider>
              <PhotoView src={params.row.photo}>
                <img
                  src={params.row.photo}
                  alt={params.row.MP_Name}
                  style={{ height: 25, width: 200, cursor: 'pointer', border: '1px solid', borderRadius: '5px' }}
                />
              </PhotoView>
            </PhotoProvider>
          )
        );
      },
    },
  ];

  const handleCloseDialog = () => {
    onClose();
    setPermissionRole([]);
    setPermissionMenu([]);
    setDialogState({ isLoading: false });
  };

  const onSubmit = async () => {
    setDialogState((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { ResponseMessage } = await roleService.setPermissionForRole({
      roleId: selectedRoleId,
      roleCode: selectedRoleCode,
      menuPermissionIds: permissionRole,
      menuId: initModel.menuId,
    });

    setDialogState((prevState) => {
      return { ...prevState, isLoading: false };
    });

    if (ResponseMessage === `general.success`) {
      SuccessAlert(intl.formatMessage({ id: ResponseMessage }));
    } else {
      ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      getPermission();
    }
  }, [initModel, isOpen]);

  return (
    <MuiDialog
      maxWidth="lg"
      title={initModel.menuName}
      isOpen={isOpen}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <MuiDataGrid
        showLoading={dialogState.isLoading}
        disableGrid={dialogState.isLoading}
        columns={columns}
        rows={permissionMenu}
        rowCount={gridTotalRow}
        pageSize={10}
        getRowId={(rows) => rows.Id}
        selectionModel={permissionRole}
        onSelectionModelChange={setPermissionRole}
        checkboxSelection={true}
        disableSelectionOnClick
        reloadGrid={getPermission}
      />
      <Grid item xs={12}>
        <Grid container direction="row-reverse">
          <MuiButton
            permission={STANDARD.CONFIGURATION.ROLE.SET_PERMISSION}
            ref={btnRef_saveRoleMenuPermission}
            btnText="save"
            disabled={dialogState.isLoading}
            onClick={onSubmit}
          />
        </Grid>
      </Grid>
    </MuiDialog>
  );
};

export default RolePermissionDialog;
