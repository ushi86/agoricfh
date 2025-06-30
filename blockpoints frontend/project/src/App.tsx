import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import all components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Import UserProvider
import { UserProvider } from './contexts/UserContext';

// Page Components
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ShoppingPage from './pages/ShoppingPage';
import MarketplacePage from './pages/MarketplacePage';
import CollateralPage from './pages/CollateralPage';
import BridgePage from './pages/BridgePage';
import AnalyticsPage from './pages/AnalyticsPage';
import WalletPage from './pages/WalletPage';
import OnboardingPage from './pages/OnboardingPage';
import GamificationPage from './pages/GamificationPage';
import SocialPage from './pages/SocialPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 font-sans">Loading Blockpoints...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen w-full bg-dark-900 text-white">
          {/* Animated Background */}
          <div className="fixed inset-0 mesh-bg opacity-20"></div>
          
          {/* Floating Particles */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => {
              const startY = Math.random() * window.innerHeight;
              const endY = -100;
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: startY,
                  }}
                  animate={{
                    y: [startY, endY],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              );
            })}
          </div>

          <Navigation />
          
          <main className="w-full max-w-screen-xl mx-auto flex-1 px-2 sm:px-4 md:px-8 pt-20 pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/shopping" element={<ShoppingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/collateral" element={<CollateralPage />} />
              <Route path="/bridge" element={<BridgePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/gamification" element={<GamificationPage />} />
              <Route path="/social" element={<SocialPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;