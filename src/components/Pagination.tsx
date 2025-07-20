import { Component } from 'react';

interface PaginationProps {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

class Pagination extends Component<PaginationProps> {
  render() {
    const { page, total, onNext, onPrev } = this.props;
    return (
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 rounded bg-gray-300 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
          onClick={onPrev}
          disabled={page === 1}
        >
          Previous
        </button>
        <div>
          Page {page} / {total}
        </div>
        <button
          className={`px-4 py-2 rounded bg-gray-300 ${page >= total ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
          onClick={onNext}
          disabled={page >= total}
        >
          Next
        </button>
      </div>
    );
  }
}

export default Pagination;
