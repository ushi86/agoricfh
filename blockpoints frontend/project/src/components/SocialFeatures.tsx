import React from 'react';
import { motion } from 'framer-motion';
import { Users, Share2, Heart, MessageCircle, UserPlus, Trophy, Star, Crown, Gift } from 'lucide-react';

const SocialFeatures = () => {
  const socialActivities = [
    {
      user: 'CryptoCollector',
      action: 'shared their NFT collection',
      item: 'Premium Badge Set',
      time: 'Recently',
      likes: 'Popular',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
    },
    {
      user: 'NFTExplorer',
      action: 'completed a challenge',
      item: 'Cross-Chain Master',
      time: 'Active',
      likes: 'Trending',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
    },
    {
      user: 'BlockchainPro',
      action: 'reached Diamond tier',
      item: 'Elite Status Achieved',
      time: 'Latest',
      likes: 'Celebrated',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
    }
  ];

  const communityFeatures = [
    { icon: Share2, title: 'Share Collections', description: 'Showcase your NFT achievements to the community' },
    { icon: Users, title: 'Follow Friends', description: 'Connect with other collectors and track their progress' },
    { icon: Trophy, title: 'Community Challenges', description: 'Participate in group challenges for exclusive rewards' },
    { icon: Gift, title: 'Referral Rewards', description: 'Earn bonus NFTs by inviting friends to join' }
  ];

  const followSuggestions = [
    { name: 'EliteTrader', tier: 'Diamond', specialty: 'Cross-Chain Expert', mutual: 'Active Community' },
    { name: 'NFTMaven', tier: 'Platinum', specialty: 'Premium Collector', mutual: 'Trending Member' },
    { name: 'CryptoSage', tier: 'Gold', specialty: 'Achievement Hunter', mutual: 'Rising Star' }
  ];

  return (
    <section id="social" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Users className="w-4 h-4 text-gold-400" />
            <span className="font-sans text-sm font-medium text-white/90">
              Social Features
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Community <span className="gradient-text">Connection</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-body">
            Connect with fellow collectors, share your achievements, and participate in community challenges.
          </p>
        </motion.div>

        {/* Social Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Community <span className="gradient-text">Activity</span>
          </h3>
          <div className="max-w-4xl mx-auto space-y-6">
            {socialActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={activity.avatar} 
                      alt={activity.user}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-sans font-semibold text-white">{activity.user}</h4>
                      <span className="text-white/60 font-body">{activity.action}</span>
                    </div>
                    <p className="text-purple-400 font-mono mb-3">{activity.item}</p>
                    <div className="flex items-center space-x-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 text-white/60 hover:text-red-400 transition-colors duration-200"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-body">{activity.likes}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 text-white/60 hover:text-blue-400 transition-colors duration-200"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-body">Comment</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 text-white/60 hover:text-green-400 transition-colors duration-200"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-body">Share</span>
                      </motion.button>
                      <span className="text-white/40 text-sm font-mono ml-auto">{activity.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Features and Follow Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Community Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Social Features</h3>
            </div>

            <div className="space-y-6">
              {communityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 glass-card rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-white/60 text-sm font-body">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Follow Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Suggested Follows</h3>
            </div>

            <div className="space-y-4">
              {followSuggestions.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-white">{user.name}</h4>
                      <p className="text-gold-400 text-sm font-mono">{user.tier} • {user.specialty}</p>
                      <p className="text-white/60 text-xs font-body">{user.mutual}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-lg font-sans font-semibold text-white text-sm"
                  >
                    Follow
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full mt-6 glass-card py-3 rounded-xl font-sans font-semibold text-white hover:bg-white/10 transition-colors duration-200"
            >
              Discover More Users
            </motion.button>
          </motion.div>
        </div>

        {/* Referral Program */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display text-3xl font-bold mb-4 gradient-text">
              Referral Rewards Program
            </h3>
            <p className="text-white/80 mb-8 text-lg font-body max-w-3xl mx-auto">
              Invite friends to join BLOCKPOINTS and earn exclusive NFT rewards for each successful referral. 
              Both you and your friend receive bonus rewards when they complete their first purchase.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6">
                <UserPlus className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-sans font-semibold text-white mb-2">Invite Friends</h4>
                <p className="text-white/60 text-sm font-body">Share your unique referral link</p>
              </div>
              <div className="glass-card p-6">
                <Trophy className="w-8 h-8 text-gold-400 mx-auto mb-3" />
                <h4 className="font-sans font-semibold text-white mb-2">Earn Rewards</h4>
                <p className="text-white/60 text-sm font-body">Get bonus NFTs for each referral</p>
              </div>
              <div className="glass-card p-6">
                <Star className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h4 className="font-sans font-semibold text-white mb-2">Unlock Tiers</h4>
                <p className="text-white/60 text-sm font-body">Access exclusive referral tiers</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full font-sans font-semibold text-white text-lg"
              >
                Get Referral Link
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-8 py-4 rounded-full font-sans font-semibold text-white hover:bg-white/10 transition-colors duration-200"
              >
                View Referral Stats
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialFeatures;