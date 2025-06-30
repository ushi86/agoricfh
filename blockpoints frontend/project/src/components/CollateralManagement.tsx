import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Shield, Star, Zap, Crown, Gift } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { getUserCollateral } from '../utils/api';

const CollateralManagement = () => {
  const { walletAddress, isConnected } = useUser();
  const [collateral, setCollateral] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollateral = async () => {
      if (!walletAddress || !isConnected) return;
      setIsLoading(true);
      setError('');
      try {
        const response = await getUserCollateral(walletAddress);
        if (response.success && response.data && response.data.collateral) {
          setCollateral(response.data.collateral);
        } else {
          setError('Failed to load collateral');
        }
      } catch (err) {
        setError('Failed to load collateral');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollateral();
  }, [walletAddress, isConnected]);

  if (!isConnected) {
    return (
      <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
        <div className="text-center">
          <p className="text-white/60">Connect your wallet to view collateral status.</p>
        </div>
      </section>
    );
  }
  if (isLoading) {
    return (
      <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading collateral status...</p>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-6"
          >
            <Lock className="w-4 h-4 text-gold-400" />
            <span className="font-display text-sm font-medium text-white/90">
              Collateral Management
            </span>
          </motion.div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Unlock <span className="gradient-text">Premium Features</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Stake tokens to access exclusive features and enhanced rewards in the BLOCKPOINTS ecosystem.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Collateral Status</h3>
            </div>
            <div className="space-y-6">
              {collateral.length === 0 ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center my-12">
                  <Lock className="w-16 h-16 text-gold-400 mb-6" />
                  <h4 className="font-sans text-2xl font-bold mb-2">No Collateral Locked</h4>
                  <p className="text-white/70 mb-4">Stake tokens to unlock premium features and rewards.</p>
                </div>
              ) : (
                collateral.map((coll, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-xl mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/70 font-display">Locked Amount</span>
                      <Lock className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold gradient-text">{coll.amount}</p>
                    <p className="text-white/60 mt-2">Collateral ID: {coll.collateralId}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CollateralManagement;