import { STANDARD } from '@constants/PermissionConstants';
import { useMenuStore, useRoleStore, useLanguageStore } from '@stores';
import React, { useEffect, useRef, useState } from 'react';

import Card from '@mui/material/Card';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import { Grid } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import MuiResetButton from '@basesControls/MuiResetButton';
import { MuiButton } from '@controls';
import { roleService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import _ from 'lodash';
import { useIntl } from 'react-intl';

//BFS algorithm to find node by his ID
const bfsSearch = (graph, targetId) => {
  const queue = [...graph];

  while (queue.length > 0) {
    const currNode = queue.shift();
    if (currNode.menuId == targetId) {
      return currNode;
    }
    if (currNode.children) {
      queue.push(...currNode.children);
    }
  }
  return []; // Target node not found
};

const MenuTreeView = () => {
  const intl = useIntl();
  const isRendered = useRef(false);

  const btnRef_saveRoleMenu = useRef();

  const menuArr = useMenuStore((state) => state.menu);
  const { selectedRoleId, selectedMenu, dispatchSetSelectedMenu, selectedRoleCode } = useRoleStore((state) => state);
  const { language } = useLanguageStore((state) => state);

  const buildTreeMenu = (level, menuArr, menuTree, parentId) => {
    menuArr.forEach((item) => {
      if (item.parentId === parentId) {
        const child = {
          ...item,
          menuId: item.menuId.toString(),
          key: item.menuId.toString(),

          children: [],
        };

        buildTreeMenu(level + 1, menuArr, child.children, item.menuId);

        menuTree.push(child);
      }
    });
    return menuTree;
  };

  const GetMenuTree = () => {
    const menuTree = [];
    const menuTranslate = menuArr.map((element) => ({
      ...element,
      menuName: intl.formatMessage({ id: element.languageKey }),
    }));

    buildTreeMenu(
      0, //level
      menuTranslate,
      menuTree,
      null
    );
    return menuTree;
  };

  const [menuTreeViewData, setMenuTreeViewData] = useState();
  const [isSubmit, setIsSubmit] = useState(false);

  const [selectedNodes, setSelectedNodes] = useState([]);

  // Retrieve all ids from node to his children's
  const getAllIds = (node, idList = []) => {
    idList.push(node.menuId);
    if (node.children) {
      node.children.forEach((child) => getAllIds(child, idList));
    }
    return idList;
  };
  // Get IDs of all children from specific node
  const getAllChild = (id) => {
    return getAllIds(bfsSearch(menuTreeViewData, id));
  };

  // Get all father IDs from specific node
  const getAllFathers = (id, list = []) => {
    const node = bfsSearch(menuTreeViewData, id);
    if (node.parentId) {
      const parent = bfsSearch(menuTreeViewData, node.parentId);
      parent && list.push(parent);

      getAllFathers(parent.menuId, list);
    }

    return list;
  };

  const isAllChildrenChecked = (node, list) => {
    const allChild = getAllChild(node.menuId);
    const nodeIdIndex = allChild.indexOf(node.menuId);
    allChild.splice(nodeIdIndex, 1);

    return allChild.every((nodeId) => selectedNodes.concat(list).includes(nodeId));
  };

  const selectAllParents = (nodeId) => {
    const fathers = getAllFathers(nodeId);
    setSelectedNodes((prevSelectedNodes) => {
      const combinedArray = [...prevSelectedNodes].concat(fathers);
      const uniqueArray = combinedArray.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      return uniqueArray;
    });

    fathers.forEach((father) => selectAllParents(father));
  };

  const handleNodeSelect = (event, nodeId) => {
    event.stopPropagation();
    const allChild = getAllChild(nodeId);
    const fathers = getAllFathers(nodeId);

    if (selectedNodes.includes(nodeId)) {
      // Need to de-check
      setSelectedNodes((prevSelectedNodes) => prevSelectedNodes.filter((id) => !allChild.concat(fathers).includes(id)));
    } else {
      // Need to check
      const ToBeChecked = allChild;
      for (let i = 0; i < fathers.length; ++i) {
        if (isAllChildrenChecked(bfsSearch(menuTreeViewData, fathers[i]), ToBeChecked)) {
          ToBeChecked.push(fathers[i]);
        }
      }
      setSelectedNodes((prevSelectedNodes) => {
        let combinedArray = [...prevSelectedNodes].concat(ToBeChecked);

        combinedArray = combinedArray.map((x) => {
          return typeof x === 'object' ? x.menuId : x;
        });
        combinedArray = _.uniq(combinedArray);

        return combinedArray;
      });
    }
  };

  const handleExpandClick = (event) => {
    // prevent the click event from propagating to the checkbox
    event.stopPropagation();
  };

  const renderTree = (nodes) => {
    return (
      <TreeItem
        key={nodes.menuId}
        nodeId={nodes.menuId}
        onClick={handleExpandClick}
        label={
          <>
            <Checkbox
              checked={selectedNodes.indexOf(nodes.menuId) !== -1}
              tabIndex={-1}
              disableRipple
              onClick={(event) => handleNodeSelect(event, nodes.menuId)}
            />
            {nodes.menuName}
          </>
        }
      >
        {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </TreeItem>
    );
  };

  const toNumber = (val) => {
    return Number(val);
  };

  const handleSaveMenu = async () => {
    if (!selectedNodes || !selectedNodes.length) {
    } else {
      if (window.confirm(intl.formatMessage({ id: 'general.confirm_modify' }))) {
        const menuIdArr = selectedNodes.map(toNumber);
        try {
          const params = {
            roleId: selectedRoleId,
            roleCode: selectedRoleCode,
            MenuIds: menuIdArr,
          };

          const { HttpResponseCode, ResponseMessage } = await roleService.setMenuForRole(params);

          if (HttpResponseCode === 200) {
            SuccessAlert(intl.formatMessage({ id: 'general.success' }));
            dispatchSetSelectedMenu(menuIdArr, null);
          } else {
            ErrorAlert(intl.formatMessage({ id: ResponseMessage }));
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleReset = () => {
    setSelectedNodes(() => {
      return selectedMenu.map(String);
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
    setMenuTreeViewData(() => {
      return GetMenuTree();
    });
  }, [menuArr, language]);

  useEffect(() => {
    handleReset();
  }, [selectedMenu]);

  return (
    <React.Fragment>
      <Card style={{ marginLeft: '5px' }}>
        <TreeView
          multiSelect
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          selected={selectedNodes}
          style={{ maxHeight: '720px', overflow: 'auto' }}
        >
          {menuTreeViewData && menuTreeViewData.map((node) => renderTree(node))}
        </TreeView>
      </Card>

      <Grid container direction="row-reverse" justifyContent="flex-start" alignItems="center">
        <MuiButton
          permission={STANDARD.CONFIGURATION.ROLE.SET_MENU}
          ref={btnRef_saveRoleMenu}
          btnText="save"
          onClick={handleSaveMenu}
          disabled={isSubmit || !selectedRoleId || selectedNodes.length === 0}
        />
        <MuiResetButton onClick={handleReset} disabled={isSubmit || !selectedRoleId || selectedNodes.length === 0} />
      </Grid>
    </React.Fragment>
  );
};

export default MenuTreeView;
