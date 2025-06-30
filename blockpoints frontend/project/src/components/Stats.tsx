import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, Globe, Crown, Shield, Coins, Sparkles } from 'lucide-react';
import { getPlatformAnalytics } from '../utils/api';

const Stats = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getPlatformAnalytics();
        if (response.success && response.data && response.data.analytics) {
          setStats(response.data.analytics);
        } else {
          setError('Failed to load platform stats');
        }
      } catch (err) {
        setError('Failed to load platform stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading platform stats...</p>
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
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Platform <span className="gradient-text">Excellence</span>
          </h2>
          <p className="font-elegant text-2xl text-white/80 max-w-4xl mx-auto">
            Discover the revolutionary features that make BLOCKPOINTS the premier destination for blockchain-powered shopping rewards.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div className="glass-card p-8 text-center">
            <Users className="w-10 h-10 text-white mx-auto mb-4" />
            <h3 className="font-display text-2xl font-semibold mb-2 text-white">Total Users</h3>
            <p className="font-elegant text-white/70 text-3xl">{stats.totalUsers ?? '-'}</p>
          </motion.div>
          <motion.div className="glass-card p-8 text-center">
            <Crown className="w-10 h-10 text-white mx-auto mb-4" />
            <h3 className="font-display text-2xl font-semibold mb-2 text-white">Total NFTs</h3>
            <p className="font-elegant text-white/70 text-3xl">{stats.totalNFTs ?? '-'}</p>
          </motion.div>
          <motion.div className="glass-card p-8 text-center">
            <Coins className="w-10 h-10 text-white mx-auto mb-4" />
            <h3 className="font-display text-2xl font-semibold mb-2 text-white">Total Rewards</h3>
            <p className="font-elegant text-white/70 text-3xl">{stats.totalRewards ?? '-'}</p>
          </motion.div>
          <motion.div className="glass-card p-8 text-center">
            <TrendingUp className="w-10 h-10 text-white mx-auto mb-4" />
            <h3 className="font-display text-2xl font-semibold mb-2 text-white">Total Volume</h3>
            <p className="font-elegant text-white/70 text-3xl">{stats.totalVolume ?? '-'}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Stats;