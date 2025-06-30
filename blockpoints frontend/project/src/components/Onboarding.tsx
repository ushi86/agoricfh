import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, User, Wallet, Trophy, Sparkles, Crown, Shield, Zap } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const onboardingSteps = [
    {
      id: 0,
      title: 'Welcome to BLOCKPOINTS',
      subtitle: 'Your Premium NFT Rewards Journey Begins',
      icon: Sparkles,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <p className="text-white/80 text-lg font-body leading-relaxed">
            Experience the future of blockchain-powered shopping rewards. Earn exclusive NFTs, unlock premium features, and join an elite community of digital collectors.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="glass-card p-4 text-center">
              <Trophy className="w-8 h-8 text-gold-400 mx-auto mb-2" />
              <p className="text-white/70 text-sm font-body">Premium Rewards</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white/70 text-sm font-body">Secure Platform</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white/70 text-sm font-body">Instant NFTs</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: 'Connect Your Wallet',
      subtitle: 'Secure Connection to Your Digital Assets',
      icon: Wallet,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <p className="text-white/80 font-body">
              Connect your preferred wallet to start earning NFT rewards and managing your digital collection.
            </p>
          </div>
          
          <div className="space-y-3">
            {['MetaMask', 'WalletConnect', 'Coinbase Wallet'].map((wallet, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                className="w-full glass-card p-4 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                  <span className="font-sans font-semibold text-white">{wallet}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60" />
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Create Your Profile',
      subtitle: 'Personalize Your BLOCKPOINTS Experience',
      icon: User,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 mb-2 font-sans">Display Name</label>
              <input
                type="text"
                placeholder="Enter your display name"
                className="w-full glass-card px-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-body"
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-2 font-sans">Email (Optional)</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full glass-card px-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-body"
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-2 font-sans">Preferred Tier</label>
              <select className="w-full glass-card px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-body">
                <option value="bronze">Bronze - Getting Started</option>
                <option value="silver">Silver - Active Shopper</option>
                <option value="gold">Gold - Premium Member</option>
                <option value="platinum">Platinum - Elite Status</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Tutorial Complete',
      subtitle: 'Ready to Start Your NFT Journey',
      icon: Trophy,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h3 className="font-display text-2xl font-bold gradient-text">Congratulations!</h3>
          <p className="text-white/80 text-lg font-body">
            You're all set to start earning exclusive NFT rewards with every purchase. Welcome to the BLOCKPOINTS community!
          </p>
          
          <div className="glass-card p-6 mt-8">
            <h4 className="font-sans font-semibold text-white mb-4">What's Next?</h4>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white/80 font-body">Browse partner stores and start shopping</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white/80 font-body">Earn your first NFT reward</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white/80 font-body">Explore premium features and tier benefits</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section id="onboarding" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <User className="w-4 h-4 text-gold-400" />
            <span className="font-sans text-sm font-medium text-white/90">
              Getting Started
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Welcome <span className="gradient-text">Onboarding</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-body">
            Let's get you set up with BLOCKPOINTS in just a few simple steps.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {onboardingSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index) ? 'bg-green-500' :
                  currentStep === index ? 'bg-gradient-to-r from-purple-500 to-cyan-500' :
                  'bg-white/10'
                }`}>
                  {completedSteps.includes(index) ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-sans font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    completedSteps.includes(index) ? 'bg-green-500' : 'bg-white/10'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h3 className="font-display text-3xl font-bold mb-2 text-white">
                  {onboardingSteps[currentStep].title}
                </h3>
                <p className="text-white/70 text-lg font-body">
                  {onboardingSteps[currentStep].subtitle}
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                {onboardingSteps[currentStep].content}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-sans font-semibold transition-all duration-200 ${
                currentStep === 0 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                  : 'glass-card text-white hover:bg-white/10'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </motion.button>

            <div className="text-center">
              <span className="text-white/60 font-mono">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 rounded-full font-sans font-semibold text-white"
            >
              <span>{currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Onboarding;