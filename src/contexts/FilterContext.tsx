import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { LinkFilters, ReadStatus } from '../types/v2';

interface FilterContextType {
  filters: LinkFilters;
  setFilter: (key: keyof LinkFilters, value: any) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof LinkFilters) => void;
  appliedFiltersCount: number;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: LinkFilters = {
  limit: 50,
  offset: 0,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<LinkFilters>(defaultFilters);

  // Set a single filter
  const setFilter = useCallback((key: keyof LinkFilters, value: any) => {
    setFilters(prev => {
      // If value is null/undefined/empty, remove the filter
      if (value === null || value === undefined || value === '' ||
          (Array.isArray(value) && value.length === 0)) {
        const { [key]: _, ...rest } = prev;
        return rest as LinkFilters;
      }

      return {
        ...prev,
        [key]: value,
        // Reset offset when filters change (except when changing offset itself)
        ...(key !== 'offset' && { offset: 0 }),
      };
    });
  }, []);

  // Clear all filters (except defaults)
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Clear a specific filter
  const clearFilter = useCallback((key: keyof LinkFilters) => {
    setFilters(prev => {
      const { [key]: _, ...rest } = prev;
      return {
        ...rest,
        ...defaultFilters, // Restore defaults
      };
    });
  }, []);

  // Count applied filters (excluding defaults)
  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    const filterKeys = Object.keys(filters) as Array<keyof LinkFilters>;

    for (const key of filterKeys) {
      // Skip default fields
      if (['limit', 'offset', 'sortBy', 'sortOrder'].includes(key)) {
        continue;
      }

      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          count++;
        } else if (!Array.isArray(value)) {
          count++;
        }
      }
    }

    return count;
  }, [filters]);

  // Check if any non-default filters are active
  const hasActiveFilters = useMemo(() => {
    return appliedFiltersCount > 0;
  }, [appliedFiltersCount]);

  const value: FilterContextType = {
    filters,
    setFilter,
    clearFilters,
    clearFilter,
    appliedFiltersCount,
    hasActiveFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
