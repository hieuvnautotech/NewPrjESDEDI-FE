import { useState, useCallback } from 'react';

const useSelectRow = (initialModel, findInData, idProperty) => {
  const [selectedRow, setSelectedRow] = useState(initialModel);

  const handleSelectedRow = useCallback(
    (arrIds) => {
      const rowSelected = findInData.find((item) => item[idProperty] === arrIds[0]);
      if (rowSelected) {
        setSelectedRow(() => rowSelected);
      } else {
        setSelectedRow(() => initialModel);
      }
    },
    [initialModel, findInData, idProperty]
  );

  return [selectedRow, setSelectedRow, handleSelectedRow];
};
export default useSelectRow;
