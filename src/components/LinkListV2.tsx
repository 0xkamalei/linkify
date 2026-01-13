import { useLinks } from '../hooks/useLinks';
import LinkItem from './LinkItem';
import { Loader2 } from 'lucide-react';

const LinkListV2 = () => {
  const { links, loading, error, hasMore, loadMore } = useLinks();

  if (loading && links.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
          <p className="text-gray-500 text-sm">
            Start saving links by clicking the "Add Link" button in the header.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {links.map(link => (
        <LinkItem key={link.id} link={link} />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="p-4 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkListV2;
