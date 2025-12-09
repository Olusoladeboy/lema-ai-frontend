import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useUsersCount } from '../hooks/useUsers';
import LoadingSpinner from '../components/LoadingSpinner';

const UsersTable = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 4;

  const { data: users, isLoading, isError, error } = useUsers(pageNumber, pageSize);
  const { data: totalCount } = useUsersCount();

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;
  const currentPage = pageNumber + 1;

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}/posts`);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Show up to 7 page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning: show 1, 2, 3, 4, ..., last-1, last
        // This ensures page 4 is visible when on page 3 (traditional pagination behavior)
        pages.push(2, 3, 4);
        pages.push('...');
        pages.push(totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end: show 1, 2, ..., last-3, last-2, last-1, last
        // This ensures the previous page is visible (e.g., page 22 when on page 23)
        pages.push(2);
        pages.push('...');
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push('...');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-600">
          Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-48 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-semibold text-gray-900 mb-8">Users</h1>
        
        <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[262px] ${isLoading ? 'flex items-center justify-center' : ''}`}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#62748E]">
                      Full name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#62748E]">
                      Email address
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#62748E]" style={{ width: '392px' }}>
                      Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="truncate" title={user.name}>
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="truncate" title={user.email}>
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600" style={{ width: '392px', maxWidth: '392px' }}>
                          <div className="truncate" title={user.address || ''}>
                            {user.address || 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <button
                onClick={() => setPageNumber((prev) => Math.max(0, prev - 1))}
                disabled={pageNumber === 0}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-700"
              >
                &lt; Prev
              </button>
              
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {getPageNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-xs sm:text-sm text-gray-500">
                        ...
                      </span>
                    );
                  }
                  
                  const pageNum = page as number;
                  const isActive = pageNum === currentPage;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPageNumber(pageNum - 1)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setPageNumber((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={pageNumber >= totalPages - 1}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-700"
              >
                Next &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTable;

