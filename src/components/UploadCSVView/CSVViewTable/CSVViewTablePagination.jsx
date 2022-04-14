import React from 'react';
import PropTypes from 'prop-types';

const CSVViewTablePagination = ({ pageLength, pageIndex, pageCount, pageSize, pageControl }) => {
  const { setPageSize, gotoPage, nextPage, previousPage, canNextPage, canPreviousPage } =
    pageControl;

  return (
    <div>
      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} type="button">
        {'<<'}
      </button>{' '}
      <button onClick={() => previousPage()} disabled={!canPreviousPage} type="button">
        {'<'}
      </button>{' '}
      <button onClick={() => nextPage()} disabled={!canNextPage} type="button">
        {'>'}
      </button>{' '}
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} type="button">
        {'>>'}
      </button>{' '}
      <span>
        Page{' '}
        <strong>
          {pageIndex + 1} of {pageLength}
        </strong>{' '}
      </span>
      <span>
        | Go to page:{' '}
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          style={{ width: '100px' }}
        />
      </span>{' '}
      <select
        value={pageSize}
        onChange={e => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map(pageSizeVal => (
          <option key={pageSizeVal} value={pageSizeVal}>
            Show {pageSizeVal}
          </option>
        ))}
      </select>
    </div>
  );
};

CSVViewTablePagination.propTypes = {
  pageLength: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageControl: PropTypes.exact({
    setPageSize: PropTypes.func,
    gotoPage: PropTypes.func,
    nextPage: PropTypes.func,
    previousPage: PropTypes.func,
    canNextPage: PropTypes.bool,
    canPreviousPage: PropTypes.bool,
  }).isRequired,
};

export default CSVViewTablePagination;
