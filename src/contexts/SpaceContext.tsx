import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Space } from '../types/v2';
import { useAuth } from './AuthContext';

interface SpaceContextType {
  currentSpace: Space | null;
  setCurrentSpace: (space: Space | null) => void;
  spaces: Space[];
  setSpaces: (spaces: Space[]) => void;
  loading: boolean;
  refreshSpaces: () => Promise<void>;
  createSpace: (spaceData: any) => Promise<string>;
  updateSpace: (spaceId: string, updates: any) => Promise<void>;
  deleteSpace: (spaceId: string) => Promise<void>;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all spaces for the current user
  const fetchSpaces = useCallback(async () => {
    if (!user) {
      setSpaces([]);
      setCurrentSpace(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();

      const response = await fetch('/api/v2/spaces', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch spaces');
      }

      const data = await response.json();
      setSpaces(data);

      // Set default space from user settings or first space
      if (data.length > 0) {
        // TODO: Get user's default space from settings
        // For now, just use the first space
        if (!currentSpace) {
          setCurrentSpace(data[0]);
        } else {
          // Update current space if it exists in the list
          const updated = data.find((s: Space) => s.id === currentSpace.id);
          if (updated) {
            setCurrentSpace(updated);
          } else {
            setCurrentSpace(data[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  }, [user, currentSpace]);

  // Refresh spaces
  const refreshSpaces = useCallback(async () => {
    await fetchSpaces();
  }, [fetchSpaces]);

  // Create a new space
  const createSpace = useCallback(async (spaceData: any): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();

    const response = await fetch('/api/v2/spaces', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spaceData),
    });

    if (!response.ok) {
      throw new Error('Failed to create space');
    }

    const { id } = await response.json();

    // Refresh spaces list
    await refreshSpaces();

    return id;
  }, [user, refreshSpaces]);

  // Update a space
  const updateSpace = useCallback(async (spaceId: string, updates: any): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();

    const response = await fetch(`/api/v2/spaces/${spaceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update space');
    }

    // Refresh spaces list
    await refreshSpaces();
  }, [user, refreshSpaces]);

  // Delete a space
  const deleteSpace = useCallback(async (spaceId: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();

    const response = await fetch(`/api/v2/spaces/${spaceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete space');
    }

    // If deleted space was current space, switch to another
    if (currentSpace?.id === spaceId) {
      setCurrentSpace(null);
    }

    // Refresh spaces list
    await refreshSpaces();
  }, [user, currentSpace, refreshSpaces]);

  // Fetch spaces on mount and when user changes
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const value: SpaceContextType = {
    currentSpace,
    setCurrentSpace,
    spaces,
    setSpaces,
    loading,
    refreshSpaces,
    createSpace,
    updateSpace,
    deleteSpace,
  };

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>;
};

export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (context === undefined) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
};
