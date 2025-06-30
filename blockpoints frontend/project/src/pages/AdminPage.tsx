import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Settings, 
  BarChart3, 
  Shield, 
  Database, 
  Activity, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Filter
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { 
  getPlatformAnalytics, 
  getTransferHistory, 
  updateTransferStatus,
  getUserProfile,
  getUserNFTs,
  getUserRewards,
  getAllUsers
} from '../utils/api';

interface AdminStats {
  totalUsers: number;
  totalNFTs: number;
  totalRewards: number;
  totalVolume: number;
  activeUsers: number;
  pendingTransfers: number;
}

interface UserData {
  userId: string;
  profile: any;
  nfts: any[];
  rewards: any[];
  tier: string;
  joinDate: string;
}

const AdminPage = () => {
  const { isConnected, walletAddress } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Admin wallet addresses (in production, this would be stored securely)
  const ADMIN_ADDRESSES = [
    'agoric_admin_primary',
    'agoric_admin_secondary',
    'agoric_owner'
  ];

  useEffect(() => {
    if (isConnected && walletAddress) {
      checkAdminStatus();
      loadAdminData();
    }
  }, [isConnected, walletAddress]);

  const checkAdminStatus = () => {
    const isAdminUser = ADMIN_ADDRESSES.includes(walletAddress || '');
    setIsAdmin(isAdminUser);
  };

  const loadAdminData = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      // Load platform analytics
      const analyticsResponse = await getPlatformAnalytics();
      if (analyticsResponse.success && analyticsResponse.data) {
        const analytics = (analyticsResponse.data as { analytics?: any }).analytics || {};
        setStats({
          totalUsers: analytics.totalUsers || 0,
          totalNFTs: analytics.totalNFTs || 0,
          totalRewards: analytics.totalRewards || 0,
          totalVolume: analytics.totalVolume || 0,
          activeUsers: analytics.activeUsers || 0,
          pendingTransfers: analytics.pendingTransfers || 0
        });
      }

      // Load transfer history
      const transfersResponse = await getTransferHistory();
      if (
        transfersResponse.success &&
        typeof transfersResponse.data === 'object' &&
        transfersResponse.data !== null &&
        'transfers' in transfersResponse.data
      ) {
        setTransfers((transfersResponse.data as { transfers?: any[] }).transfers || []);
      }

      // Load all users from backend
      const usersResponse = await getAllUsers();
      if (usersResponse.success && usersResponse.data && Array.isArray(usersResponse.data.users)) {
        setUsers(usersResponse.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferUpdate = async (transferId: string, status: string) => {
    try {
      const response = await updateTransferStatus(transferId, status);
      if (response.success) {
        // Refresh transfers
        const transfersResponse = await getTransferHistory();
        if (
          transfersResponse.success &&
          typeof transfersResponse.data === 'object' &&
          transfersResponse.data !== null &&
          'transfers' in transfersResponse.data
        ) {
          setTransfers((transfersResponse.data as { transfers?: any[] }).transfers || []);
        }
      }
    } catch (error) {
      console.error('Error updating transfer:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Show access denied if not admin
  if (isConnected && !isAdmin) {
    return (
      <section className="py-8 md:py-12 relative">
        <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="text-center">
            <div className="glass-card p-8">
              <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="font-display text-3xl font-bold mb-4">Access Denied</h2>
              <p className="text-white/60 mb-6">You don't have admin privileges to access this page.</p>
              <p className="text-white/40 text-sm">Wallet: {walletAddress}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show connect wallet prompt
  if (!isConnected) {
    return (
      <section className="py-8 md:py-12 relative">
        <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="text-center">
            <div className="glass-card p-8">
              <Shield className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h2 className="font-display text-3xl font-bold mb-4">Admin Access Required</h2>
              <p className="text-white/60 mb-6">Connect your admin wallet to access the admin panel.</p>
              <button 
                onClick={() => window.location.href = '/wallet'}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-xl font-semibold text-white"
              >
                Connect Admin Wallet
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 relative">
      <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-500/20 rounded-full px-6 py-3 mb-6"
          >
            <Shield className="w-4 h-4 text-red-400" />
            <span className="font-sans text-sm font-medium text-white/90">
              Admin Panel
            </span>
          </motion.div>

          <h2 className="font-sans text-5xl md:text-6xl font-bold mb-8">
            Platform <span className="gradient-text">Administration</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Manage users, monitor transactions, and oversee the BLOCKPOINTS ecosystem.
          </p>
        </motion.div>

        {/* Admin Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'transfers', label: 'Transfers', icon: Activity },
              { id: 'nfts', label: 'NFTs', icon: Award },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-purple-500 to-cyan-500'
                    : 'text-white/70 hover:text-white hover:bg-white/5 glass-card'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {activeTab === 'overview' && (
            <div>
              <h3 className="font-sans text-2xl font-bold mb-6">Platform Overview</h3>
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
                  <p className="text-white/60">Loading platform statistics...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats && [
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Total NFTs', value: stats.totalNFTs, icon: Award, color: 'from-purple-500 to-pink-500' },
                    { label: 'Total Rewards', value: stats.totalRewards, icon: DollarSign, color: 'from-green-500 to-teal-500' },
                    { label: 'Total Volume', value: `$${stats.totalVolume.toLocaleString()}`, icon: TrendingUp, color: 'from-gold-400 to-gold-600' },
                    { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'from-emerald-500 to-green-500' },
                    { label: 'Pending Transfers', value: stats.pendingTransfers, icon: Clock, color: 'from-orange-500 to-red-500' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6 text-center"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-sans text-2xl font-bold mb-2 gradient-text">{stat.value}</h4>
                      <p className="text-white/60 font-sans">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-sans text-2xl font-bold">User Management</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="glass-card px-4 py-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Filter className="w-4 h-4 absolute right-3 top-3 text-white/50" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-xl font-semibold text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                {users.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-sans font-semibold text-white">{user.userId}</h4>
                        <p className="text-white/60 text-sm">{user.tier} Tier • Joined {user.joinDate}</p>
                        <p className="text-white/40 text-xs">
                          {user.nfts.length} NFTs • {user.rewards.length} Rewards • ${user.profile.totalSpent} Spent
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="p-2 glass-card rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="p-2 glass-card rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="p-2 glass-card rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transfers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-sans text-2xl font-bold">Cross-Chain Transfers</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={loadAdminData}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-xl font-semibold text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                {transfers.map((transfer, index) => (
                  <motion.div
                    key={transfer.transferId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-sans font-semibold text-white">Transfer #{transfer.transferId}</h4>
                        <p className="text-white/60 text-sm">
                          {transfer.userId} → {transfer.targetChain}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(transfer.status)}`}>
                        {getStatusIcon(transfer.status)}
                        <span className="text-sm font-semibold">{transfer.status}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-white/40">NFT ID</p>
                        <p className="text-white font-mono">{transfer.nftId}</p>
                      </div>
                      <div>
                        <p className="text-white/40">Amount</p>
                        <p className="text-white">{transfer.amount}</p>
                      </div>
                      <div>
                        <p className="text-white/40">Created</p>
                        <p className="text-white">{new Date(transfer.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-white/40">Actions</p>
                        <div className="flex space-x-2">
                          {transfer.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleTransferUpdate(transfer.transferId, 'completed')}
                                className="text-green-400 hover:text-green-300 text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleTransferUpdate(transfer.transferId, 'failed')}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="font-sans text-2xl font-bold mb-6">Platform Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h4 className="font-sans font-semibold text-white mb-4">Smart Contract Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/60 text-sm">NFT Contract Address</label>
                      <input
                        type="text"
                        defaultValue="agoric1nftcontract..."
                        className="w-full glass-card px-3 py-2 rounded-lg text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Rewards Contract Address</label>
                      <input
                        type="text"
                        defaultValue="agoric1rewardscontract..."
                        className="w-full glass-card px-3 py-2 rounded-lg text-white mt-1"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-2 rounded-lg font-semibold text-white"
                    >
                      Update Contracts
                    </motion.button>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h4 className="font-sans font-semibold text-white mb-4">Platform Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/60 text-sm">Minimum Tier Upgrade Amount</label>
                      <input
                        type="number"
                        defaultValue="1000"
                        className="w-full glass-card px-3 py-2 rounded-lg text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Reward Multiplier</label>
                      <input
                        type="number"
                        defaultValue="1.5"
                        step="0.1"
                        className="w-full glass-card px-3 py-2 rounded-lg text-white mt-1"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-2 rounded-lg font-semibold text-white"
                    >
                      Save Configuration
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AdminPage; 