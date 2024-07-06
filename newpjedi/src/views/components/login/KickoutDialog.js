import { MuiDialog } from '@controls';
import { Grid } from '@mui/material';
import { useUserStore } from '@stores';
import React from 'react';
import { useIntl } from 'react-intl';
import { DIALOG } from '@constants/ConfigConstants';

const KickoutDialog = () => {
  const intl = useIntl();

  const kickOutState = useUserStore((state) => state.kickOutState);
  const kickOutMessage = useUserStore((state) => state.kickOutMessage);
  const dispatchSetKickOutState = useUserStore((state) => state.dispatchSetKickOutState);
  const dispatchSetKickOutMessage = useUserStore((state) => state.dispatchSetKickOutMessage);

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.warning' })}
      isOpen={kickOutState}
      disabledCloseBtn={false}
      disable_animate={300}
      onClose={() => {
        dispatchSetKickOutState(false);
        dispatchSetKickOutMessage('general.Initializing');
      }}
      bgColor={DIALOG.WARNING}
    >
      <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          {intl.formatMessage({ id: kickOutMessage ?? 'general.Initializing' })}
        </Grid>
      </Grid>
    </MuiDialog>
  );
};

export default KickoutDialog;
