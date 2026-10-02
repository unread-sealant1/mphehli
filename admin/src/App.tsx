import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PlayerManager from './pages/PlayerManager';
import FixtureManager from './pages/FixtureManager';
import NewsManager from './pages/NewsManager';
import MediaManager from './pages/MediaManager';
import AnalyticsPage from './pages/AnalyticsPage';
import WebsiteEditor from './pages/WebsiteEditor';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <main className="flex-1 p-8">
                  <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/players" element={<PlayerManager />} />
                      <Route path="/fixtures" element={<FixtureManager />} />
                      <Route path="/news" element={<NewsManager />} />
                      <Route path="/media" element={<MediaManager />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                      <Route path="/website-editor" element={<WebsiteEditor />} />
                    </Routes>
                  </React.Suspense>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;