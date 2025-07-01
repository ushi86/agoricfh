import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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

// In-memory storage for development (in production, use proper database)
const marketplaceData = new Map();
const analyticsData = new Map();
const socialData = new Map();
const gamificationData = new Map();
const crossChainData = new Map();
const userProfiles = new Map();

// ==================== HEALTH & STATUS ENDPOINTS ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BLOCKPOINTS API',
    version: '1.0.0',
    blockchain: 'simulated'
  });
});

app.get('/api/status', async (req, res) => {
  try {
    const status = {
      blockchain: 'simulated',
      network: 'blockpoints-1',
      totalUsers: userProfiles.size,
      totalNFTs: marketplaceData.size,
      totalTransactions: 0
    };
    
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// ==================== USER PROFILE ENDPOINTS ====================

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get or create user profile
    let profile = userProfiles.get(userId);
    if (!profile) {
      profile = {
        userId,
        joinDate: new Date().toISOString(),
        totalSpent: 0,
        totalRewards: 0,
        nftCount: 0,
        tier: 'BRONZE'
      };
      userProfiles.set(userId, profile);
    }
    
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
    
    // Update user profile
    const currentProfile = userProfiles.get(userId) || {};
    userProfiles.set(userId, { ...currentProfile, ...userData });

    // Update social data
    if (social) {
      socialData.set(userId, { ...socialData.get(userId), ...social });
    }

    // Update gamification data
    if (gamification) {
      gamificationData.set(userId, { ...gamificationData.get(userId), ...gamification });
    }

    const profile = userProfiles.get(userId);
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
    
    const nftId = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = {
      nftId,
      nft: { id: nftId, owner: userId },
      metadata: { ...metadata, mintDate: new Date().toISOString() }
    };
    
    // Store NFT in marketplace
    marketplaceData.set(nftId, result);
    
    // Update user profile
    const profile = userProfiles.get(userId) || {};
    profile.nftCount = (profile.nftCount || 0) + 1;
    userProfiles.set(userId, profile);
    
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
    
    // Get user's NFTs from marketplace
    const userNFTs = Array.from(marketplaceData.values()).filter(nft => nft.nft.owner === userId);
    
    // Apply filters
    let filteredNFTs = userNFTs;
    if (filter) {
      const filterObj = JSON.parse(filter);
      filteredNFTs = userNFTs.filter(nft => {
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
    
    res.json({ success: true, nft });
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    res.status(500).json({ error: 'Failed to fetch NFT details' });
  }
});

// ==================== REWARDS ENDPOINTS ====================

app.post('/api/rewards/award', async (req, res) => {
  try {
    const { userId, amount, reason, shoppingData } = req.body;
    
    const rewardId = `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const reward = {
      rewardId,
      amount,
      reason,
      awardDate: new Date().toISOString()
    };
    
    // Update user profile
    const profile = userProfiles.get(userId) || {};
    profile.totalRewards = (profile.totalRewards || 0) + amount;
    userProfiles.set(userId, profile);
    
    // Update analytics
    const userAnalytics = analyticsData.get(userId) || { rewards: [], shopping: [] };
    userAnalytics.rewards.push(reward);
    analyticsData.set(userId, userAnalytics);

    res.json({ success: true, reward });
  } catch (error) {
    console.error('Error awarding rewards:', error);
    res.status(500).json({ error: 'Failed to award rewards' });
  }
});

app.get('/api/users/:userId/rewards', async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter, page = 1, limit = 20 } = req.query;
    
    const userAnalytics = analyticsData.get(userId);
    const rewards = userAnalytics?.rewards || [];
    
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
      analytics: userAnalytics?.rewards || [],
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

// ==================== COLLATERAL ENDPOINTS ====================

app.post('/api/collateral/lock', async (req, res) => {
  try {
    const { userId, amount, purpose } = req.body;
    
    const collateralId = `collateral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const collateral = {
      collateralId,
      amount,
      purpose: purpose || 'General',
      lockDate: new Date().toISOString()
    };
    
    // Store collateral
    const userCollateral = analyticsData.get(userId)?.collateral || [];
    userCollateral.push(collateral);
    
    const userAnalytics = analyticsData.get(userId) || { collateral: [] };
    userAnalytics.collateral = userCollateral;
    analyticsData.set(userId, userAnalytics);

    res.json({ success: true, collateral });
  } catch (error) {
    console.error('Error locking collateral:', error);
    res.status(500).json({ error: 'Failed to lock collateral' });
  }
});

app.get('/api/users/:userId/collateral', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userAnalytics = analyticsData.get(userId);
    const collateral = userAnalytics?.collateral || [];

    res.json({ 
      success: true, 
      collateral,
      analytics: userAnalytics?.collateral || []
    });
  } catch (error) {
    console.error('Error fetching user collateral:', error);
    res.status(500).json({ error: 'Failed to fetch user collateral' });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

app.get('/api/analytics/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeframe = '30d' } = req.query;
    
    const userAnalytics = analyticsData.get(userId) || {};
    
    res.json({ 
      success: true, 
      analytics: userAnalytics,
      timeframe
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

app.get('/api/analytics/platform', async (req, res) => {
  try {
    const platformAnalytics = {
      totalUsers: userProfiles.size,
      totalNFTs: marketplaceData.size,
      totalRewards: Array.from(analyticsData.values()).reduce((sum, data) => 
        sum + (data.rewards?.length || 0), 0),
      totalCollateral: Array.from(analyticsData.values()).reduce((sum, data) => 
        sum + (data.collateral?.length || 0), 0)
    };
    
    res.json({ 
      success: true, 
      analytics: platformAnalytics
    });
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    res.status(500).json({ error: 'Failed to fetch platform analytics' });
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
    
    res.json({ 
      success: true, 
      gamification
    });
  } catch (error) {
    console.error('Error fetching gamification data:', error);
    res.status(500).json({ error: 'Failed to fetch gamification data' });
  }
});

// ==================== SOCIAL ENDPOINTS ====================

app.post('/api/social/follow', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    
    // Update follower's following list
    const followerSocial = socialData.get(followerId) || { following: [] };
    if (!followerSocial.following.includes(followingId)) {
      followerSocial.following.push(followingId);
      socialData.set(followerId, followerSocial);
    }
    
    // Update following's followers list
    const followingSocial = socialData.get(followingId) || { followers: [] };
    if (!followingSocial.followers.includes(followerId)) {
      followingSocial.followers.push(followerId);
      socialData.set(followingId, followingSocial);
    }
    
    res.json({ success: true, message: 'Follow successful' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

app.get('/api/social/users/:userId/followers', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const social = socialData.get(userId) || { followers: [] };
    
    res.json({ 
      success: true, 
      followers: social.followers
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

app.get('/api/social/users/:userId/following', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const social = socialData.get(userId) || { following: [] };
    
    res.json({ 
      success: true, 
      following: social.following
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

// ==================== USER LIST ENDPOINT (ADMIN) ====================

app.get('/api/users', async (req, res) => {
  try {
    const userIds = Array.from(userProfiles.keys());
    const users = [];

    for (const userId of userIds) {
      const profile = userProfiles.get(userId);
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
      users.push({
        userId,
        profile,
        social: socialProfile,
        gamification: gamificationProfile
      });
    }

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ==================== START SERVER ====================

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 BLOCKPOINTS API Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Status: http://localhost:${PORT}/api/status`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 