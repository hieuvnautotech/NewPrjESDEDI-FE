import { getMenuHtml } from '@utils';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
export default function useSetTitlePage(history) {
  const menus = useRef([]);
  const { pathname } = useLocation();

  const handleChangeLanguage = ({ detail }) => {
    const { breadcrumb } = getMenuHtml(detail);
    menus.current = breadcrumb;
    const data = breadcrumb.filter((x) => x.path == pathname)[0];
    if (data) document.title = 'ESD - ' + data.title;
    else document.title = 'ESD';
  };

  useEffect(() => {
    const { breadcrumb } = getMenuHtml();
    menus.current = breadcrumb;
    const data = breadcrumb.filter((x) => x.path == pathname)[0];
    if (data) document.title = 'ESD - ' + data.title;
    else document.title = 'ESD';
  }, []);

  useEffect(() => {
    document.addEventListener('changeLanguage', handleChangeLanguage);
    return () => document.removeEventListener('changeLanguage', handleChangeLanguage);
  }, []);

  const onPathChange = (e) => {
    if (menus.current.length === 0) {
      const { breadcrumb } = getMenuHtml();
      menus.current = breadcrumb;
    }
    const data = menus.current.filter((x) => x.path == e.pathname)[0];
    if (data) document.title = 'ESD - ' + data.title;
    else document.title = 'ESD';
  };
  useEffect(() => {
    const unlisten = history.listen(onPathChange);
    return unlisten;
  }, []);

  return null;
}
