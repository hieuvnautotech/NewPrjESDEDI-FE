import { ContentBox, LoaderOverlay } from '@components';
import { getMenuHtml, historyApp } from '@utils';
import React, { Suspense, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMenuStore } from '@stores';
const TabPanel = ({ index, ...other }) => {
  const { children } = other;
  return (
    <>
      <div
        role="tabpanel"
        hidden={false}
        id={`tabpanel-${index}`}
        // aria-labelledby={`simple-tab-${index}`}
        style={{
          maxHeight: 'calc(100vh - calc(3.5rem + 1px) - calc(3rem + 1px))',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </>
  );
};

const TabPanelMemo = React.memo(
  ({
    name,
    title,
    code,
    // key,
    breadcrumb_array,
    ChildComponent,
    index,
    index_tab_active,
    refChild,
    setRefChild,
    ...other
  }) => {
    const myRef = React.useRef();
    const intl = useIntl();
    const { menu } = useMenuStore((state) => state);

    const [breadcrumbState, setBreadcrumbState] = useState({
      title,
      code,
      breadcrumb: breadcrumb_array,
    });

    useEffect(() => {
      setRefChild(myRef.current);

      //   var funcTabChange=  myRef.current?.componentTabChange;
      //   funcTabChange &&  funcTabChange(1,1,null,null);
      $(window).scrollTop(0);
      $(`#tabpanel-${index}`).attr('hidden', false);

      // return () => {

      //     funcTabChange &&  funcTabChange(null,null,null,1);

      // }
    }, [index]);

    const handleChangeLanguage = async ({ detail }) => {
      if (detail) {
        const { breadcrumb } = getMenuHtml(detail);
        const breadcrumbCurrent = breadcrumb.filter((x) => x.code === code)[0];

        if (breadcrumbCurrent) {
          setBreadcrumbState(() => {
            return breadcrumbCurrent;
          });
        }
      }
    };

    useEffect(() => {
      const updatedMenu = menu.map((element) => ({
        ...element,
        menuName: intl.formatMessage({ id: element.languageKey }),
      }));
      handleChangeLanguage({ detail: updatedMenu });
    }, [index]);

    useEffect(() => {
      document.addEventListener('changeLanguage', handleChangeLanguage);
      return () => document.removeEventListener('changeLanguage', handleChangeLanguage);
    }, [index]);

    return (
      <TabPanel index={index} {...other}>
        <Suspense fallback={<LoaderOverlay />}>
          <ContentBox title={breadcrumbState.title} code={breadcrumbState.code} breadcrumb={breadcrumbState.breadcrumb}>
            {ChildComponent && <ChildComponent ref={myRef} />}
          </ContentBox>
        </Suspense>
      </TabPanel>
    );
  },

  (preProps, nextProps) => {
    const isEq = preProps.index === nextProps.index;
    if (isEq) {
      if (nextProps.index_tab_active == nextProps.index) {
        // console.log('tab ' + nextProps.index + ' selected');

        $(window).scrollTop(0);
        $(`#tabpanel-${nextProps.index}`).attr('hidden', false); // anti flicking, hacked by mrhieu84
        if (nextProps.refChild) {
          var funcTabChange = nextProps.refChild?.componentTabChange;
          funcTabChange && funcTabChange(1, null);
        }

        // else {
        //        var funcTabChange=nextProps.ChildComponent.componentTabChange
        // console.log(funcTabChange)
        //         funcTabChange && funcTabChange(0);
        //     }
      } else if (preProps.index_tab_active == nextProps.index) {
        // console.log('tab ' + nextProps.index + ' deselected');

        $(`#tabpanel-${nextProps.index}`).attr('hidden', true); // anti flicking, hacked by mrhieu84
        if (nextProps.refChild) {
          var funcTabChange = nextProps.refChild?.componentTabChange;
          funcTabChange && funcTabChange(null, 1);
        }
      }
    }

    // console.log(`check areEqual ${preProps.index} === ${nextProps.index}`);

    return isEq;
  }
);

const TabListContent = (props) => {
  const intl = useIntl();
  const { HistoryElementTabs, index_tab_active } = props;

  return HistoryElementTabs.length ? (
    HistoryElementTabs.map((ele, index) => {
      return (
        <TabPanelMemo
          name={ele.name}
          code={ele.code}
          key={ele.code}
          title={ele.title}
          breadcrumb_array={ele.breadcrumb_array}
          ChildComponent={ele.ChildComponent}
          index={ele.index}
          setRefChild={(r) => (ele.ref = r)}
          refChild={ele.ref}
          index_tab_active={index_tab_active}
        />
      );
    })
  ) : (
    <ContentBox title={''} breadcrumb={[]}></ContentBox>
  );
};

export default TabListContent;
