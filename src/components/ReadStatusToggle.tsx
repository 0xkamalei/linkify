import { useState } from 'react';
import { Inbox, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { ReadStatus } from '../types/v2';

interface ReadStatusToggleProps {
  linkId: string;
  currentStatus: ReadStatus;
}

const ReadStatusToggle = ({ linkId, currentStatus }: ReadStatusToggleProps) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<ReadStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus: ReadStatus) => {
    if (!user || updating) return;

    setUpdating(true);
    try {
      const token = await user.getIdToken();

      const response = await fetch(`/api/v2/links/${linkId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ readStatus: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const cycleStatus = () => {
    const statusCycle: ReadStatus[] = ['unread', 'read_later', 'read'];
    const currentIndex = statusCycle.indexOf(status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    updateStatus(nextStatus);
  };

  const getIcon = () => {
    switch (status) {
      case 'unread':
        return <Inbox className="w-4 h-4" />;
      case 'read_later':
        return <Star className="w-4 h-4" />;
      case 'read':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (status) {
      case 'unread':
        return 'text-blue-600 hover:bg-blue-50';
      case 'read_later':
        return 'text-yellow-600 hover:bg-yellow-50';
      case 'read':
        return 'text-green-600 hover:bg-green-50';
    }
  };

  return (
    <button
      onClick={cycleStatus}
      disabled={updating}
      className={`p-1.5 rounded transition-colors ${getColor()} ${
        updating ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={`Mark as ${status === 'unread' ? 'read later' : status === 'read_later' ? 'read' : 'unread'}`}
    >
      {getIcon()}
    </button>
  );
};

export default ReadStatusToggle;
