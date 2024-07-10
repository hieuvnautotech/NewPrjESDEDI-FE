import React, { useState, useEffect } from 'react';
import { Badge } from '@mui/material';
import { useUserStore } from '@stores';

const MuiBadgeWrapper = ({ children, badgeContent, color, permission }) => {
  const missingPermission = useUserStore((state) => state.missingPermission);

  const [invisible, setInvisible] = useState(true);

  useEffect(() => {
    let flag = true;
    if (permission && permission !== 'allowAll') {
      for (let i = 0; i < missingPermission.length; i++) {
        if (missingPermission[i] === permission) {
          setInvisible(() => {
            return true;
          });
          flag = false;
          break;
        }
      }

      if (flag) {
        setInvisible(() => {
          return false;
        });
      }
    }
  }, [missingPermission, badgeContent]);

  return (
    <Badge badgeContent={badgeContent} color={color} invisible={invisible}>
      {children}
    </Badge>
  );
};

export default MuiBadgeWrapper;
