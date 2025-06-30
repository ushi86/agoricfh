import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, User, LogOut, Settings, Bell, Crown, Shield } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { 
  FaEthereum, 
  FaBitcoin, 
  FaGem,
  FaCircle
} from 'react-icons/fa';
import { 
  BsHexagon
} from 'react-icons/bs';
import { 
  SiBinance 
} from 'react-icons/si';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isConnected, walletAddress, userProfile, connectWallet, disconnectWallet } = useUser();

  // Admin wallet addresses (in production, this would be stored securely)
  const ADMIN_ADDRESSES = [
    'agoric_admin_primary',
    'agoric_admin_secondary',
    'agoric_owner'
  ];

  const isAdmin = isConnected && walletAddress && ADMIN_ADDRESSES.includes(walletAddress);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navigationItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Shopping', href: '/shopping', icon: '🛍️' },
    { name: 'Marketplace', href: '/marketplace', icon: '🏪' },
    { name: 'Collateral', href: '/collateral', icon: '🔒' },
    { name: 'Bridge', href: '/bridge', icon: '🌉' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Gamification', href: '/gamification', icon: '🎮' },
    { name: 'Social', href: '/social', icon: '👥' },
  ];

  // Returns true if the current route matches the given href
  const isActive = (href: string): boolean => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return Boolean(location.pathname.startsWith(href));
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-sans text-xl font-bold gradient-text">
                Blockpoints
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                className="relative"
              >
                <Link
                  to={item.href}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-2xl font-sans font-semibold text-base transition-all duration-200 shadow-sm ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                )}
              </motion.div>
            ))}
            
            {/* Admin Link */}
            {isAdmin && (
              <motion.div
                whileHover={{ y: -2 }}
                className="relative"
              >
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-sans font-medium transition-all duration-200 ${
                    isActive('/admin')
                      ? 'text-white bg-red-500/20 border border-red-500/30'
                      : 'text-red-400 hover:text-white hover:bg-red-500/20'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                {isActive('/admin') && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"
                  />
                )}
              </motion.div>
            )}
          </div>

          {/* Wallet Connection & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Wallet Status */}
            {isConnected ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center space-x-3"
              >
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm font-mono">
                    {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
                  </span>
                </div>
                
                {/* User Profile Badge */}
                {userProfile && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-xl">
                    <Crown className="w-4 h-4 text-gold-400" />
                    <span className="text-white text-sm font-semibold">
                      {userProfile.tier}
                    </span>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl font-sans font-semibold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200 ml-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </motion.button>
            )}

            {/* User Menu */}
            {isConnected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 p-2 glass-card rounded-xl hover:bg-white/10 transition-colors duration-200"
                >
                  <User className="w-5 h-5 text-white" />
                  <span className="text-white font-sans font-medium">Menu</span>
                  {isOpen ? (
                    <X className="w-4 h-4 text-white" />
                  ) : (
                    <Menu className="w-4 h-4 text-white" />
                  )}
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 glass-card rounded-xl border border-white/10 shadow-xl"
                    >
                      <div className="p-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-sans font-semibold">
                              {userProfile?.tier || 'BRONZE'} User
                            </p>
                            <p className="text-white/60 text-sm font-mono">
                              {walletAddress?.slice(0, 12)}...
                            </p>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-2">
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
                          >
                            <User className="w-4 h-4 text-white" />
                            <span className="text-white font-sans">Dashboard</span>
                          </Link>
                          
                          <Link
                            to="/wallet"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
                          >
                            <Wallet className="w-4 h-4 text-white" />
                            <span className="text-white font-sans">Wallet</span>
                          </Link>
                          
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 transition-colors duration-200"
                            >
                              <Shield className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 font-sans">Admin Panel</span>
                            </Link>
                          )}
                          
                          <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 w-full">
                            <Settings className="w-4 h-4 text-white" />
                            <span className="text-white font-sans">Settings</span>
                          </button>
                          
                          <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 w-full">
                            <Bell className="w-4 h-4 text-white" />
                            <span className="text-white font-sans">Notifications</span>
                          </button>
                          
                          <div className="border-t border-white/10 my-2"></div>
                          
                          <button
                            onClick={disconnectWallet}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 transition-colors duration-200 w-full text-red-400"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="font-sans">Disconnect</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center p-2 glass-card rounded-xl hover:bg-white/10 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10"
            >
              <div className="py-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-white bg-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {/* Mobile Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans font-medium transition-all duration-200 ${
                      isActive('/admin')
                        ? 'text-white bg-red-500/20 border border-red-500/30'
                        : 'text-red-400 hover:text-white hover:bg-red-500/20'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                {/* Mobile Wallet Connection */}
                {!isConnected ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={connectWallet}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl font-sans font-semibold text-white mt-4"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </motion.button>
                ) : (
                  <div className="mt-4 p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm font-mono">
                        Connected: {walletAddress?.slice(0, 12)}...
                      </span>
                    </div>
                    {userProfile && (
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-gold-400" />
                        <span className="text-white text-sm font-semibold">
                          {userProfile.tier} Tier
                        </span>
                      </div>
                    )}
                    <button
                      onClick={disconnectWallet}
                      className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;