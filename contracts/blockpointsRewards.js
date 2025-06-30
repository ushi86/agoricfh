// BLOCKPOINTS Rewards Smart Contract
// Handles reward distribution, tier bonuses, and gamification features

import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';
import { makeZoe } from '@agoric/zoe';
import { makeContract } from '@agoric/contract-support';

const { details: X } = assert;

// Reward types and multipliers
const REWARD_TYPES = {
  SHOPPING: { baseMultiplier: 1.0, description: 'Shopping Reward' },
  TIER_BONUS: { baseMultiplier: 2.0, description: 'Tier Bonus' },
  ACHIEVEMENT: { baseMultiplier: 3.0, description: 'Achievement Reward' },
  REFERRAL: { baseMultiplier: 1.5, description: 'Referral Bonus' },
  STREAK: { baseMultiplier: 1.2, description: 'Streak Bonus' },
  SEASONAL: { baseMultiplier: 2.5, description: 'Seasonal Event' }
};

// Achievement definitions
const ACHIEVEMENTS = {
  FIRST_PURCHASE: { id: 'FIRST_PURCHASE', name: 'First Purchase', reward: 50, description: 'Complete your first purchase' },
  TIER_UPGRADE: { id: 'TIER_UPGRADE', name: 'Tier Upgrade', reward: 100, description: 'Upgrade to a higher tier' },
  NFT_COLLECTOR: { id: 'NFT_COLLECTOR', name: 'NFT Collector', reward: 200, description: 'Collect 5 NFTs' },
  BIG_SPENDER: { id: 'BIG_SPENDER', name: 'Big Spender', reward: 500, description: 'Spend $10,000' },
  STREAK_MASTER: { id: 'STREAK_MASTER', name: 'Streak Master', reward: 300, description: 'Maintain 30-day streak' },
  REFERRAL_KING: { id: 'REFERRAL_KING', name: 'Referral King', reward: 400, description: 'Refer 10 users' }
};

