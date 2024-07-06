import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { MuiDialog } from '@controls';
import { useRef } from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { DIALOG } from '@constants/ConfigConstants';

const StyledButton = styled(Button)(({ theme, text, color }) => ({
  width: 80,
  margin: theme.spacing(0.5),

  // textAlign: 'center',
  // backgroundColor: color ? theme.palette[color].light : undefined
}));

export default function ScanCamera({ afterScan, txt = 'SCAN', disabled = false }) {
  const { palette } = createTheme();

  const { augmentColor } = palette;

  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
  const theme = createTheme({
    palette: {
      scan: createColor('#243782'),
    },
  });

  const [selected, setSelected] = useState('environment');
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState('');
  const [delayScan, setDelayScan] = useState(500);

  const qrRef = useRef(null);
  const handleScan = async (scanData) => {
    setLoadingScan(true);
    // console.log(qrRef);
    // console.log(`loaded data data`, scanData);
    if (scanData && scanData !== '' && startScan) {
      setData(scanData);
      setStartScan(false);
      setLoadingScan(false);
      afterScan(scanData);
      //alert('after scan');
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  useEffect(() => {
    if (startScan) {
      setData('');
    }
  }, [startScan]);
  return (
    <div>
      <ThemeProvider theme={theme}>
        <StyledButton
          variant="contained"
          color="scan"
          onClick={() => {
            setStartScan(true);
          }}
          disabled={disabled}
        >
          <DocumentScannerIcon />
        </StyledButton>
      </ThemeProvider>
      <MuiDialog title={'SCAN'} isOpen={startScan} onClose={() => setStartScan(false)} bgColor={DIALOG.WARNING}>
        <select
          value={selected}
          onChange={(e) => {
            setStartScan(false);
            setSelected(e.target.value);
          }}
        >
          <option value={'environment'}>Back Camera</option>
          <option value={'user'}>Front Camera</option>
        </select>
        {startScan && (
          <QrReader
            scanDelay={delayScan}
            // ref={qrRef}
            constraints={{
              facingMode: selected,
            }}
            delay={1000}
            onError={handleError}
            style={{ width: '300px' }}
            onResult={(result, error) => {
              if (!!result) {
                handleScan(result?.getText());
                ReactDOM.unmountComponentAtNode(QrReader);
              }
            }}
            React
          />
        )}
      </MuiDialog>
    </div>
  );
}
