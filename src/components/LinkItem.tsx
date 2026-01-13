import { useState } from 'react';
import { ExternalLink, Folder, MoreVertical } from 'lucide-react';
import type { Link } from '../types/v2';
import ReadStatusToggle from './ReadStatusToggle';

interface LinkItemProps {
  link: Link;
}

const LinkItem = ({ link }: LinkItemProps) => {
  const [showMenu, setShowMenu] = useState(false);

  // Format date
  const formatDate = (date: any): string => {
    if (!date) return '';

    let d: Date;
    if (date.toDate) {
      d = date.toDate();
    } else if (date.seconds) {
      d = new Date(date.seconds * 1000);
    } else {
      d = new Date(date);
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return d.toLocaleDateString();
    }
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-700';
      case 'read_later':
        return 'bg-yellow-100 text-yellow-700';
      case 'read':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'unread':
        return 'Unread';
      case 'read_later':
        return 'Read Later';
      case 'read':
        return 'Read';
      default:
        return status;
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors group">
      <div className="flex items-start gap-4">
        {/* Favicon */}
        <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center mt-1">
          {link.favicon ? (
            <img
              src={link.favicon}
              alt=""
              className="w-5 h-5"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-sm">🔗</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group/link"
          >
            <span className="truncate">{link.title}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
          </a>

          {/* Description */}
          {link.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {link.description}
            </p>
          )}

          {/* Metadata Row */}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-medium">{link.domain}</span>
            </span>
            <span>•</span>
            <span>{formatDate(link.createdAt)}</span>
            <span>•</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(link.readStatus)}`}>
              {getStatusLabel(link.readStatus)}
            </span>
            {link.folderId && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Folder className="w-3 h-3" />
                  <span>Folder</span>
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          {link.tags && link.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {link.tags.slice(0, 5).map((tagId, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tagId.substring(0, 8)}
                </span>
              ))}
              {link.tags.length > 5 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{link.tags.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ReadStatusToggle linkId={link.id!} currentStatus={link.readStatus} />

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkItem;
