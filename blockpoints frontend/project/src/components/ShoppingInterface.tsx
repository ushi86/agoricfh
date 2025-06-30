import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, Calculator, Gift, Star, Zap } from 'lucide-react';

const ShoppingInterface = () => {
  const partnerStores = [
    { name: 'Premium Electronics', category: 'Technology', rewards: 'High Tier NFTs' },
    { name: 'Luxury Fashion', category: 'Apparel', rewards: 'Exclusive Badges' },
    { name: 'Home & Living', category: 'Lifestyle', rewards: 'Collectible NFTs' },
    { name: 'Sports & Fitness', category: 'Health', rewards: 'Achievement Tokens' },
  ];

  return (
    <section id="shopping" className="py-24 relative">
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
            <ShoppingBag className="w-4 h-4 text-gold-400" />
            <span className="font-display text-sm font-medium text-white/90">
              Shopping Experience
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Shop & <span className="gradient-text">Earn NFTs</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Browse our partner stores and earn exclusive NFT rewards with every purchase.
          </p>
        </motion.div>

        {/* Shopping Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Reward Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Reward Calculator</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 mb-2 font-display">Purchase Amount</label>
                <div className="glass-card p-4 rounded-xl">
                  <span className="text-2xl font-bold gradient-text">$0.00</span>
                </div>
              </div>
              
              <div>
                <label className="block text-white/70 mb-2 font-display">Estimated NFT Rewards</label>
                <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                  <span className="text-lg text-white">Premium Badge NFT</span>
                  <Star className="w-6 h-6 text-gold-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-white/70 mb-2 font-display">Tier Multiplier</label>
                <div className="glass-card p-4 rounded-xl">
                  <span className="text-lg font-semibold text-purple-400">Platinum: Enhanced Rewards</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shopping Cart Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">NFT Preview</h3>
            </div>
            
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white">Shopping Master NFT</h4>
                    <p className="text-white/60">Exclusive reward for this purchase</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-white/70 mb-4">This NFT will be minted instantly after purchase</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 rounded-full font-display font-semibold text-white"
                >
                  Complete Purchase
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partner Stores */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Partner <span className="gradient-text">Stores</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerStores.map((store, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.05 }}
                className="glass-card p-6 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-display text-lg font-semibold mb-2 text-white">{store.name}</h4>
                <p className="text-white/60 mb-2">{store.category}</p>
                <p className="text-sm text-gold-400 font-mono">{store.rewards}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShoppingInterface;