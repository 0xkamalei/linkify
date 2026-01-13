import { useState, useEffect } from 'react';
import { Inbox, Star, CheckCircle, Clock, Calendar, Folder, Tag, Plus } from 'lucide-react';
import { useSpace } from '../contexts/SpaceContext';
import { useFilter } from '../contexts/FilterContext';
import { useAuth } from '../contexts/AuthContext';
import type { Folder as FolderType, Tag as TagType, SmartCollection } from '../types/v2';

const Sidebar = () => {
  const { user } = useAuth();
  const { currentSpace } = useSpace();
  const { setFilter, clearFilters, filters } = useFilter();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [collections, setCollections] = useState<SmartCollection[]>([]);

  // System collections icons
  const collectionIcons: Record<string, any> = {
    'Unread': Inbox,
    'Read Later': Star,
    'Read': CheckCircle,
    'Recent (7 days)': Clock,
    'This Week': Calendar,
    'This Month': Calendar,
  };

  // Fetch folders when space changes
  useEffect(() => {
    if (!currentSpace || !user) return;

    const fetchFolders = async () => {
      const token = await user.getIdToken();
      const response = await fetch(`/api/v2/folders?spaceId=${currentSpace.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      }
    };

    fetchFolders();
  }, [currentSpace, user]);

  // Fetch tags
  useEffect(() => {
    if (!user) return;

    const fetchTags = async () => {
      const token = await user.getIdToken();
      const response = await fetch('/api/v2/tags', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTags(data.slice(0, 10)); // Show top 10 tags
      }
    };

    fetchTags();
  }, [user]);

  // Fetch smart collections
  useEffect(() => {
    if (!user) return;

    const fetchCollections = async () => {
      const token = await user.getIdToken();
      const response = await fetch('/api/v2/collections', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    };

    fetchCollections();
  }, [user]);

  const handleCollectionClick = (collection: SmartCollection) => {
    clearFilters();

    // Apply collection filters based on first rule (simplified)
    if (collection.rules.length > 0) {
      const rule = collection.rules[0];

      if (rule.field === 'readStatus') {
        setFilter('readStatus', rule.value);
      } else if (rule.field === 'createdAt' && rule.operator === 'gte') {
        // For date-based collections
        const now = new Date();
        if (rule.value === 'now-7d') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          setFilter('startDate', sevenDaysAgo);
        }
      }
    }
  };

  const handleFolderClick = (folderId: string) => {
    clearFilters();
    setFilter('folderId', folderId);
  };

  const handleTagClick = (tagId: string) => {
    setFilter('tags', [tagId]);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Smart Collections */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Smart Collections
        </h3>
        <div className="space-y-1">
          {collections.map(collection => {
            const Icon = collectionIcons[collection.name] || Folder;
            return (
              <button
                key={collection.id}
                onClick={() => handleCollectionClick(collection)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{collection.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Folders */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Folders
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Plus className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        <div className="space-y-1">
          {folders.length === 0 ? (
            <p className="text-sm text-gray-400 px-3 py-2">No folders yet</p>
          ) : (
            folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => handleFolderClick(folder.id!)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                  filters.folderId === folder.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Folder className="w-4 h-4 flex-shrink-0" style={{ color: folder.color || undefined }} />
                <span className="flex-1 truncate">{folder.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tags
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Plus className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        <div className="space-y-1">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-400 px-3 py-2">No tags yet</p>
          ) : (
            tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag.id!)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <Tag className="w-4 h-4 flex-shrink-0" style={{ color: tag.color || undefined }} />
                <span className="flex-1 truncate">{tag.name}</span>
                <span className="text-xs text-gray-400">{tag.usageCount}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
