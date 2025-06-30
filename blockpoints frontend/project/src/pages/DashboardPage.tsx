import React from 'react';
import Dashboard from '../components/Dashboard';
import { useUser } from '../contexts/UserContext';

const DashboardPage = () => {
  const { isConnected, connectWallet } = useUser();
  if (!isConnected) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-24 flex flex-col items-center justify-center text-center">
        <h2 className="font-sans text-3xl font-bold mb-6">Connect Your Wallet</h2>
        <p className="text-white/70 mb-8 text-lg">To access your dashboard and rewards, please connect your wallet.</p>
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 px-10 py-5 rounded-full font-sans font-semibold text-white text-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
        >
          Connect Wallet
        </button>
      </div>
    );
  }
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;