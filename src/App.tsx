import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import SharePage from './pages/SharePage';
import RecentPage from './pages/RecentPage';
import LinkDetailPage from './pages/LinkDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import UserSpacePage from './pages/UserSpacePage';
import { AuthProvider } from './contexts/AuthContext';

// V2 Components
import AppLayoutV2 from './layouts/AppLayoutV2';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* V2 Routes - New Private Link Management Interface */}
          <Route path="/app" element={<AppLayoutV2 />}>
            <Route index element={<DashboardPage />} />
            <Route path="settings" element={<div className="p-8">Settings Page (Coming Soon)</div>} />
          </Route>

          {/* V1 Routes - Legacy Social Platform (Keep for now) */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/t/:topicId" element={<TopicPage />} />
            <Route path="/links/:id" element={<LinkDetailPage />} />
            <Route path="/share" element={<SharePage />} />
            <Route path="/recent" element={<RecentPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/space/:userId" element={<UserSpacePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/404" element={<div className="p-8 text-center text-3xl font-bold py-20">404 - Not Found</div>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
