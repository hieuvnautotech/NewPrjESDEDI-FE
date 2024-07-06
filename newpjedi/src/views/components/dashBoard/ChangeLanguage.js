import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useLanguageStore, useMenuStore } from '@stores';

const ChangeLanguage = (props) => {
  const { language, changeLanguage } = props;

  const intl = useIntl();
  const [flag, setFlag] = useState('flag-icon-vi');

  const { dispatchSetLanguage } = useLanguageStore((state) => state);
  const { menu, dispatchSetMenu } = useMenuStore((state) => state);

  useEffect(() => {
    // Set flag based on language
    setFlag(language === 'EN' ? 'flag-icon-us' : 'flag-icon-vi');

    if (menu.length) {
      // Map and update menu items with translated menuName
      const updatedMenu = menu.map((element) => ({
        ...element,
        menuName: intl.formatMessage({ id: element.languageKey }),
      }));

      // Update state and dispatch
      handleChangeLanguage(updatedMenu);
      // dispatchSetMenu(updatedMenu);
    }
  }, [language]);

  const handleChangeLanguage = (menu) => {
    const event = new CustomEvent('changeLanguage', { detail: menu });
    document.dispatchEvent(event);
  };

  return (
    <li className="nav-item dropdown">
      <span className="nav-link" data-toggle="dropdown" role="button">
        <i className={`flag-icon ${flag}`}></i>
      </span>
      <div className="dropdown-menu dropdown-menu-right p-0">
        <span
          // href="#"
          className={`dropdown-item ${language == 'EN' ? 'active' : ''}`}
          // onClick={(e) => changeLanguage('EN')}
          onClick={(e) => {
            dispatchSetLanguage('EN');
            changeLanguage('EN');
          }}
          role="button"
        >
          <i className="flag-icon flag-icon-us mr-2"></i> English
        </span>
        <span
          // href="#"
          className={`dropdown-item ${language == 'VI' ? 'active' : ''}`}
          // onClick={(e) => changeLanguage('VI')}
          onClick={(e) => {
            dispatchSetLanguage('VI');
            changeLanguage('VI');
          }}
          role="button"
        >
          <i className="flag-icon flag-icon-vi mr-2"></i> Tiếng Việt
        </span>
      </div>
    </li>
  );
};

export default ChangeLanguage;
