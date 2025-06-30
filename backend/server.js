import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { makeAgoricClient } from '@agoric/cosmic-proto';
import { makeWalletConnection } from '@agoric/wallet-connection';
import { makeZoeKit } from '@agoric/zoe';
import { Far } from '@endo/far';
import { E } from '@endo/eventual-send';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Agoric client
let agoricClient, walletConnection, zoeService, contractAPI;

// In-memory storage for additional features (in production, use proper database)
const marketplaceData = new Map();
const analyticsData = new Map();
const socialData = new Map();
const gamificationData = new Map();
const crossChainData = new Map();

const initializeAgoric = async () => {
  try {
    agoricClient = await makeAgoricClient({
      rpc: process.env.AGORIC_RPC || 'http://localhost:26657',
      api: process.env.AGORIC_API || 'http://localhost:1317',
      chainId: process.env.AGORIC_CHAIN_ID || 'blockpoints-1'
    });

    walletConnection = makeWalletConnection(agoricClient);
    const { zoeService: zoe } = makeZoeKit();
    zoeService = zoe;

    // Load deployed contract
    const deploymentInfo = await loadDeploymentInfo();
    if (deploymentInfo && deploymentInfo.publicAPI) {
      contractAPI = deploymentInfo.publicAPI;
      console.log('✅ Connected to deployed BLOCKPOINTS contract');
    }

    console.log('✅ Agoric client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Agoric client:', error);
  }
};

// Load deployment info
const loadDeploymentInfo = async () => {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile('deployment-info.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('⚠️ No deployment info found, running in development mode');
    return null;
  }
};

// ==================== HEALTH & STATUS ENDPOINTS ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BLOCKPOINTS API',
    version: '1.0.0',
    blockchain: contractAPI ? 'connected' : 'disconnected'
  });
});

