import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Coins, Star, TrendingUp, Award, Crown, Zap, Loader2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { getUserNFTs, getUserRewards, getUserCollateral, getUserAnalytics, NFT, Reward, Collateral } from '../utils/api';

const Dashboard = () => {
  const { userProfile, walletAddress, isConnected, isLoadingProfile } = useUser();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [collateral, setCollateral] = useState<Collateral[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load user data when wallet connects
  useEffect(() => {
    if (walletAddress && isConnected) {
      loadUserData();
    }
  }, [walletAddress, isConnected]);

  const loadUserData = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Load NFTs
      const nftsResponse = await getUserNFTs(walletAddress);
      if (nftsResponse.success && nftsResponse.data) {
        setNfts(nftsResponse.data.nfts || []);
      }

      // Load rewards
      const rewardsResponse = await getUserRewards(walletAddress);
      if (rewardsResponse.success && rewardsResponse.data) {
        setRewards(rewardsResponse.data.rewards || []);
      }

      // Load collateral
      const collateralResponse = await getUserCollateral(walletAddress);
      if (collateralResponse.success && collateralResponse.data) {
        setCollateral(collateralResponse.data.collateral || []);
      }

      // Load analytics
      const analyticsResponse = await getUserAnalytics(walletAddress);
      if (analyticsResponse.success && analyticsResponse.data) {
        setAnalytics(analyticsResponse.data);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate user stats from real data
  const userStats = [
    { 
      icon: Trophy, 
      label: 'Tier Level', 
      value: userProfile?.tier || 'BRONZE', 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: Coins, 
      label: 'Total Points', 
      value: userProfile?.totalRewards?.toString() || '0', 
      color: 'from-gold-400 to-gold-600' 
    },
    { 
      icon: Star, 
      label: 'NFTs Owned', 
      value: nfts.length.toString(), 
      color: 'from-cyan-500 to-blue-500' 
    },
    { 
      icon: TrendingUp, 
      label: 'Rewards Earned', 
      value: rewards.length.toString(), 
      color: 'from-green-500 to-teal-500' 
    },
  ];

  // Generate recent activity from real data
  const recentActivity = [
    ...nfts.slice(0, 2).map(nft => ({
      action: 'NFT Minted',
      item: nft.metadata.name,
      time: new Date(nft.metadata.mintDate).toLocaleDateString()
    })),
    ...rewards.slice(0, 1).map(reward => ({
      action: 'Reward Earned',
      item: `${reward.amount} points for ${reward.reason}`,
      time: new Date(reward.awardDate).toLocaleDateString()
    })),
    ...collateral.slice(0, 1).map(coll => ({
      action: 'Collateral Locked',
      item: `${coll.amount} tokens locked`,
      time: new Date(coll.lockDate).toLocaleDateString()
    }))
  ].slice(0, 4);

  // Show loading state
  if (isLoadingProfile || isLoading) {
    return (
      <section id="dashboard" className="py-8 md:py-12 relative">
        <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
            <p className="text-white/60">Loading your dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="dashboard" className="py-8 md:py-12 relative">
        <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="text-center">
            <div className="glass-card p-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={loadUserData}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 rounded-xl font-semibold text-white"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show connect wallet prompt
  if (!isConnected) {
    return (
      <section id="dashboard" className="py-8 md:py-12 relative">
        <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="text-center">
            <div className="glass-card p-8">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h2 className="font-display text-3xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-white/60 mb-6">Connect your Agoric wallet to view your dashboard</p>
              <button 
                onClick={() => window.location.href = '/wallet'}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-xl font-semibold text-white"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="py-8 md:py-12 relative">
      <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8">
        {/* Section Header */}
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
            <User className="w-4 h-4 text-gold-400" />
            <span className="font-display text-sm font-medium text-white/90">
              User Dashboard
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Your <span className="gradient-text">Digital Profile</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Track your NFT collection, tier progress, and rewards in your personalized dashboard.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2 gradient-text">
                {userProfile?.tier || 'BRONZE'} User
              </h3>
              <p className="text-white/70 mb-4">
                {userProfile?.tier || 'BRONZE'} Tier Member
              </p>
              <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full" 
                  style={{width: `${Math.min((userProfile?.totalSpent || 0) / 1000 * 100, 100)}%`}}
                ></div>
              </div>
              <p className="text-sm text-white/60">
                Progress to next tier: ${userProfile?.totalSpent || 0} / $1000
              </p>
              {userProfile?.gamification && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/70">Level {userProfile.gamification.level}</p>
                  <p className="text-xs text-white/50">{userProfile.gamification.experience} XP</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-6">
              {userStats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-6 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-display text-lg font-semibold mb-2 text-white">{stat.label}</h4>
                  <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* NFT Collection Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Your <span className="gradient-text">NFT Collection</span>
          </h3>
          {nfts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {nfts.slice(0, 4).map((nft, index) => (
                <motion.div
                  key={nft.nftId}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="glass-card p-4 group"
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl mb-4 flex items-center justify-center">
                    <Award className="w-12 h-12 text-gold-400" />
                  </div>
                  <h4 className="font-display font-semibold mb-2 text-white">{nft.metadata.name}</h4>
                  <p className="text-sm text-white/60">{nft.metadata.tier} Tier</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center glass-card p-8">
              <Award className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <p className="text-white/60">No NFTs yet. Start shopping to earn your first NFT!</p>
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Recent <span className="gradient-text">Activity</span>
          </h3>
          <div className="glass-card p-8">
            {recentActivity.length > 0 ? (
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white">{activity.action}</h4>
                        <p className="text-white/60">{activity.item}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gold-400 font-mono">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <Zap className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <p className="text-white/60">No recent activity. Start using the platform to see your activity here!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Dashboard;