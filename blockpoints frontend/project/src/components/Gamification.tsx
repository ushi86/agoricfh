import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Award, Crown, Zap, Gift, Users, TrendingUp, Medal } from 'lucide-react';

const Gamification = () => {
  const achievements = [
    { icon: Trophy, title: 'First Purchase', description: 'Complete your first NFT-earning purchase', progress: 100, unlocked: true },
    { icon: Star, title: 'Tier Climber', description: 'Reach Silver tier status', progress: 75, unlocked: false },
    { icon: Crown, title: 'Premium Member', description: 'Unlock premium features', progress: 60, unlocked: false },
    { icon: Zap, title: 'Speed Shopper', description: 'Complete 5 purchases in one day', progress: 40, unlocked: false },
    { icon: Gift, title: 'Collection Master', description: 'Own 10 different NFT types', progress: 80, unlocked: false },
    { icon: Medal, title: 'Cross-Chain Expert', description: 'Transfer NFTs across 3 different chains', progress: 30, unlocked: false }
  ];

  const leaderboard = [
    { rank: 1, name: 'CryptoKing', tier: 'Diamond', nfts: 'Elite Collection', streak: 'Active' },
    { rank: 2, name: 'NFTQueen', tier: 'Platinum', nfts: 'Premium Set', streak: 'Current' },
    { rank: 3, name: 'BlockMaster', tier: 'Gold', nfts: 'Growing Portfolio', streak: 'Strong' },
    { rank: 4, name: 'ChainExplorer', tier: 'Silver', nfts: 'Diverse Mix', streak: 'Building' },
    { rank: 5, name: 'TokenTrader', tier: 'Bronze', nfts: 'Starting Collection', streak: 'New' }
  ];

  const challenges = [
    { title: 'Weekly Shopping Spree', description: 'Make 3 purchases this week', reward: 'Bonus NFT Drop', timeLeft: 'Active Challenge', difficulty: 'Easy' },
    { title: 'Cross-Chain Master', description: 'Transfer NFTs to 2 different blockchains', reward: 'Exclusive Badge', timeLeft: 'Current Goal', difficulty: 'Medium' },
    { title: 'Community Builder', description: 'Refer 5 friends to the platform', reward: 'Premium Tier Boost', timeLeft: 'Ongoing', difficulty: 'Hard' }
  ];

  const streakData = {
    current: 'Active Streak',
    best: 'Personal Best',
    multiplier: 'Enhanced Rewards',
    nextReward: 'Upcoming Bonus'
  };

  return (
    <section id="gamification" className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
      <div>
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
            <Trophy className="w-4 h-4 text-gold-400" />
            <span className="font-sans text-sm font-medium text-white/90">
              Gamification System
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Achievement <span className="gradient-text">System</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-body">
            Unlock achievements, climb leaderboards, and earn exclusive rewards through our comprehensive gamification system.
          </p>
        </motion.div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Your <span className="gradient-text">Achievements</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`glass-card p-6 group relative overflow-hidden ${
                  achievement.unlocked ? 'ring-2 ring-gold-400' : ''
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                )}

                <div className={`w-16 h-16 bg-gradient-to-r ${
                  achievement.unlocked 
                    ? 'from-gold-400 to-gold-600' 
                    : 'from-gray-500 to-gray-600'
                } rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>

                <h4 className="font-sans text-lg font-semibold mb-2 text-white text-center">
                  {achievement.title}
                </h4>
                <p className="text-white/60 text-sm text-center mb-4 font-body">
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70 font-body">Progress</span>
                    <span className="text-white font-mono">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-gold-400 to-gold-600' 
                          : 'bg-gradient-to-r from-purple-500 to-cyan-500'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard and Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Leaderboard</h3>
            </div>

            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-4 rounded-xl flex items-center space-x-4 ${
                    index === 0 ? 'ring-2 ring-gold-400' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-white ${
                    index === 0 ? 'bg-gradient-to-r from-gold-400 to-gold-600' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                    'bg-gradient-to-r from-purple-500 to-cyan-500'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-sans font-semibold text-white">{user.name}</h4>
                    <p className="text-white/60 text-sm font-body">{user.tier} • {user.nfts}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 font-mono text-sm">{user.streak}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-xl font-sans font-semibold text-white"
            >
              View Full Leaderboard
            </motion.button>
          </motion.div>

          {/* Active Challenges */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Active Challenges</h3>
            </div>

            <div className="space-y-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-sans font-semibold text-white">{challenge.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                      challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-4 font-body">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gold-400 font-mono text-sm">{challenge.reward}</p>
                      <p className="text-white/60 text-xs font-body">{challenge.timeLeft}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-lg font-sans font-semibold text-white text-sm"
                    >
                      Join Challenge
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h3 className="font-display text-3xl font-bold mb-4 gradient-text">
                Shopping Streak
              </h3>
              <p className="text-white/80 font-body">
                Maintain your shopping streak to unlock bonus rewards and multipliers
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-sans font-semibold text-white mb-2">Current Streak</h4>
                <p className="text-2xl font-bold gradient-text font-display">{streakData.current}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-sans font-semibold text-white mb-2">Best Streak</h4>
                <p className="text-2xl font-bold gradient-text font-display">{streakData.best}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-sans font-semibold text-white mb-2">Multiplier</h4>
                <p className="text-2xl font-bold gradient-text font-display">{streakData.multiplier}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-sans font-semibold text-white mb-2">Next Reward</h4>
                <p className="text-2xl font-bold gradient-text font-display">{streakData.nextReward}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gamification;