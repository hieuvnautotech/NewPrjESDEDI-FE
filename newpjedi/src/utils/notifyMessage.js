import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';

const position = isMobile ? 'top-right' : 'bottom-right';

const SuccessAlert = (message) => {
  toast.success(message, { position: position, autoClose: 5000 });
};

const ErrorAlert = (message) => {
  toast.error(message, {
    position: position,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const WarningAlert = (message) => {
  toast.warning(message, {
    position: position,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const RabbitMQ_SuccessAlert = (message) => {
  toast.success(message, { position: 'top-center', autoClose: 5000 });
};

const RabbitMQ_ErrorAlert = (message) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export { SuccessAlert, ErrorAlert, WarningAlert, RabbitMQ_SuccessAlert, RabbitMQ_ErrorAlert };
