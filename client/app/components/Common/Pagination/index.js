/**
 *
 * Pagination
 *
 */

import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = props => {
  const { totalPages, onPagination } = props;

  const handlePageClick = event => {
    if (onPagination && typeof onPagination === 'function') {
      onPagination('pagination', event.selected + 1);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className='pagination-box' 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
    >
      <div onClick={stopPropagation} onMouseDown={stopPropagation}>
        <ReactPaginate
          nextLabel='next >'
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={totalPages}
          previousLabel='< previous'
          pageClassName='page-item'
          pageLinkClassName='page-link'
          previousClassName='page-item'
          previousLinkClassName='page-link'
          nextClassName='page-item'
          nextLinkClassName='page-link'
          breakLabel='...'
          breakClassName='page-item'
          breakLinkClassName='page-link'
          containerClassName='pagination'
          activeClassName='active'
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default Pagination;