app.get('/api/status', async (req, res) => {
  try {
    const status = {
      blockchain: contractAPI ? 'connected' : 'disconnected',
      network: process.env.AGORIC_CHAIN_ID || 'blockpoints-1',
      totalUsers: analyticsData.size,
      totalNFTs: 0,
      totalTransactions: 0
    };
    
    if (contractAPI) {
      // Get platform statistics
      const issuers = await E(contractAPI).getIssuers();
      status.issuers = Object.keys(issuers);
    }
    
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// ==================== USER PROFILE ENDPOINTS ====================

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const profile = await E(contractAPI).getUserProfile(userId);
    
    // Add additional profile data
    const socialProfile = socialData.get(userId) || {
      followers: [],
      following: [],
      achievements: [],
      referralCode: `REF_${userId}`,
      referredUsers: []
    };
    
    const gamificationProfile = gamificationData.get(userId) || {
      level: 1,
      experience: 0,
      achievements: [],
      badges: [],
      streak: 0,
      lastActivity: new Date().toISOString()
    };

    const enhancedProfile = {
      ...profile,
      social: socialProfile,
      gamification: gamificationProfile
    };

    res.json({ success: true, profile: enhancedProfile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

app.put('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userData, socialData: social, gamificationData: gamification } = req.body;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    // Update social data
    if (social) {
      socialData.set(userId, { ...socialData.get(userId), ...social });
    }

    // Update gamification data
    if (gamification) {
      gamificationData.set(userId, { ...gamificationData.get(userId), ...gamification });
    }

    const profile = await E(contractAPI).getUserProfile(userId);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// ==================== NFT ENDPOINTS ====================

app.post('/api/nfts/mint', async (req, res) => {
  try {
    const { userId, metadata, shoppingData } = req.body;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const result = await E(contractAPI).mintNFT(userId, metadata);
    
    // Update analytics
    const userAnalytics = analyticsData.get(userId) || { nfts: [], shopping: [] };
    userAnalytics.nfts.push({
      nftId: result.nftId,
      mintDate: new Date().toISOString(),
      metadata: result.metadata
    });
    analyticsData.set(userId, userAnalytics);

    // Update gamification
    const userGamification = gamificationData.get(userId) || { experience: 0, level: 1 };
    userGamification.experience += 100;
    userGamification.level = Math.floor(userGamification.experience / 1000) + 1;
    gamificationData.set(userId, userGamification);

    res.json({ success: true, nft: result });
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({ error: 'Failed to mint NFT' });
  }
});

app.get('/api/users/:userId/nfts', async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter, sort, page = 1, limit = 20 } = req.query;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const nfts = await E(contractAPI).getUserNFTs(userId);
    
    // Apply filters
    let filteredNFTs = nfts;
    if (filter) {
      const filterObj = JSON.parse(filter);
      filteredNFTs = nfts.filter(nft => {
        if (filterObj.tier && nft.metadata.tier !== filterObj.tier) return false;
        if (filterObj.category && nft.metadata.category !== filterObj.category) return false;
        return true;
      });
    }

    // Apply sorting
    if (sort) {
      const [field, order] = sort.split(':');
      filteredNFTs.sort((a, b) => {
        const aVal = a.metadata[field] || a[field];
        const bVal = b.metadata[field] || b[field];
        return order === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNFTs = filteredNFTs.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      nfts: paginatedNFTs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredNFTs.length,
        pages: Math.ceil(filteredNFTs.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch user NFTs' });
  }
});

app.post('/api/nfts/transfer', async (req, res) => {
  try {
    const { userId, nftId, targetChain, recipientAddress } = req.body;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const result = await E(contractAPI).transferNFT(userId, nftId, targetChain);
    
    // Store cross-chain transfer data
    const transferId = `transfer_${Date.now()}`;
    crossChainData.set(transferId, {
      userId,
      nftId,
      sourceChain: process.env.AGORIC_CHAIN_ID || 'blockpoints-1',
      targetChain,
      recipientAddress,
      status: 'pending',
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, transfer: { ...result, transferId } });
  } catch (error) {
    console.error('Error transferring NFT:', error);
    res.status(500).json({ error: 'Failed to transfer NFT' });
  }
});

// ==================== MARKETPLACE ENDPOINTS ====================

app.get('/api/marketplace/nfts', async (req, res) => {
  try {
    const { filter, sort, page = 1, limit = 20, search } = req.query;
    
    // Get all NFTs from marketplace data
    let allNFTs = Array.from(marketplaceData.values());
    
    // Apply search
    if (search) {
      allNFTs = allNFTs.filter(nft => 
        nft.metadata.name.toLowerCase().includes(search.toLowerCase()) ||
        nft.metadata.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filters
    if (filter) {
      const filterObj = JSON.parse(filter);
      allNFTs = allNFTs.filter(nft => {
        if (filterObj.tier && nft.metadata.tier !== filterObj.tier) return false;
        if (filterObj.category && nft.metadata.category !== filterObj.category) return false;
        if (filterObj.priceRange) {
          const price = nft.price || 0;
          if (price < filterObj.priceRange.min || price > filterObj.priceRange.max) return false;
        }
        return true;
      });
    }

    // Apply sorting
    if (sort) {
      const [field, order] = sort.split(':');
      allNFTs.sort((a, b) => {
        const aVal = a[field] || a.metadata[field];
        const bVal = b[field] || b.metadata[field];
        return order === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNFTs = allNFTs.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      nfts: paginatedNFTs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: allNFTs.length,
        pages: Math.ceil(allNFTs.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace NFTs' });
  }
});

app.get('/api/marketplace/nfts/:nftId', async (req, res) => {
  try {
    const { nftId } = req.params;
    
    const nft = marketplaceData.get(nftId);
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // Get transfer history
    const transferHistory = Array.from(crossChainData.values())
      .filter(transfer => transfer.nftId === nftId);

    res.json({ 
      success: true, 
      nft: { ...nft, transferHistory }
    });
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    res.status(500).json({ error: 'Failed to fetch NFT details' });
  }
});

app.post('/api/marketplace/nfts/:nftId/list', async (req, res) => {
  try {
    const { nftId } = req.params;
    const { price, currency = 'BLOCKPOINTS' } = req.body;
    
    const nft = marketplaceData.get(nftId);
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    nft.listed = true;
    nft.price = price;
    nft.currency = currency;
    nft.listedAt = new Date().toISOString();
    
    marketplaceData.set(nftId, nft);

    res.json({ success: true, nft });
  } catch (error) {
    console.error('Error listing NFT:', error);
    res.status(500).json({ error: 'Failed to list NFT' });
  }
});

// ==================== COLLATERAL ENDPOINTS ====================

app.post('/api/collateral/lock', async (req, res) => {
  try {
    const { userId, amount, purpose } = req.body;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const result = await E(contractAPI).lockCollateral(userId, amount);
    
    // Update analytics
    const userAnalytics = analyticsData.get(userId) || { collateral: [] };
    userAnalytics.collateral.push({
      action: 'lock',
      amount,
      purpose,
      timestamp: new Date().toISOString(),
      collateralId: result.collateralId
    });
    analyticsData.set(userId, userAnalytics);

    res.json({ success: true, collateral: result });
  } catch (error) {
    console.error('Error locking collateral:', error);
    res.status(500).json({ error: 'Failed to lock collateral' });
  }
});

app.post('/api/collateral/unlock', async (req, res) => {
  try {
    const { userId, collateralId } = req.body;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const result = await E(contractAPI).unlockCollateral(userId, collateralId);
    
    // Update analytics
    const userAnalytics = analyticsData.get(userId) || { collateral: [] };
    userAnalytics.collateral.push({
      action: 'unlock',
      amount: result.amount,
      timestamp: new Date().toISOString(),
      collateralId
    });
    analyticsData.set(userId, userAnalytics);

    res.json({ success: true, collateral: result });
  } catch (error) {
    console.error('Error unlocking collateral:', error);
    res.status(500).json({ error: 'Failed to unlock collateral' });
  }
});

app.get('/api/users/:userId/collateral', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const collateral = await E(contractAPI).getUserCollateral(userId);
    const analytics = analyticsData.get(userId);
    
    res.json({ 
      success: true, 
      collateral,
      analytics: analytics?.collateral || []
    });
  } catch (error) {
    console.error('Error fetching user collateral:', error);
    res.status(500).json({ error: 'Failed to fetch user collateral' });
  }
});

// ==================== REWARDS ENDPOINTS ====================

app.post('/api/rewards/award', async (req, res) => {
  try {
    const { userId, amount, reason, shoppingData } = req.body;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const result = await E(contractAPI).awardRewards(userId, amount, reason);
    
    // Update analytics
    const userAnalytics = analyticsData.get(userId) || { rewards: [], shopping: [] };
    userAnalytics.rewards.push({
      rewardId: result.rewardId,
      amount,
      reason,
      timestamp: new Date().toISOString()
    });
    
    if (shoppingData) {
      userAnalytics.shopping.push({
        ...shoppingData,
        rewardAmount: amount,
        timestamp: new Date().toISOString()
      });
    }
    
    analyticsData.set(userId, userAnalytics);

    // Update gamification
    const userGamification = gamificationData.get(userId) || { experience: 0, level: 1 };
    userGamification.experience += amount * 10;
    userGamification.level = Math.floor(userGamification.experience / 1000) + 1;
    userGamification.lastActivity = new Date().toISOString();
    gamificationData.set(userId, userGamification);

    res.json({ success: true, reward: result });
  } catch (error) {
    console.error('Error awarding rewards:', error);
    res.status(500).json({ error: 'Failed to award rewards' });
  }
});

app.get('/api/users/:userId/rewards', async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter, page = 1, limit = 20 } = req.query;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const rewards = await E(contractAPI).getUserRewards(userId);
    const analytics = analyticsData.get(userId);
    
    // Apply filters
    let filteredRewards = rewards;
    if (filter) {
      const filterObj = JSON.parse(filter);
      filteredRewards = rewards.filter(reward => {
        if (filterObj.reason && reward.reason !== filterObj.reason) return false;
        if (filterObj.dateRange) {
          const rewardDate = new Date(reward.awardDate);
          const startDate = new Date(filterObj.dateRange.start);
          const endDate = new Date(filterObj.dateRange.end);
          if (rewardDate < startDate || rewardDate > endDate) return false;
        }
        return true;
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRewards = filteredRewards.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      rewards: paginatedRewards,
      analytics: analytics?.rewards || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredRewards.length,
        pages: Math.ceil(filteredRewards.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).json({ error: 'Failed to fetch user rewards' });
  }
});

// ==================== TIER MANAGEMENT ====================

app.post('/api/users/:userId/tier/update', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const newTier = await E(contractAPI).updateUserTier(userId);
    
    // Update analytics
    const userAnalytics = analyticsData.get(userId) || { tierHistory: [] };
    userAnalytics.tierHistory.push({
      tier: newTier,
      timestamp: new Date().toISOString()
    });
    analyticsData.set(userId, userAnalytics);

    res.json({ success: true, tier: newTier });
  } catch (error) {
    console.error('Error updating user tier:', error);
    res.status(500).json({ error: 'Failed to update user tier' });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

app.get('/api/analytics/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeframe = '30d' } = req.query;
    
    const analytics = analyticsData.get(userId) || {};
    const profile = await E(contractAPI).getUserProfile(userId);
    
    // Calculate spending patterns
    const spendingPatterns = analytics.shopping?.reduce((acc, purchase) => {
      const category = purchase.category || 'other';
      acc[category] = (acc[category] || 0) + purchase.amount;
      return acc;
    }, {}) || {};

    // Calculate reward trends
    const rewardTrends = analytics.rewards?.map(reward => ({
      date: reward.timestamp,
      amount: reward.amount,
      reason: reward.reason
    })) || [];

    // Calculate NFT collection growth
    const nftGrowth = analytics.nfts?.map(nft => ({
      date: nft.mintDate,
      tier: nft.metadata.tier,
      category: nft.metadata.category
    })) || [];

    const analyticsData = {
      profile,
      spendingPatterns,
      rewardTrends,
      nftGrowth,
      tierHistory: analytics.tierHistory || [],
      collateralHistory: analytics.collateral || [],
      gamification: gamificationData.get(userId) || {}
    };

    res.json({ success: true, analytics: analyticsData });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

app.get('/api/analytics/platform', async (req, res) => {
  try {
    // Platform-wide analytics
    const totalUsers = analyticsData.size;
    const totalNFTs = Array.from(analyticsData.values())
      .reduce((sum, user) => sum + (user.nfts?.length || 0), 0);
    
    const totalRewards = Array.from(analyticsData.values())
      .reduce((sum, user) => sum + (user.rewards?.reduce((rSum, r) => rSum + r.amount, 0) || 0), 0);

    const totalTransactions = Array.from(analyticsData.values())
      .reduce((sum, user) => sum + (user.shopping?.length || 0), 0);

    const popularCategories = Array.from(analyticsData.values())
      .flatMap(user => user.shopping || [])
      .reduce((acc, purchase) => {
        const category = purchase.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

    const crossChainStats = Array.from(crossChainData.values())
      .reduce((acc, transfer) => {
        acc[transfer.targetChain] = (acc[transfer.targetChain] || 0) + 1;
        return acc;
      }, {});

    const platformAnalytics = {
      totalUsers,
      totalNFTs,
      totalRewards,
      totalTransactions,
      popularCategories,
      crossChainStats,
      timestamp: new Date().toISOString()
    };

    res.json({ success: true, analytics: platformAnalytics });
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    res.status(500).json({ error: 'Failed to fetch platform analytics' });
  }
});

// ==================== SOCIAL FEATURES ====================

app.post('/api/social/follow', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    
    const followerData = socialData.get(followerId) || { following: [] };
    const followingData = socialData.get(followingId) || { followers: [] };
    
    if (!followerData.following.includes(followingId)) {
      followerData.following.push(followingId);
      followingData.followers.push(followerId);
      
      socialData.set(followerId, followerData);
      socialData.set(followingId, followingData);
    }

    res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

app.post('/api/social/unfollow', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    
    const followerData = socialData.get(followerId) || { following: [] };
    const followingData = socialData.get(followingId) || { followers: [] };
    
    followerData.following = followerData.following.filter(id => id !== followingId);
    followingData.followers = followingData.followers.filter(id => id !== followerId);
    
    socialData.set(followerId, followerData);
    socialData.set(followingId, followingData);

    res.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

app.get('/api/social/users/:userId/followers', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userData = socialData.get(userId) || { followers: [] };
    const followers = userData.followers.map(followerId => ({
      userId: followerId,
      profile: analyticsData.get(followerId)?.profile || {}
    }));

    res.json({ success: true, followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

app.get('/api/social/users/:userId/following', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userData = socialData.get(userId) || { following: [] };
    const following = userData.following.map(followingId => ({
      userId: followingId,
      profile: analyticsData.get(followingId)?.profile || {}
    }));

    res.json({ success: true, following });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

// ==================== GAMIFICATION ENDPOINTS ====================

app.get('/api/gamification/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const gamification = gamificationData.get(userId) || {
      level: 1,
      experience: 0,
      achievements: [],
      badges: [],
      streak: 0,
      lastActivity: new Date().toISOString()
    };

    // Calculate achievements based on user activity
    const achievements = calculateAchievements(userId, gamification);
    gamification.achievements = achievements;

    res.json({ success: true, gamification });
  } catch (error) {
    console.error('Error fetching gamification data:', error);
    res.status(500).json({ error: 'Failed to fetch gamification data' });
  }
});

app.post('/api/gamification/users/:userId/claim-achievement', async (req, res) => {
  try {
    const { userId } = req.params;
    const { achievementId } = req.body;
    
    const gamification = gamificationData.get(userId) || {};
    const achievement = gamification.achievements?.find(a => a.id === achievementId);
    
    if (achievement && !achievement.claimed) {
      achievement.claimed = true;
      achievement.claimedAt = new Date().toISOString();
      
      // Award bonus rewards
      if (achievement.reward) {
        await E(contractAPI).awardRewards(userId, achievement.reward, `Achievement: ${achievement.name}`);
      }
      
      gamificationData.set(userId, gamification);
    }

    res.json({ success: true, achievement });
  } catch (error) {
    console.error('Error claiming achievement:', error);
    res.status(500).json({ error: 'Failed to claim achievement' });
  }
});

// ==================== CROSS-CHAIN BRIDGE ENDPOINTS ====================

app.get('/api/bridge/transfers', async (req, res) => {
  try {
    const { userId, status } = req.query;
    
    let transfers = Array.from(crossChainData.values());
    
    if (userId) {
      transfers = transfers.filter(transfer => transfer.userId === userId);
    }
    
    if (status) {
      transfers = transfers.filter(transfer => transfer.status === status);
    }

    res.json({ success: true, transfers });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    res.status(500).json({ error: 'Failed to fetch transfers' });
  }
});

app.get('/api/bridge/transfers/:transferId', async (req, res) => {
  try {
    const { transferId } = req.params;
    
    const transfer = crossChainData.get(transferId);
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    res.json({ success: true, transfer });
  } catch (error) {
    console.error('Error fetching transfer:', error);
    res.status(500).json({ error: 'Failed to fetch transfer' });
  }
});

app.post('/api/bridge/transfers/:transferId/update-status', async (req, res) => {
  try {
    const { transferId } = req.params;
    const { status, transactionHash } = req.body;
    
    const transfer = crossChainData.get(transferId);
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    transfer.status = status;
    transfer.transactionHash = transactionHash;
    transfer.updatedAt = new Date().toISOString();
    
    crossChainData.set(transferId, transfer);

    res.json({ success: true, transfer });
  } catch (error) {
    console.error('Error updating transfer status:', error);
    res.status(500).json({ error: 'Failed to update transfer status' });
  }
});

// ==================== REAL-TIME UPDATES ====================

app.get('/api/updates/stream', async (req, res) => {
  try {
    if (!contractAPI) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }

    const notifier = await E(contractAPI).getUpdatesNotifier();
    
    // Set up SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Subscribe to updates
    const subscription = await E(notifier).getUpdateSince();
    
    subscription.forEach(update => {
      res.write(`data: ${JSON.stringify(update)}\n\n`);
    });

    req.on('close', () => {
      // Clean up subscription
      subscription.return();
    });

  } catch (error) {
    console.error('Error setting up update stream:', error);
    res.status(500).json({ error: 'Failed to set up update stream' });
  }
});

// ==================== HELPER FUNCTIONS ====================

const calculateAchievements = (userId, gamification) => {
  const achievements = [];
  const analytics = analyticsData.get(userId);
  
  // NFT achievements
  const nftCount = analytics?.nfts?.length || 0;
  if (nftCount >= 1) achievements.push({ id: 'first_nft', name: 'First NFT', description: 'Minted your first NFT', claimed: false });
  if (nftCount >= 10) achievements.push({ id: 'nft_collector', name: 'NFT Collector', description: 'Minted 10 NFTs', claimed: false, reward: 100 });
  if (nftCount >= 50) achievements.push({ id: 'nft_master', name: 'NFT Master', description: 'Minted 50 NFTs', claimed: false, reward: 500 });
  
  // Level achievements
  if (gamification.level >= 5) achievements.push({ id: 'level_5', name: 'Level 5', description: 'Reached level 5', claimed: false, reward: 50 });
  if (gamification.level >= 10) achievements.push({ id: 'level_10', name: 'Level 10', description: 'Reached level 10', claimed: false, reward: 200 });
  
  // Streak achievements
  if (gamification.streak >= 7) achievements.push({ id: 'week_streak', name: 'Week Warrior', description: '7-day activity streak', claimed: false, reward: 100 });
  if (gamification.streak >= 30) achievements.push({ id: 'month_streak', name: 'Monthly Master', description: '30-day activity streak', claimed: false, reward: 500 });
  
  return achievements;
};

// ==================== ERROR HANDLING ====================

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ==================== START SERVER ====================

const startServer = async () => {
  try {
    await initializeAgoric();
    
    app.listen(PORT, () => {
      console.log(`🚀 BLOCKPOINTS API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API docs: http://localhost:${PORT}/api`);
      console.log(`📈 Analytics: http://localhost:${PORT}/api/analytics`);
      console.log(`🛒 Marketplace: http://localhost:${PORT}/api/marketplace`);
      console.log(`🌉 Cross-chain: http://localhost:${PORT}/api/bridge`);
      console.log(`🎮 Gamification: http://localhost:${PORT}/api/gamification`);
      console.log(`👥 Social: http://localhost:${PORT}/api/social`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 