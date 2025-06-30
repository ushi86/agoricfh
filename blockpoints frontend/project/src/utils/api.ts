// API utility for BLOCKPOINTS backend integration

const API_BASE_URL = 'http://localhost:3001';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UserProfile {
  userId: string;
  joinDate: string;
  totalSpent: number;
  totalRewards: number;
  nftCount: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  social?: {
    followers: string[];
    following: string[];
    achievements: any[];
    referralCode: string;
    referredUsers: string[];
  };
  gamification?: {
    level: number;
    experience: number;
    achievements: any[];
    badges: any[];
    streak: number;
    lastActivity: string;
  };
}

export interface NFT {
  nftId: string;
  metadata: {
    name: string;
    description: string;
    image?: string;
    attributes?: any;
    tier: string;
    mintDate: string;
  };
  nft: any;
}

export interface Reward {
  rewardId: string;
  amount: number;
  reason: string;
  awardDate: string;
}

export interface Collateral {
  collateralId: string;
  amount: number;
  lockDate: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Health check
export const checkApiHealth = () => apiCall('/health');

// User Profile API
export const getUserProfile = (userId: string) => 
  apiCall<UserProfile>(`/api/users/${userId}/profile`);

export const updateUserProfile = (userId: string, userData: any) =>
  apiCall(`/api/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });

// NFT API
export const mintNFT = (userId: string, metadata: any, shoppingData?: any) =>
  apiCall<{ nftId: string; nft: any; metadata: any }>('/api/nfts/mint', {
    method: 'POST',
    body: JSON.stringify({ userId, metadata, shoppingData }),
  });

export const getUserNFTs = (userId: string, filters?: any) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  return apiCall<{ nfts: NFT[]; pagination: any }>(`/api/users/${userId}/nfts?${params}`);
};

export const transferNFT = (userId: string, nftId: string, targetChain: string, recipientAddress?: string) =>
  apiCall('/api/nfts/transfer', {
    method: 'POST',
    body: JSON.stringify({ userId, nftId, targetChain, recipientAddress }),
  });

// Marketplace API
export const getMarketplaceNFTs = (filters?: any) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  return apiCall<{ nfts: NFT[]; pagination: any }>(`/api/marketplace/nfts?${params}`);
};

export const getNFTDetails = (nftId: string) =>
  apiCall(`/api/marketplace/nfts/${nftId}`);

export const listNFT = (nftId: string, price: number, currency: string = 'BLOCKPOINTS') =>
  apiCall(`/api/marketplace/nfts/${nftId}/list`, {
    method: 'POST',
    body: JSON.stringify({ price, currency }),
  });

// Collateral API
export const lockCollateral = (userId: string, amount: number, purpose?: string) =>
  apiCall<Collateral>('/api/collateral/lock', {
    method: 'POST',
    body: JSON.stringify({ userId, amount, purpose }),
  });

export const unlockCollateral = (userId: string, collateralId: string) =>
  apiCall<Collateral>('/api/collateral/unlock', {
    method: 'POST',
    body: JSON.stringify({ userId, collateralId }),
  });

export const getUserCollateral = (userId: string) =>
  apiCall<{ collateral: Collateral[]; analytics: any[] }>(`/api/users/${userId}/collateral`);

// Rewards API
export const awardRewards = (userId: string, amount: number, reason: string, shoppingData?: any) =>
  apiCall<Reward>('/api/rewards/award', {
    method: 'POST',
    body: JSON.stringify({ userId, amount, reason, shoppingData }),
  });

export const getUserRewards = (userId: string, filters?: any) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  return apiCall<{ rewards: Reward[]; analytics: any[]; pagination: any }>(`/api/users/${userId}/rewards?${params}`);
};

// Tier Management
export const updateUserTier = (userId: string) =>
  apiCall<{ tier: string }>(`/api/users/${userId}/tier/update`, {
    method: 'POST',
  });

// Analytics API
export const getUserAnalytics = (userId: string, timeframe: string = '30d') =>
  apiCall(`/api/analytics/users/${userId}?timeframe=${timeframe}`);

export const getPlatformAnalytics = () =>
  apiCall('/api/analytics/platform');

// Social Features API
export const followUser = (followerId: string, followingId: string) =>
  apiCall('/api/social/follow', {
    method: 'POST',
    body: JSON.stringify({ followerId, followingId }),
  });

export const unfollowUser = (followerId: string, followingId: string) =>
  apiCall('/api/social/unfollow', {
    method: 'POST',
    body: JSON.stringify({ followerId, followingId }),
  });

export const getUserFollowers = (userId: string) =>
  apiCall(`/api/social/users/${userId}/followers`);

export const getUserFollowing = (userId: string) =>
  apiCall(`/api/social/users/${userId}/following`);

// Gamification API
export const getGamificationData = (userId: string) =>
  apiCall(`/api/gamification/users/${userId}`);

export const claimAchievement = (userId: string, achievementId: string) =>
  apiCall(`/api/gamification/users/${userId}/claim-achievement`, {
    method: 'POST',
    body: JSON.stringify({ achievementId }),
  });

// Cross-Chain Bridge API
export const getTransferHistory = (userId?: string, status?: string) => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (status) params.append('status', status);
  return apiCall(`/api/bridge/transfers?${params}`);
};

export const getTransferDetails = (transferId: string) =>
  apiCall(`/api/bridge/transfers/${transferId}`);

export const updateTransferStatus = (transferId: string, status: string, transactionHash?: string) =>
  apiCall(`/api/bridge/transfers/${transferId}/update-status`, {
    method: 'POST',
    body: JSON.stringify({ status, transactionHash }),
  });

// Real-time updates
export const createEventSource = (userId: string) => {
  const eventSource = new EventSource(`${API_BASE_URL}/api/updates/stream`);
  return eventSource;
};

// Platform status
export const getPlatformStatus = () => apiCall('/api/status');

// Admin: Get all users
export const getAllUsers = () =>
  apiCall<{ users: any[] }>(`/api/users`); 