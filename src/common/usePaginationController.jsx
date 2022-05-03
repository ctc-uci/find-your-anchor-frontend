import { useState, useMemo } from 'react';

const usePaginationController = (unpaginatedData, rowsPerPagination = 6) => {
  const [paginatedIndex, setPaginatedIndex] = useState(0);

  const [paginatedData, totalNumberOfPages] = useMemo(() => {
    if (!unpaginatedData) {
      return [[], 0];
    }
    return [
      unpaginatedData.slice(
        paginatedIndex * rowsPerPagination,
        (paginatedIndex + 1) * rowsPerPagination,
      ),
      Math.ceil(unpaginatedData.length / rowsPerPagination),
    ];
  }, [unpaginatedData, paginatedIndex]);

  return [paginatedData, paginatedIndex, setPaginatedIndex, totalNumberOfPages];
};

export default usePaginationController;
