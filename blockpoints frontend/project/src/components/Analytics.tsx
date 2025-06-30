import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, Users, Zap } from 'lucide-react';

const Analytics = () => {
  const personalStats: any[] = [];
  const platformMetrics: any[] = [];

  return (
    <section id="analytics" className="py-24 relative">
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
            <BarChart3 className="w-4 h-4 text-gold-400" />
            <span className="font-display text-sm font-medium text-white/90">
              Analytics Dashboard
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Data <span className="gradient-text">Insights</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Track your progress and discover platform-wide trends with comprehensive analytics.
          </p>
        </motion.div>

        {/* Personal Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Your <span className="gradient-text">Performance</span>
          </h3>
          {personalStats.length === 0 && platformMetrics.length === 0 ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center my-12">
              <BarChart3 className="w-16 h-16 text-gold-400 mb-6" />
              <h4 className="font-sans text-2xl font-bold mb-2">No Analytics Data</h4>
              <p className="text-white/70 mb-4">Your analytics dashboard will appear here once you start using the platform.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {personalStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass-card p-6 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-display text-lg font-semibold mb-2 text-white">{stat.title}</h4>
                  <p className="text-2xl font-bold gradient-text mb-2">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Analytics Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spending Pattern Chart */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-display text-xl font-semibold text-white">Spending Patterns</h4>
              </div>
              <div className="h-48 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl flex items-center justify-center">
                <p className="text-white/60 font-display">Interactive chart showing spending trends over time</p>
              </div>
            </div>

            {/* NFT Collection Growth */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-display text-xl font-semibold text-white">Collection Growth</h4>
              </div>
              <div className="h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl flex items-center justify-center">
                <p className="text-white/60 font-display">Visual representation of NFT collection expansion</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-3xl font-bold mb-8 text-center">
            Platform <span className="gradient-text">Metrics</span>
          </h3>
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {platformMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${
                      index === 0 ? 'from-blue-500 to-cyan-500' :
                      index === 1 ? 'from-green-500 to-teal-500' :
                      index === 2 ? 'from-purple-500 to-pink-500' :
                      'from-gold-400 to-gold-600'
                    } rounded-xl flex items-center justify-center`}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h4 className="font-display text-lg font-semibold mb-2 text-white">{metric.label}</h4>
                  <p className="text-xl font-bold gradient-text mb-2">{metric.value}</p>
                  <div className="flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm font-mono">Positive Trend</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Insights Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-card p-8 text-center">
            <h3 className="font-display text-2xl font-bold mb-4 gradient-text">
              Analytics Summary
            </h3>
            <p className="text-white/80 mb-6 max-w-3xl mx-auto">
              Your engagement with BLOCKPOINTS shows consistent growth across all metrics. 
              Continue shopping with our partners to maximize your NFT rewards and tier progression.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 rounded-full font-display font-semibold text-white"
            >
              View Detailed Report
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Analytics;