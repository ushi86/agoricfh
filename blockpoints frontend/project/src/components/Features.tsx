import React from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaLock, FaExchangeAlt, FaGlobe, FaBolt, FaShieldAlt, FaRocket, FaStar, FaGem, FaMagic } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: FaCrown,
      title: 'Premium NFT Rewards',
      description: 'Earn exclusive, tier-based NFTs as luxury badges, rare collectibles, and proof of your shopping achievements with every purchase.',
      gradient: 'from-gold-400 to-gold-600',
      delay: 0,
    },
    {
      icon: FaLock,
      title: 'Collateral Staking',
      description: 'Stake tokens to unlock premium features, exclusive deals, and enhanced shopping experiences with higher reward multipliers.',
      gradient: 'from-cyan-500 to-blue-500',
      delay: 0.1,
    },
    {
      icon: FaExchangeAlt,
      title: 'Cross-Chain Mastery',
      description: 'Transfer your NFT collection seamlessly across multiple blockchains with our advanced interoperability protocol.',
      gradient: 'from-green-500 to-teal-500',
      delay: 0.2,
    },
    {
      icon: FaBolt,
      title: 'Smart Contract Power',
      description: 'Powered by Agoric platform for secure NFT minting, automated collateral management, and seamless operations.',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.3,
    },
    {
      icon: FaShieldAlt,
      title: 'Enterprise Security',
      description: 'Built on robust blockchain infrastructure ensuring maximum security and infinite scalability for all users.',
      gradient: 'from-indigo-500 to-purple-500',
      delay: 0.4,
    },
    {
      icon: FaGlobe,
      title: 'Global Accessibility',
      description: 'Access the platform from anywhere in the world with our decentralized architecture and multi-language support.',
      gradient: 'from-pink-500 to-rose-500',
      delay: 0.5,
    },
  ];

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-4 mb-8 shadow-xl"
          >
            <FaMagic className="w-5 h-5 text-gold-400" />
            <span className="font-sans text-base font-medium text-white/90">
              Revolutionary Features
            </span>
          </motion.div>
          
          <h2 className="font-sans text-6xl md:text-7xl lg:text-8xl font-bold mb-14">
            <span className="gradient-text">Extraordinary</span> Capabilities
          </h2>
          <p className="text-2xl md:text-3xl text-white/80 max-w-5xl mx-auto leading-relaxed font-sans mb-16">
            Discover the cutting-edge features that make Blockpoints the pinnacle of blockchain-powered shopping rewards and digital asset management.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
              whileHover={{ y: -18, scale: 1.07 }}
              className="group glass-card p-14 hover:bg-white/10 transition-all duration-500 relative overflow-hidden backdrop-blur-2xl border border-white/10 shadow-2xl"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer"></div>
              </div>

              {/* Icon */}
              <div className={`w-28 h-28 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 relative z-10 shadow-lg`}>
                <feature.icon className="w-14 h-14 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-sans text-3xl md:text-4xl font-semibold mb-8 text-white group-hover:gradient-text transition-all duration-500 relative z-10">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed text-xl relative z-10 font-sans">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              
              {/* Corner Accent */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <FaStar className="w-4 h-4 text-gold-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <motion.button
            whileHover={{ 
              scale: 1.07, 
              boxShadow: "0 25px 50px rgba(168, 85, 247, 0.3)",
              y: -7 
            }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-purple-500 to-cyan-500 px-20 py-7 rounded-full font-sans font-semibold text-white text-2xl hover:shadow-2xl transition-all duration-300 shadow-lg shadow-purple-500/25 mt-16"
          >
            <span className="flex items-center space-x-3">
              <FaRocket className="w-6 h-6 group-hover:animate-bounce" />
              <span>Explore All Features</span>
              <FaGem className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;