import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Coins, Wallet, ArrowRight, Crown, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: ShoppingBag,
      title: 'Shop & Discover',
      description: 'Browse premium partner retailers and make purchases to automatically earn exclusive NFT rewards with every transaction.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Crown,
      title: 'Mint & Collect',
      description: 'Premium NFTs are instantly minted and delivered to your wallet, building your unique digital collection and tier status.',
      color: 'from-gold-400 to-gold-600',
    },
    {
      icon: Wallet,
      title: 'Manage & Transfer',
      description: 'View your exclusive NFT collection, transfer across blockchains, or stake collateral for premium platform features.',
      color: 'from-green-500 to-teal-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-6"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="font-sans text-sm font-medium text-white/90">
              Simple Process
            </span>
          </motion.div>

          <h2 className="font-sans text-5xl md:text-6xl font-bold mb-12">
            How <span className="gradient-text">Blockpoints</span> Works
          </h2>
          <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-sans mb-14">
            Experience the seamless integration of blockchain technology with luxury shopping in three elegant steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-gold-400 to-green-500 opacity-30 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-14">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Step Indicator */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-sans font-bold text-xl z-10">
                  {index + 1}
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -14, scale: 1.07 }}
                  className="glass-card p-14 pt-20 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer"></div>
                  </div>

                  {/* Icon */}
                  <div className={`w-28 h-28 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <step.icon className="w-14 h-14 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-sans text-4xl font-semibold mb-8 text-white group-hover:gradient-text transition-all duration-300 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed text-xl relative z-10 font-sans">
                    {step.description}
                  </p>
                </motion.div>

                {/* Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-gold-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="glass-card p-12 max-w-5xl mx-auto relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20"></div>
            </div>

            <div className="relative z-10">
              <h3 className="font-sans text-4xl font-bold mb-8 gradient-text">
                Ready to Start Your Premium NFT Journey?
              </h3>
              <p className="text-white/80 mb-10 text-2xl leading-relaxed font-sans">
                Join the exclusive community of early adopters who are already experiencing the future of blockchain-powered luxury shopping rewards.
              </p>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 px-16 py-6 rounded-full font-sans font-semibold text-white text-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
              >
                Begin Your Journey
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;