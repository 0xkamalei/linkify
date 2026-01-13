import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { SpaceProvider } from '../contexts/SpaceContext';
import { FilterProvider } from '../contexts/FilterContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AppLayoutV2 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SpaceProvider>
      <FilterProvider>
        <div className="h-screen flex flex-col bg-gray-50">
          {/* Header */}
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            {sidebarOpen && (
              <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                <Sidebar />
              </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </FilterProvider>
    </SpaceProvider>
  );
};

export default AppLayoutV2;
