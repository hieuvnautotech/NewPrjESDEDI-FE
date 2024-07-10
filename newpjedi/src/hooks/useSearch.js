import { useCallback } from 'react';

const useSearch = (setState) => {
  const handleSearch = useCallback(
    (e, inputName) => {
      setState((prevState) => {
        const searchData = { ...prevState.searchData, [inputName]: e };
        return { ...prevState, page: 1, searchData };
      });
    },
    [setState]
  );
  return handleSearch;
};

export default useSearch;
