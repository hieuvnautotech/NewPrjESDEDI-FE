import { useState } from 'react';

const useModal = (init = false) => {
  const [isShowing, setIsShowing] = useState(init);

  const toggle = () => {
    setIsShowing((prevState) => {
      return !prevState;
    });
  };

  return {
    isShowing,
    toggle,
  };
};

export default useModal;
