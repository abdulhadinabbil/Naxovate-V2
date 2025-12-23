import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AIGeneratorPage from './pages/AIGeneratorPage';
import GeneratedImagesPage from './pages/GeneratedImagesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import InstructionsPage from './pages/InstructionsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import SubscriptionCancelPage from './pages/SubscriptionCancelPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen flex flex-col transition-all duration-300 ${
          isDarkMode 
            ? 'dark bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
            : 'bg-gradient-to-br from-white via-blue-50 to-slate-100'
        }`}>
          <Header 
            toggleSidebar={toggleSidebar} 
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
          <div className="flex-1 flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 transition-all duration-200 ease-in-out">
              <div className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/instructions" element={<InstructionsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/ai-generator" element={<AIGeneratorPage />} />
                  <Route path="/generated-images" element={<GeneratedImagesPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/settings" element={<SettingsPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
                  <Route path="/subscription/cancel" element={<SubscriptionCancelPage />} />
                </Routes>
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App