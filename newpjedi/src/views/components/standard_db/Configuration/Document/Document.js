import { ACTION, BASE_URL } from '@constants/ConfigConstants';
import { STANDARD } from '@constants/PermissionConstants';
import { MuiButton, MuiDataGrid, MuiGridWrapper, MuiIconButton, MuiSearchField, MuiSelectField } from '@controls';
import { useModal } from '@hooks';
import { Grid } from '@mui/material';
import { documentService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import DocumentDialog from './DocumentDialog';

import { useTokenStore } from '@stores';

const Document = () => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const btnRef_searchDocument = useRef();
  const btnRef_createDocument = useRef();
  const btnRef_modifyDocument = useRef();
  const btnRef_deleteDocument = useRef();
  const btnRef_reuseDocument = useRef();

  const token = useTokenStore((state) => state);

  const [mode, setMode] = useState(ACTION.CREATE);
  const { isShowing, toggle } = useModal();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      keyWord: '',
      documentLanguage: '',
      // showDelete: true,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [menuComponentList, setMenuComponentList] = useState([]);
  const [languageList, setLanguageList] = useState([]);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 80,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.documentId) + 1 + (state.page - 1) * state.pageSize,
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
              ref={btnRef_modifyDocument}
              permission={STANDARD.CONFIGURATION.DOCUMENT.MODIFY}
              btnText="modify"
              onClick={() => handleUpdate(params.row)}
            />
            {params.row.isActived ? (
              <MuiIconButton
                ref={btnRef_deleteDocument}
                permission={STANDARD.CONFIGURATION.DOCUMENT.DELETE}
                btnText="delete"
                onClick={() => handleDelete(params.row)}
              />
            ) : (
              <MuiIconButton
                ref={btnRef_reuseDocument}
                permission={STANDARD.CONFIGURATION.DOCUMENT.DELETE}
                btnText="reuse"
                onClick={() => handleDelete(params.row)}
              />
            )}
          </Grid>
        );
      },
    },
    { field: 'menuName', headerName: intl.formatMessage({ id: 'model.document.field.menuName' }), width: 250 },
    {
      field: 'menuComponent',
      headerName: intl.formatMessage({ id: 'model.document.field.menuComponent' }),
      width: 200,
    },
    {
      field: 'documentLanguage',
      headerName: intl.formatMessage({ id: 'model.document.field.documentLanguage' }),
      width: 100,
    },
    {
      field: 'urlFile',
      headerName: intl.formatMessage({ id: 'model.document.field.urlFile' }),
      width: 250,
      renderCell: (params) => {
        return (
          <a
            href={`${BASE_URL}/document/${params.row.documentLanguage}/${params.row.urlFile}`}
            style={{ fontSize: 14, cursor: 'pointer' }}
            target="_blank"
          >
            {params.row.urlFile}
          </a>
        );
      },
    },
  ];

  //useEffect
  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
    };
  }, []);

  useEffect(() => {
    getMenuComponent();
    getLanguage();
  }, []);

  useEffect(() => {
    fetchData();
  }, [state.page, state.pageSize]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...state.data];
      if (data.length > state.pageSize) {
        data.pop();
      }
      setState({
        ...state,
        data: [...data],
        totalRow: state.totalRow + 1,
      });
    }
  }, [newData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, (o) => {
        return o.documentId == updateData.documentId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleDelete = async (doc) => {
    if (
      window.confirm(
        intl.formatMessage({ id: doc.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted' })
      )
    ) {
      try {
        const { HttpResponseCode, ResponseMessage } = await documentService.deleteDocument({
          documentId: doc.documentId,
          row_version: doc.row_version,
        });
        if (HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
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

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    // if (inputName == 'showDelete') {
    //   setState({ ...state, page: 1, searchData: { ...newSearchData } });
    // } else {
    //   setState({ ...state, searchData: { ...newSearchData } });
    // }
    setState({ ...state, page: 1, searchData: { ...newSearchData } });
  };

  const handleDownload = async (row) => {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token.accessToken}`,
      },
    };

    fetch(`${API_URL}document/download/${row.menuComponent}/${row.documentLanguage}`, options).then((response) => {
      if (response.status == 200) {
        response.blob().then((blob) => {
          let url = URL.createObjectURL(blob);
          let downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = 'document.pdf';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
        });
      } else {
        ErrorAlert(intl.formatMessage({ id: 'document.FileNotFound' }));
      }
    });
  };

  const fetchData = async () => {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      keyWord: state.searchData.keyWord,
      documentLanguage: state.searchData.documentLanguage,
    };
    const { Data, TotalRow } = await documentService.getDocumentList(params);
    if (isRendered.current)
      setState({
        ...state,
        data: Data ?? [],
        totalRow: TotalRow,
        isLoading: false,
      });
  };

  const getMenuComponent = async () => {
    const res = await documentService.getMenu();
    if (res.HttpResponseCode === 200 && res.Data) {
      setMenuComponentList([...res.Data]);
    }
  };

  const getLanguage = async () => {
    const res = await documentService.getLanguage();
    if (res.HttpResponseCode === 200 && res.Data) {
      setLanguageList([...res.Data]);
    }
  };

  return (
    <React.Fragment>
      <MuiGridWrapper>
        <MuiButton
          permission={STANDARD.CONFIGURATION.DOCUMENT.CREATE}
          ref={btnRef_createDocument}
          btnText="create"
          onClick={handleAdd}
          sx={{ mt: 1 }}
        />
        <MuiSearchField
          fullWidth
          variant="keyWord"
          size="small"
          label="model.document.field.menuComponent"
          onClick={fetchData}
          onChange={(e) => handleSearch(e.target.value, 'keyWord')}
        />

        <MuiSelectField
          label={intl.formatMessage({ id: 'model.document.field.documentLanguage' })}
          options={languageList}
          displayLabel="commonDetailName"
          displayValue="commonDetailName"
          onChange={(e, item) => handleSearch(item ? item.commonDetailName ?? null : null, 'documentLanguage')}
          variant="standard"
        />
        <MuiButton
          permission={STANDARD.CONFIGURATION.DOCUMENT.VIEW}
          ref={btnRef_searchDocument}
          btnText="search"
          onClick={fetchData}
          sx={{ mt: 1 }}
        />

        {/* <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Switch
              defaultChecked={true}
              color="primary"
              onChange={(e) => handleSearch(e.target.checked, 'showDelete')}
            />
          }
          label={intl.formatMessage({
            id: state.searchData.showDelete ? 'general.data_actived' : 'general.data_deleted',
          })}
        /> */}
      </MuiGridWrapper>

      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        columns={columns}
        rows={state.data}
        // gridHeight={736}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        // rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        onPageSizeChange={(newPageSize) => setState({ ...state, pageSize: newPageSize, page: 1 })}
        getRowId={(rows) => rows.documentId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        reloadGrid={fetchData}
      />

      <DocumentDialog
        valueOption={{ menuComponentList: menuComponentList, languageList: languageList }}
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
      />
    </React.Fragment>
  );
};

export default Document;
