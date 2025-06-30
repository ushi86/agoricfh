import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, Crown, Trophy, Zap } from 'lucide-react';

const UserTestimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      tier: 'Platinum Member',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'BLOCKPOINTS has completely transformed my shopping experience. The NFT rewards are incredible and the cross-chain functionality is seamless.',
      nftsOwned: 'Premium Collector',
      joinedDate: 'Early Adopter'
    },
    {
      name: 'Marcus Rodriguez',
      tier: 'Gold Member',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'The gamification elements and tier system keep me engaged. Every purchase feels rewarding with the exclusive NFT drops.',
      nftsOwned: 'Active Trader',
      joinedDate: 'Beta Tester'
    },
    {
      name: 'Emma Thompson',
      tier: 'Diamond Member',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'The premium features unlocked through collateral staking are worth every token. The exclusive deals are amazing!',
      nftsOwned: 'Elite Collector',
      joinedDate: 'Founding Member'
    }
  ];

  const stats = [
    { icon: Trophy, label: 'Satisfied Users', value: 'Growing Community' },
    { icon: Star, label: 'Average Rating', value: 'Excellent Reviews' },
    { icon: Crown, label: 'Premium Members', value: 'Elite Status' },
    { icon: Zap, label: 'NFTs Minted', value: 'Active Ecosystem' }
  ];

  return (
    <section id="testimonials" className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
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
            <Quote className="w-4 h-4 text-gold-400" />
            <span className="font-sans text-sm font-medium text-white/90">
              User Testimonials
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            What Our <span className="gradient-text">Community Says</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-body">
            Hear from our premium members about their experience with BLOCKPOINTS and how NFT rewards have transformed their shopping journey.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-8 group relative overflow-hidden"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer"></div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center space-x-1 mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-white/80 mb-6 text-lg leading-relaxed font-body relative z-10">
                "{testimonial.text}"
              </blockquote>

              {/* User Info */}
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gold-400 text-sm font-mono">{testimonial.tier}</p>
                </div>
              </div>

              {/* Member Stats */}
              <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-body">{testimonial.nftsOwned}</span>
                  <span className="text-purple-400 font-mono">{testimonial.joinedDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-8">
            <h3 className="font-display text-3xl font-bold mb-8 text-center gradient-text">
              Community Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-sans text-lg font-semibold mb-2 text-white">{stat.label}</h4>
                  <p className="text-2xl font-bold gradient-text font-display">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h3 className="font-display text-3xl font-bold mb-6 gradient-text">
              Join Our Premium Community
            </h3>
            <p className="text-white/80 mb-8 text-lg font-body">
              Become part of an exclusive community of blockchain enthusiasts and start earning premium NFT rewards today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 px-10 py-4 rounded-full font-sans font-semibold text-white text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UserTestimonials;