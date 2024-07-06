import { useEffect, useRef, useState } from 'react';

import { useUpdateEffect } from '@hooks';
import { useMenuStore } from '@stores';
import { GetMenus_LoginUser, historyDashboard } from '@utils';
import { Route, Switch } from 'react-router-dom';

const PageRouter = (props) => {
  const { menu } = useMenuStore((state) => state);
  const { routers, Component_Default, defaultUrl } = props;

  const isRendered = useRef(false);

  const [state, setState] = useState({
    routers: routers,
    Component_Default: Component_Default,
    defaultUrl: defaultUrl,
  });

  const updateRouterState = async () => {
    if (isRendered.current) {
      setState(() => {
        const newRouter = GetMenus_LoginUser()[2];
        const newComponent_Default = GetMenus_LoginUser()[4];
        const newDefaultUrl = GetMenus_LoginUser()[5] ?? GetMenus_LoginUser()[2][0].props.path;
        return {
          ...state,
          routers: newRouter,
          Component_Default: newComponent_Default,
          defaultUrl: newDefaultUrl,
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
  }, [menu]);

  useUpdateEffect(() => {
    updateRouterState();
  }, [menu]);

  return (
    <Switch>
      {state.routers}
      <Route
        path="/"
        render={(props) => {
          // const isFromLogin = firstLogin.isfirst;
          // firstLogin.isfirst = null;

          // props.history.push(this.defaultUrl);
          historyDashboard.push(state.defaultUrl);
          return <state.Component_Default {...props} />;
        }}
        // component={state.Component_Default}
      />
    </Switch>
  );
};

export default PageRouter;
