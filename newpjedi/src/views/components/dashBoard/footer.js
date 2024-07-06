import MenuIcon from '@mui/icons-material/Menu';
import { APP_VERSION } from '@constants/ConfigConstants';

const Footer_DashBoard = (props) => {
  return (
    <footer className="main-footer d-flex flex-row-reverse justify-content-between align-items-center">
      <div className="d-flex flex-row align-items-center">
        Version: {APP_VERSION} &nbsp;
        <MenuIcon
          size="small"
          style={{
            margin: '0px 10px',
            cursor: 'pointer',
            backgroundColor: '#ff0000',
            color: '#ffffff',
            borderRadius: '5px',
          }}
          data-widget="pushmenu"
        />
      </div>
      <strong>
        Copyright &copy; 2023 <a href="#">ESD</a>
      </strong>
    </footer>
  );
};

export default Footer_DashBoard;
