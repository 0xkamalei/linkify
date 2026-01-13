import { useState } from 'react';
import { Menu, Plus, Search, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSpace } from '../contexts/SpaceContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { currentSpace, spaces, setCurrentSpace } = useSpace();
  const navigate = useNavigate();
  const [showSpaceDropdown, setShowSpaceDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
      {/* Menu Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">L</span>
        </div>
        <span className="font-semibold text-lg text-gray-900">Linkify</span>
      </div>

      {/* Space Selector */}
      <div className="relative">
        <button
          onClick={() => setShowSpaceDropdown(!showSpaceDropdown)}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>{currentSpace?.icon || '📁'}</span>
          <span>{currentSpace?.name || 'Select Space'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Space Dropdown */}
        {showSpaceDropdown && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {spaces.map(space => (
              <button
                key={space.id}
                onClick={() => {
                  setCurrentSpace(space);
                  setShowSpaceDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                  currentSpace?.id === space.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span>{space.icon || '📁'}</span>
                <span>{space.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search links... (Cmd+K)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Add Link Button */}
      <button
        onClick={() => setShowAddLinkModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Link</span>
      </button>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <User className="w-4 h-4 text-gray-600" />
        </button>

        {/* User Dropdown */}
        {showUserMenu && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                navigate('/settings');
                setShowUserMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* TODO: Add Link Modal will be added later */}
    </header>
  );
};

export default Header;
