import { useFilter } from '../contexts/FilterContext';
import { useSpace } from '../contexts/SpaceContext';
import LinkListV2 from '../components/LinkListV2';
import { Filter, X } from 'lucide-react';

const DashboardPage = () => {
  const { currentSpace } = useSpace();
  const { filters, clearFilters, appliedFiltersCount, hasActiveFilters, clearFilter } = useFilter();

  const getFilterLabel = (key: keyof typeof filters, value: any): string => {
    switch (key) {
      case 'readStatus':
        return `Status: ${value}`;
      case 'folderId':
        return 'Filtered by folder';
      case 'tags':
        return `${value.length} tag${value.length > 1 ? 's' : ''}`;
      case 'domain':
        return `Domain: ${value}`;
      case 'search':
        return `Search: "${value}"`;
      default:
        return `${key}: ${value}`;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentSpace?.name || 'All Links'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and organize your saved links
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              // Skip default/empty filters
              if (['limit', 'offset', 'sortBy', 'sortOrder'].includes(key)) return null;
              if (!value || (Array.isArray(value) && value.length === 0)) return null;

              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {getFilterLabel(key as keyof typeof filters, value)}
                  <button
                    onClick={() => clearFilter(key as keyof typeof filters)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Links List */}
      <div className="flex-1 overflow-y-auto bg-white">
        <LinkListV2 />
      </div>
    </div>
  );
};

export default DashboardPage;
