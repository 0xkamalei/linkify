import { useState, useEffect, useCallback } from 'react';
import type { Link, LinkFilters } from '../types/v2';
import { useAuth } from '../contexts/AuthContext';
import { useFilter } from '../contexts/FilterContext';

export const useLinks = () => {
  const { user } = useAuth();
  const { filters } = useFilter();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Build query string from filters
  const buildQueryString = useCallback((filters: LinkFilters): string => {
    const params = new URLSearchParams();

    if (filters.spaceId) params.append('spaceId', filters.spaceId);
    if (filters.folderId) params.append('folderId', filters.folderId);
    if (filters.readStatus) {
      if (Array.isArray(filters.readStatus)) {
        params.append('readStatus', filters.readStatus.join(','));
      } else {
        params.append('readStatus', filters.readStatus);
      }
    }
    if (filters.domain) params.append('domain', filters.domain);
    if (filters.search) params.append('search', filters.search);

    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
      if (filters.tagLogic) params.append('tagLogic', filters.tagLogic);
    }

    if (filters.startDate) {
      params.append('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate.toISOString());
    }

    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    return params.toString();
  }, []);

  // Fetch links
  const fetchLinks = useCallback(async (replaceLinks: boolean = true) => {
    if (!user) {
      setLinks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken();
      const queryString = buildQueryString(filters);

      const response = await fetch(`/api/v2/links?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }

      const data: Link[] = await response.json();

      if (replaceLinks) {
        setLinks(data);
      } else {
        // Append for pagination
        setLinks(prev => [...prev, ...data]);
      }

      // Check if there are more links
      const limit = filters.limit || 50;
      setHasMore(data.length === limit);
    } catch (err: any) {
      console.error('Error fetching links:', err);
      setError(err.message || 'Failed to fetch links');
    } finally {
      setLoading(false);
    }
  }, [user, filters, buildQueryString]);

  // Refresh (replace all links)
  const refresh = useCallback(async () => {
    await fetchLinks(true);
  }, [fetchLinks]);

  // Load more (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    await fetchLinks(false);
  }, [hasMore, loading, fetchLinks]);

  // Fetch links when filters change
  useEffect(() => {
    fetchLinks(true);
  }, [fetchLinks]);

  return {
    links,
    loading,
    error,
    hasMore,
    refresh,
    loadMore,
  };
};
