import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { FaGem, FaShieldAlt, FaBolt, FaCrown, FaRocket, FaStar } from 'react-icons/fa';

const Hero = () => {
  const features = [
    { icon: FaCrown, label: 'Premium NFT Rewards', color: 'from-gold-400 to-gold-600' },
    { icon: FaShieldAlt, label: 'Secure Blockchain Platform', color: 'from-green-500 to-emerald-600' },
    { icon: FaBolt, label: 'Instant Cross-Chain Transfers', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: 180 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-gold-500/10 to-transparent rounded-full blur-2xl"
        />
        
        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <FaStar className="w-4 h-4 text-purple-400" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-4 mb-12 shadow-2xl"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-gold-400" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0"
            >
              <Sparkles className="w-6 h-6 text-gold-400 opacity-50" />
            </motion.div>
          </div>
          <span className="text-lg font-sans font-medium text-white/90">
            The website is being revamped and will be up soon
          </span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 bg-gold-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-sans text-6xl md:text-7xl lg:text-8xl font-bold mb-16 leading-tight tracking-tight"
        >
          <motion.span 
            className="gradient-text inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Block
          </motion.span>
          <motion.span 
            className="text-white inline-block ml-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            points
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl lg:text-4xl text-white/80 mb-20 max-w-4xl mx-auto leading-relaxed font-sans"
        >
          Revolutionary blockchain-powered platform rewarding shoppers with{' '}
          <motion.span 
            className="gradient-text font-semibold inline-block"
            whileHover={{ scale: 1.05 }}
          >
            exclusive NFTs
          </motion.span>. 
          Experience the future of digital shopping with cross-chain interoperability and smart contracts.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-8 sm:space-y-0 sm:space-x-10 mb-24"
        >
          <motion.button
            whileHover={{ 
              scale: 1.07, 
              boxShadow: "0 25px 50px rgba(168, 85, 247, 0.4)",
              y: -7
            }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-purple-500 to-cyan-500 px-16 py-7 rounded-full font-sans font-semibold text-white text-2xl flex items-center space-x-4 hover:shadow-2xl transition-all duration-300 shadow-lg shadow-purple-500/25"
          >
            <FaRocket className="w-6 h-6 group-hover:animate-bounce" />
            <span>Join the Revolution</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-200" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.07, y: -7 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card px-16 py-7 rounded-full font-sans font-semibold text-white text-2xl hover:bg-white/10 transition-all duration-300 shadow-lg backdrop-blur-2xl border border-white/20"
          >
            <span className="flex items-center space-x-3">
              <FaGem className="w-5 h-5" />
              <span>Discover Features</span>
            </span>
          </motion.button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, scale: 1.05 }}
              className="glass-card p-8 text-center group backdrop-blur-2xl border border-white/10 shadow-xl"
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <div className="font-display text-xl font-semibold gradient-text group-hover:scale-105 transition-transform duration-300">
                {feature.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-3 text-white/60"
          >
            <span className="font-display text-sm tracking-wide">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;