// Contract behavior
const makeBlockpointsRewardsContract = (zoe, privateArgs) => {
  const {
    rewardIssuerKit,
    nftIssuerKit,
    adminWallet,
    feeCollector
  } = privateArgs;

  // State management
  const state = {
    rewardCounter: 0,
    userRewards: new Map(), // userId -> Reward[]
    userAchievements: new Map(), // userId -> Achievement[]
    userStreaks: new Map(), // userId -> streak data
    userReferrals: new Map(), // userId -> referred users
    totalRewardsDistributed: AmountMath.make(rewardIssuerKit.brand, 0n),
    totalUsers: 0,
    paused: false,
    adminAddresses: [adminWallet],
    rewardMultiplier: 1.0,
    maxDailyRewards: 1000,
    dailyRewards: new Map() // userId -> daily reward count
  };

  // Helper functions
  const calculateReward = (baseAmount, rewardType, userTier, streak = 0) => {
    const typeConfig = REWARD_TYPES[rewardType];
    const tierMultiplier = getUserTierMultiplier(userTier);
    const streakMultiplier = Math.min(1 + (streak * 0.1), 2.0); // Max 2x from streak
    
    return Math.floor(
      baseAmount * 
      typeConfig.baseMultiplier * 
      tierMultiplier * 
      streakMultiplier * 
      state.rewardMultiplier
    );
  };

  const getUserTierMultiplier = (tier) => {
    const tierMultipliers = {
      'BRONZE': 1.0,
      'SILVER': 1.2,
      'GOLD': 1.5,
      'PLATINUM': 2.0,
      'DIAMOND': 3.0
    };
    return tierMultipliers[tier] || 1.0;
  };

  const canClaimDailyReward = (userId) => {
    const today = new Date().toDateString();
    const dailyCount = state.dailyRewards.get(`${userId}_${today}`) || 0;
    return dailyCount < state.maxDailyRewards;
  };

  const updateDailyRewardCount = (userId) => {
    const today = new Date().toDateString();
    const key = `${userId}_${today}`;
    const currentCount = state.dailyRewards.get(key) || 0;
    state.dailyRewards.set(key, currentCount + 1);
  };

  const updateUserStreak = (userId) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const userStreak = state.userStreaks.get(userId) || { current: 0, lastActivity: null };
    
    if (userStreak.lastActivity === yesterday) {
      userStreak.current++;
    } else if (userStreak.lastActivity !== today) {
      userStreak.current = 1;
    }
    
    userStreak.lastActivity = today;
    state.userStreaks.set(userId, userStreak);
    
    return userStreak.current;
  };

  // Main contract methods
  const awardReward = async (userId, amount, reason, rewardType = 'SHOPPING', metadata = {}) => {
    assert(!state.paused, 'Contract is paused');
    assert(userId && amount > 0, 'Valid user ID and amount required');
    assert(canClaimDailyReward(userId), 'Daily reward limit reached');

    const rewardId = `reward_${state.rewardCounter++}`;
    const userTier = metadata.userTier || 'BRONZE';
    const streak = updateUserStreak(userId);
    
    const finalAmount = calculateReward(amount, rewardType, userTier, streak);
    
    // Mint reward tokens
    const rewardAmount = AmountMath.make(rewardIssuerKit.brand, BigInt(finalAmount));
    const rewardPayment = await rewardIssuerKit.mint.mintPayment(rewardAmount);
    
    const reward = {
      rewardId,
      userId,
      amount: finalAmount,
      reason,
      rewardType,
      tier: userTier,
      streak,
      awardDate: new Date().toISOString(),
      metadata
    };

    // Update state
    if (!state.userRewards.has(userId)) {
      state.userRewards.set(userId, []);
      state.totalUsers++;
    }
    state.userRewards.get(userId).push(reward);
    
    state.totalRewardsDistributed = AmountMath.add(
      state.totalRewardsDistributed,
      rewardAmount
    );
    
    updateDailyRewardCount(userId);

    return {
      rewardId,
      reward: rewardPayment,
      amount: finalAmount,
      streak,
      tier: userTier
    };
  };

  const awardAchievement = async (userId, achievementId) => {
    assert(!state.paused, 'Contract is paused');
    assert(userId && achievementId, 'User ID and achievement ID required');

    const achievement = ACHIEVEMENTS[achievementId];
    assert(achievement, 'Invalid achievement ID');

    const userAchievements = state.userAchievements.get(userId) || [];
    const alreadyAwarded = userAchievements.some(a => a.id === achievementId);
    assert(!alreadyAwarded, 'Achievement already awarded');

    // Award achievement reward
    const reward = await awardReward(
      userId,
      achievement.reward,
      achievement.description,
      'ACHIEVEMENT',
      { achievementId }
    );

    // Record achievement
    const userAchievement = {
      id: achievementId,
      name: achievement.name,
      description: achievement.description,
      awardedDate: new Date().toISOString(),
      rewardAmount: achievement.reward
    };

    userAchievements.push(userAchievement);
    state.userAchievements.set(userId, userAchievements);

    return {
      achievement: userAchievement,
      reward
    };
  };

  const awardReferralBonus = async (referrerId, referredUserId, purchaseAmount) => {
    assert(!state.paused, 'Contract is paused');
    assert(referrerId && referredUserId, 'Both user IDs required');

    // Award referral bonus to referrer
    const referralReward = await awardReward(
      referrerId,
      purchaseAmount * 0.1, // 10% of purchase amount
      `Referral bonus for ${referredUserId}`,
      'REFERRAL',
      { referredUserId, purchaseAmount }
    );

    // Record referral
    if (!state.userReferrals.has(referrerId)) {
      state.userReferrals.set(referrerId, []);
    }
    state.userReferrals.get(referrerId).push({
      referredUserId,
      date: new Date().toISOString(),
      rewardAmount: referralReward.amount
    });

    return referralReward;
  };

  const awardTierBonus = async (userId, oldTier, newTier) => {
    assert(!state.paused, 'Contract is paused');
    assert(userId && oldTier && newTier, 'All parameters required');

    const tierBonuses = {
      'SILVER': 100,
      'GOLD': 250,
      'PLATINUM': 500,
      'DIAMOND': 1000
    };

    const bonus = tierBonuses[newTier];
    if (bonus) {
      return await awardReward(
        userId,
        bonus,
        `Tier upgrade bonus: ${oldTier} → ${newTier}`,
        'TIER_BONUS',
        { oldTier, newTier }
      );
    }

    return null;
  };

  const getUserRewards = (userId, filters = {}) => {
    const rewards = state.userRewards.get(userId) || [];
    
    // Apply filters
    let filteredRewards = rewards;
    
    if (filters.rewardType) {
      filteredRewards = filteredRewards.filter(r => r.rewardType === filters.rewardType);
    }
    
    if (filters.startDate) {
      filteredRewards = filteredRewards.filter(r => new Date(r.awardDate) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filteredRewards = filteredRewards.filter(r => new Date(r.awardDate) <= new Date(filters.endDate));
    }

    return {
      rewards: filteredRewards,
      totalAmount: filteredRewards.reduce((sum, r) => sum + r.amount, 0),
      totalCount: filteredRewards.length
    };
  };

  const getUserAchievements = (userId) => {
    return state.userAchievements.get(userId) || [];
  };

  const getUserStreak = (userId) => {
    return state.userStreaks.get(userId) || { current: 0, lastActivity: null };
  };

  const getUserReferrals = (userId) => {
    return state.userReferrals.get(userId) || [];
  };

  const getRewardAnalytics = (userId) => {
    const rewards = state.userRewards.get(userId) || [];
    const achievements = state.userAchievements.get(userId) || [];
    const streak = getUserStreak(userId);
    const referrals = getUserReferrals(userId);

    const analytics = {
      totalRewards: rewards.reduce((sum, r) => sum + r.amount, 0),
      totalRewardCount: rewards.length,
      achievementCount: achievements.length,
      currentStreak: streak.current,
      referralCount: referrals.length,
      rewardByType: {},
      monthlyRewards: {},
      tierProgress: {}
    };

    // Calculate rewards by type
    rewards.forEach(reward => {
      analytics.rewardByType[reward.rewardType] = 
        (analytics.rewardByType[reward.rewardType] || 0) + reward.amount;
    });

    // Calculate monthly rewards
    rewards.forEach(reward => {
      const month = new Date(reward.awardDate).toISOString().substring(0, 7);
      analytics.monthlyRewards[month] = 
        (analytics.monthlyRewards[month] || 0) + reward.amount;
    });

    return analytics;
  };

  const getPlatformStats = () => {
    const totalRewards = Array.from(state.userRewards.values())
      .flat()
      .reduce((sum, r) => sum + r.amount, 0);

    const totalAchievements = Array.from(state.userAchievements.values())
      .flat().length;

    return {
      totalUsers: state.totalUsers,
      totalRewardsDistributed: totalRewards,
      totalAchievementsAwarded: totalAchievements,
      averageRewardPerUser: state.totalUsers > 0 ? totalRewards / state.totalUsers : 0,
      paused: state.paused,
      rewardMultiplier: state.rewardMultiplier,
      maxDailyRewards: state.maxDailyRewards
    };
  };

  // Admin functions
  const pauseContract = (adminWallet) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    state.paused = true;
    return { success: true, paused: true };
  };

  const unpauseContract = (adminWallet) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    state.paused = false;
    return { success: true, paused: false };
  };

  const updateRewardMultiplier = (adminWallet, newMultiplier) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    assert(newMultiplier > 0 && newMultiplier <= 5, 'Multiplier must be between 0 and 5');
    state.rewardMultiplier = newMultiplier;
    return { success: true, multiplier: newMultiplier };
  };

  const updateMaxDailyRewards = (adminWallet, newMax) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    assert(newMax > 0, 'Max daily rewards must be positive');
    state.maxDailyRewards = newMax;
    return { success: true, maxDailyRewards: newMax };
  };

  const addAdmin = (adminWallet, newAdmin) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    state.adminAddresses.push(newAdmin);
    return { success: true, admins: state.adminAddresses };
  };

  // Return public interface
  return {
    // User functions
    awardReward,
    awardAchievement,
    awardReferralBonus,
    awardTierBonus,
    getUserRewards,
    getUserAchievements,
    getUserStreak,
    getUserReferrals,
    getRewardAnalytics,
    
    // Query functions
    getPlatformStats,
    canClaimDailyReward,
    
    // Admin functions
    pauseContract,
    unpauseContract,
    updateRewardMultiplier,
    updateMaxDailyRewards,
    addAdmin,
    
    // State access (for testing)
    getState: () => ({ ...state }),
    
    // Issuer access
    getRewardIssuer: () => rewardIssuerKit.issuer
  };
};

// Contract installation
const start = async (zcf) => {
  const { rewardIssuerKit, nftIssuerKit, adminWallet, feeCollector } = zcf.getTerms();

  const contract = makeBlockpointsRewardsContract(zcf, {
    rewardIssuerKit,
    nftIssuerKit,
    adminWallet,
    feeCollector
  });

  // Return public API
  return {
    publicAPI: {
      awardReward: contract.awardReward,
      awardAchievement: contract.awardAchievement,
      awardReferralBonus: contract.awardReferralBonus,
      awardTierBonus: contract.awardTierBonus,
      getUserRewards: contract.getUserRewards,
      getUserAchievements: contract.getUserAchievements,
      getUserStreak: contract.getUserStreak,
      getUserReferrals: contract.getUserReferrals,
      getRewardAnalytics: contract.getRewardAnalytics,
      getPlatformStats: contract.getPlatformStats,
      canClaimDailyReward: contract.canClaimDailyReward,
      pauseContract: contract.pauseContract,
      unpauseContract: contract.unpauseContract,
      updateRewardMultiplier: contract.updateRewardMultiplier,
      updateMaxDailyRewards: contract.updateMaxDailyRewards,
      addAdmin: contract.addAdmin
    }
  };
};

export { start }; 