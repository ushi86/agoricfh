import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, getUserProfile, checkApiHealth } from '../utils/api';
import { agoricWallet, walletUtils, walletEvents, WalletConnection } from '../utils/wallet';

interface UserContextType {
  // Wallet state
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletInfo: any;
  
  // User data
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  
  // Connection methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Profile methods
  refreshProfile: () => Promise<void>;
  
  // API health
  isApiHealthy: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isApiHealthy, setIsApiHealthy] = useState(false);
  const [walletInfo, setWalletInfo] = useState<any>(null);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth().then((response) => {
      setIsApiHealthy(response.success);
    });
  }, []);

  // Initialize wallet and listen for events
  useEffect(() => {
    const initializeWallet = async () => {
      await agoricWallet.initialize();
      setWalletInfo(agoricWallet.getWalletInfo());
    };

    initializeWallet();

    // Listen for wallet events
    walletEvents.on('connected', (connection: WalletConnection) => {
      setWalletAddress(connection.address);
      setIsConnected(true);
      setWalletInfo(agoricWallet.getWalletInfo());
    });

    walletEvents.on('disconnected', () => {
      setWalletAddress(null);
      setIsConnected(false);
      setUserProfile(null);
      setWalletInfo(agoricWallet.getWalletInfo());
    });

    return () => {
      walletEvents.off('connected', () => {});
      walletEvents.off('disconnected', () => {});
    };
  }, []);

  // Load user profile when wallet connects
  useEffect(() => {
    if (walletAddress && isConnected) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [walletAddress, isConnected]);

  const loadUserProfile = async () => {
    if (!walletAddress) return;
    
    setIsLoadingProfile(true);
    try {
      const response = await getUserProfile(walletAddress);
      if (response.success && response.data) {
        setUserProfile(response.data);
      } else {
        console.error('Failed to load user profile:', response.error);
        // Create a default profile for new users
        setUserProfile({
          userId: walletAddress,
          joinDate: new Date().toISOString(),
          totalSpent: 0,
          totalRewards: 0,
          nftCount: 0,
          tier: 'BRONZE',
          social: {
            followers: [],
            following: [],
            achievements: [],
            referralCode: `REF_${walletAddress.slice(0, 8)}`,
            referredUsers: []
          },
          gamification: {
            level: 1,
            experience: 0,
            achievements: [],
            badges: [],
            streak: 0,
            lastActivity: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const connection = await agoricWallet.connect();
      setWalletAddress(connection.address);
      setIsConnected(true);
      setWalletInfo(agoricWallet.getWalletInfo());
      
      // Emit connection event
      walletEvents.emit('connected', connection);
      
      console.log('Connected to wallet:', connection.address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // Fallback to mock wallet
      const mockAddress = `agoric_${Math.random().toString(36).substring(2, 15)}`;
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setWalletInfo({ isInitialized: false, isConnected: true, walletType: 'mock' });
      console.log('Using mock wallet due to connection error:', mockAddress);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await agoricWallet.disconnect();
      setWalletAddress(null);
      setIsConnected(false);
      setUserProfile(null);
      setWalletInfo(agoricWallet.getWalletInfo());
      
      // Emit disconnection event
      walletEvents.emit('disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const refreshProfile = async () => {
    await loadUserProfile();
  };

  const value: UserContextType = {
    walletAddress,
    isConnected,
    isConnecting,
    walletInfo,
    userProfile,
    isLoadingProfile,
    connectWallet,
    disconnectWallet,
    refreshProfile,
    isApiHealthy,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 