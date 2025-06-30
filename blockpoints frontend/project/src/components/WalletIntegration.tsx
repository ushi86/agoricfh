import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, Zap, CheckCircle, AlertCircle, TrendingUp, Bell, Settings, History } from 'lucide-react';

const WalletIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');

  const walletOptions = [
    { name: 'MetaMask', icon: '🦊', status: 'Available' },
    { name: 'WalletConnect', icon: '🔗', status: 'Available' },
    { name: 'Coinbase Wallet', icon: '🔵', status: 'Available' },
    { name: 'Trust Wallet', icon: '🛡️', status: 'Available' }
  ];

  const walletFeatures = [
    { icon: Shield, title: 'Secure Connection', description: 'Enterprise-grade security protocols' },
    { icon: Zap, title: 'Instant Transactions', description: 'Lightning-fast blockchain interactions' },
    { icon: TrendingUp, title: 'Real-time Balance', description: 'Live portfolio tracking and updates' },
    { icon: Bell, title: 'Smart Notifications', description: 'Transaction alerts and reward updates' }
  ];

  const transactionHistory = [
    { type: 'NFT Minted', amount: 'Premium Badge', status: 'Completed', time: 'Recently' },
    { type: 'Collateral Locked', amount: 'Staking Active', status: 'Active', time: 'Current' },
    { type: 'Cross-Chain Transfer', amount: 'NFT Bridged', status: 'Completed', time: 'Latest' },
    { type: 'Reward Claimed', amount: 'Tier Bonus', status: 'Processed', time: 'Today' }
  ];

  return (
    <section id="wallet" className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
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
            <Wallet className="w-4 h-4 text-gold-400" />
            <span className="font-sans text-sm font-medium text-white/90">
              Wallet Integration
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Seamless <span className="gradient-text">Wallet Connection</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-body">
            Connect your preferred wallet and manage your NFTs, transactions, and rewards with enterprise-grade security.
          </p>
        </motion.div>

        {/* Wallet Connection Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Connect Wallet Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Connect Wallet</h3>
            </div>

            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-white/70 mb-6 font-body">Choose your preferred wallet to get started</p>
                {walletOptions.map((wallet, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedWallet(wallet.name);
                      setIsConnected(true);
                    }}
                    className="w-full glass-card p-4 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div className="text-left">
                        <h4 className="font-sans font-semibold text-white">{wallet.name}</h4>
                        <p className="text-white/60 text-sm font-body">{wallet.status}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h4 className="font-sans font-semibold text-white">Connected to {selectedWallet}</h4>
                    <p className="text-green-400 text-sm font-mono">Wallet Status: Active</p>
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="glass-card p-6 rounded-xl">
                  <h4 className="font-sans font-semibold text-white mb-4">Wallet Balance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70 font-body">ETH Balance</span>
                      <span className="text-white font-mono">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70 font-body">MATIC Balance</span>
                      <span className="text-white font-mono">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70 font-body">NFTs Owned</span>
                      <span className="text-purple-400 font-mono">Growing Collection</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-xl font-sans font-semibold text-white"
                  >
                    View NFTs
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="glass-card py-3 rounded-xl font-sans font-semibold text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    Settings
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Transaction History</h3>
            </div>

            <div className="space-y-4">
              {transactionHistory.map((transaction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-white">{transaction.type}</h4>
                      <p className="text-white/60 text-sm font-body">{transaction.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                      transaction.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      transaction.status === 'Active' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {transaction.status}
                    </span>
                    <p className="text-white/60 text-xs mt-1 font-mono">{transaction.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full mt-6 glass-card py-3 rounded-xl font-sans font-semibold text-white hover:bg-white/10 transition-colors duration-200"
            >
              View All Transactions
            </motion.button>
          </motion.div>
        </div>

        {/* Wallet Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Advanced <span className="gradient-text">Wallet Features</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {walletFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.05 }}
                className="glass-card p-6 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-sans text-lg font-semibold mb-2 text-white">{feature.title}</h4>
                <p className="text-white/60 text-sm font-body">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-card p-8 border border-blue-500/20">
            <div className="flex items-center space-x-4 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <h3 className="font-display text-2xl font-bold text-white">Security First</h3>
            </div>
            <p className="text-white/80 font-body leading-relaxed">
              Your wallet connection is secured with enterprise-grade encryption. We never store your private keys or seed phrases. 
              All transactions are verified on-chain and your assets remain under your complete control at all times.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WalletIntegration;