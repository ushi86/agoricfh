import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Star, Eye, ShoppingCart } from 'lucide-react';

const NFTMarketplace = () => {
  const featuredNFTs: any[] = [];

  const categories = ['All', 'Achievement', 'Utility', 'Reward', 'Milestone', 'Exclusive'];
  const rarityLevels = ['Common', 'Rare', 'Epic', 'Legendary'];

  return (
    <section id="marketplace" className="py-24 relative">
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
            <ShoppingCart className="w-4 h-4 text-gold-400" />
            <span className="font-display text-sm font-medium text-white/90">
              NFT Marketplace
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Discover <span className="gradient-text">Unique NFTs</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Browse, collect, and trade exclusive NFTs from the BLOCKPOINTS ecosystem.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search NFTs..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-display"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-all duration-200 font-display text-sm"
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-3 bg-purple-500 rounded-xl text-white"
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors duration-200"
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured NFTs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-sans text-3xl font-bold mb-8">
            Featured <span className="gradient-text">Collections</span>
          </h3>
          {featuredNFTs.length === 0 ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center my-12">
              <Star className="w-16 h-16 text-gold-400 mb-6" />
              <h4 className="font-sans text-2xl font-bold mb-2">No NFTs Available</h4>
              <p className="text-white/70 mb-4">Check back soon for exclusive NFT drops and collections.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredNFTs.map((nft, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass-card p-6 group"
                >
                  {/* NFT Image Placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <Star className="w-12 h-12 text-gold-400" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                        nft.rarity === 'Legendary' ? 'bg-gold-500/20 text-gold-400' :
                        nft.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                        nft.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {nft.rarity}
                      </span>
                    </div>
                  </div>

                  {/* NFT Details */}
                  <h4 className="font-display text-lg font-semibold mb-2 text-white group-hover:gradient-text transition-all duration-300">
                    {nft.name}
                  </h4>
                  <p className="text-white/60 mb-2 text-sm">{nft.category}</p>
                  <p className="text-lg font-bold gradient-text mb-4">{nft.price}</p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 py-2 rounded-lg font-display font-semibold text-white text-sm"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Marketplace Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-card p-8">
            <h3 className="font-display text-2xl font-bold mb-6 text-center gradient-text">
              Marketplace Activity
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white mb-2">Active</p>
                <p className="text-white/60 font-display">Total NFTs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-2">Growing</p>
                <p className="text-white/60 font-display">Collections</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-2">Live</p>
                <p className="text-white/60 font-display">Trading Volume</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-2">Expanding</p>
                <p className="text-white/60 font-display">User Base</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NFTMarketplace;