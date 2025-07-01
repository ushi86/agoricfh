import React from 'react';
import SocialFeatures from '../components/SocialFeatures';
import { useUser } from '../contexts/UserContext';

const SocialPage = () => {
  const { isConnected, connectWallet } = useUser();
  if (!isConnected) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 flex flex-col items-center justify-center text-center">
        <h2 className="font-sans text-3xl font-bold mb-6">Connect Your Wallet</h2>
        <p className="text-white/70 mb-8 text-lg">Connect your wallet to access social features and community rewards.</p>
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
    <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12">
      <SocialFeatures />
    </div>
  );
};

export default SocialPage;