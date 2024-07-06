import { useSetTitlePage } from '@hooks';
import { Treeview } from '@static/js/adminlte.js';
import { getMenuHtml } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router';

import { Store } from '@appstate';
import { Dashboard_Operations } from '@appstate/dashBoard';
import { Display_Operations } from '@appstate/display';
import { User_Operations } from '@appstate/user';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { useUpdateEffect } from '@hooks';
import { useIntl } from 'react-intl';

import { useMenuStore } from '@stores';

import { useSignal } from '@preact/signals-react';
import { TextField } from '@mui/material';

// const inputSearch = signal('');

function findAncestors(nodes, targetNode) {
  const ancestors = [];

  function find(node) {
    const parent = nodes.find((n) => n.menuId === node.parentId);
    if (parent) {
      ancestors.push(parent);
      find(parent);
    }
  }

  find(targetNode);
  return ancestors;
}

const SideBar = (props) => {
  const intl = useIntl();
  const userMenu = useMenuStore((state) => state.menu);
  const dispatchSetMenu = useMenuStore((state) => state.dispatchSetMenu);
  const menuGroupByRole = useMenuStore((state) => state.menuGroupByRole);
  const menuHtml = useMenuStore((state) => state.menuHtml);
  const dispatchSetMenuHtml = useMenuStore((state) => state.dispatchSetMenuHtml);

  const [inputSearch, setInputSearch] = useState('');
  const { classes, HistoryElementTabs, index_tab_active_array, deleteAll, deleteTab, deleteOtherTab, language } = props;

  const Treeview_sideMenu = new Treeview($('#main-sidebar-menu'), {
    accordion: false,
    animationSpeed: 300,
    expandSidebar: true,
    sidebarButtonSelector: '[data-widget="pushmenu"]',
    trigger: '[data-widget="treeview"] .nav-link',
    widget: 'treeview',
  });

  useSetTitlePage(props.history);

  const avatar = props.avatar;

  const linkClickHandler = (e) => {
    const targetlink = e.target.closest('a');
    targetlink?.classList?.add('active');

    if (!targetlink) return;

    const router = targetlink.getAttribute('router');

    if (router && router != '') {
      $('#main-sidebar-menu').find('a[router]').removeClass('active');
      targetlink?.classList?.add('active');

      e.preventDefault();
      props.history.push({
        pathname: router,
        //  is_reload_component:true
      });
    }
  };

  const handleFilterMenus = () => {
    const menu_Lang = userMenu.map((element) => ({
      ...element,
      menuName: intl.formatMessage({ id: element.languageKey }),
    }));

    const menuFilter = menu_Lang.filter((x) => x.menuName.toLowerCase().includes(inputSearch?.trim()?.toLowerCase()));
    let result = [];
    for (const item of menuFilter) {
      let parent = findAncestors(menu_Lang, item);
      result = result.concat(parent);
    }

    result = _.uniq(result.concat(menuFilter));

    const { html } = getMenuHtml(result);

    dispatchSetMenuHtml(html);
  };

  const combineRoleMenus = (data) => {
    const menuList = [];
    const uniqueMenuIds = new Set();

    data.forEach((item) => {
      item.menuList.forEach((menuItem) => {
        menuList.push(menuItem);
      });
    });

    // Filter array to include only unique objects based on menuId
    const uniqueArray = menuList.filter((obj) => {
      if (!uniqueMenuIds.has(obj.menuId)) {
        uniqueMenuIds.add(obj.menuId);
        return true;
      }
      return false;
    });

    return uniqueArray;
  };

  const renderRef = useRef(false);

  useEffect(() => {
    if (!renderRef.current) {
      renderRef.current = true;
    } else {
      Treeview_sideMenu.init();
    }

    // document.dispatchEvent(new Event('changeLanguage'));
  }, [menuHtml]);

  useUpdateEffect(() => {
    const menu_Lang = userMenu.map((element) => ({
      ...element,
      menuName: intl.formatMessage({ id: element.languageKey }),
    }));

    const { html } = getMenuHtml(menu_Lang);

    dispatchSetMenuHtml(html);
  }, [userMenu, language]);

  useUpdateEffect(() => {
    const uniqueArray = combineRoleMenus(menuGroupByRole);

    dispatchSetMenu(uniqueArray);
  }, [menuGroupByRole]);

  useUpdateEffect(() => {
    // if (inputSearch?.trim().length) {
    //   return;
    // }

    $('#main-sidebar-menu').find('a[router]').removeClass(['active', 'active-menu']);
    $('#main-sidebar-menu').find('ul').css('display', 'none');
    $('#main-sidebar-menu').find('li').removeClass('menu-is-opening menu-open');

    const router = HistoryElementTabs[index_tab_active_array]?.router;

    const selectedRouter = $('#main-sidebar-menu').find(`a[router='${router}']`);

    selectedRouter?.addClass('active');

    const level = HistoryElementTabs[index_tab_active_array]?.menuLevel;

    if (level === 3) {
      const parentLevel4 = selectedRouter.parent('li');

      const parentLevel3 = parentLevel4.parent('ul');
      parentLevel3.css('display', 'block');

      const parentLevel2 = parentLevel3.parent('li');
      parentLevel2.addClass('menu-is-opening menu-open');
      parentLevel2.find('a[router=""]').addClass('active-menu');

      const parentLevel1 = parentLevel2.parent('ul');
      parentLevel1.css('display', 'block');

      const parentLevel0 = parentLevel1.parent('li');
      parentLevel0.addClass('menu-is-opening menu-open active');
      const parent = parentLevel0.children('a.nav-link');
      parent.addClass('active');
    }

    if (level === 2) {
      const parentLevel3 = selectedRouter.parent('li');

      const parentLevel2 = parentLevel3.parent('ul');
      parentLevel2.css('display', 'block');

      const parentLevel1 = parentLevel2.parent('li');
      parentLevel1.addClass('menu-is-opening menu-open');
      const parent = parentLevel1.children('a.nav-link');
      parent.addClass('active');
    }
  }, [HistoryElementTabs, menuHtml]);

  const onHandleChange = (event) => {
    setInputSearch(event.target.value);
  };

  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-3">
        {/* <!-- Brand Logo --> */}
        <a
          href="#"
          data-widget="pushmenu"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="brand-link"
          style={{
            backgroundColor: '#f8f9fa',
            padding: '0.4rem 0.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <img
            src={require('@static/images/LogoESD.jpg')}
            alt="Company Logo"
            // className="brand-image img-circle elevation-1"
          />
        </a>

        {/* <!-- Sidebar --> */}
        <div className="sidebar">
          {/* <!-- Sidebar user (optional) --> */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="info">
              <a
                href="#"
                className="d-flex align-items-center"
                onClick={(e) => e.preventDefault()}
                title={props.FullNameLogin}
              >
                <img
                  // src={require('@static/dist/img/avatar5.png')}
                  src={avatar}
                  alt="User Logo"
                  className="brand-image img-avatar elevation-3 mx-1"
                />

                <span style={{ marginLeft: 5, fontFamily: 'Calibri', fontStyle: 'italic' }}>{props.FullNameLogin}</span>
              </a>
            </div>
          </div>
          {/* <!-- Sidebar Menu --> */}
          <div className="w-100 d-flex  mb-2">
            <TextField
              value={inputSearch}
              // onChange={(e) => setInputSearch(e.target.value)}
              onChange={onHandleChange}
              // label="Search"
              size="small"
              className="bg-white w-100 mr-1"
              style={{ borderRadius: 4 }}
              onKeyDown={(e) => e.key == 'Enter' && handleFilterMenus()}
            />
          </div>
          <nav className="mt-2">
            <ul
              id="main-sidebar-menu"
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {menuHtml && <div onClick={linkClickHandler} dangerouslySetInnerHTML={{ __html: menuHtml }}></div>}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

Dashboard_Operations.toString = () => {
  return 'Dashboard_Operations';
};

User_Operations.toString = () => {
  return 'User_Operations';
};

Display_Operations.toString = () => {
  return 'Display_Operations';
};

const mapStateToProps = (state) => {
  const {
    Dashboard_Reducer: { HistoryElementTabs, index_tab_active, index_tab_active_array, notify_list, total_notify },
    User_Reducer: { language },
    Display_Reducer: {
      totalOrderQty,
      totalActualQty,
      totalNGQty,
      totalGoodQtyInjection,
      totalNGQtyInjection,
      totalGoodQtyAssy,
      totalNGQtyAssy,
      totalEfficiency,
      data,
    },
  } = CombineStateToProps(state.AppReducer, [[Store.Dashboard_Reducer], [Store.User_Reducer], [Store.Display_Reducer]]);

  return {
    HistoryElementTabs,
    index_tab_active,
    index_tab_active_array,
    notify_list,
    total_notify,

    language,
    totalOrderQty,
    totalActualQty,
    totalNGQty,
    totalGoodQtyInjection,
    totalNGQtyInjection,
    totalGoodQtyAssy,
    totalNGQtyAssy,
    totalEfficiency,
    data,
  };
};

const mapDispatchToProps = (dispatch) => {
  const {
    Dashboard_Operations: { appendTab, switchTab, deleteTab, deleteOtherTab, deleteAll, updateTimeAgo, updatenotify },
    // , User_Operations: {
    //     changeLanguage
    // },
    Display_Operations: { saveDisplayData },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [
    [Dashboard_Operations],
    // , [User_Operations]
    [Display_Operations],
  ]);

  return {
    appendTab,
    switchTab,
    deleteTab,
    deleteOtherTab,
    deleteAll,
    updateTimeAgo,
    updatenotify,

    //,changeLanguage
    saveDisplayData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SideBar));

// export default withRouter(SideBar);
