import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Twitter, Github, Linkedin, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const footerLinks = [
    {
      title: 'Platform',
      links: ['Features', 'Dashboard', 'Shopping', 'Marketplace', 'Analytics'],
    },
    {
      title: 'Services',
      links: ['NFT Rewards', 'Cross-Chain Bridge', 'Collateral Staking', 'Premium Features'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Help Center', 'Community', 'API Reference'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press Kit'],
    },
  ];

  return (
    <footer className="relative py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <span className="font-sans font-bold text-3xl gradient-text">
                Blockpoints
              </span>
            </div>

            {/* Description */}
            <p className="text-white/70 text-xl leading-relaxed max-w-md">
              Revolutionary blockchain-powered platform rewarding shoppers with exclusive NFTs. 
              Experience the future of digital shopping with cross-chain interoperability and premium rewards.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 glass-card rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <h3 className="font-sans text-xl font-semibold text-white">
                  Stay Updated
                </h3>
              </div>
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 glass-card px-5 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 font-sans text-base"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-2xl font-sans font-semibold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200 text-base"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {footerLinks.map((section, index) => (
              <div key={index} className="space-y-6">
                <h3 className="font-sans text-xl font-semibold text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 4 }}
                        className="text-white/70 hover:text-white transition-colors duration-200 text-base font-sans"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <p className="text-white/60 text-lg">
            © 2024 Blockpoints. All rights reserved.
          </p>
          <div className="flex items-center space-x-8 text-lg text-white/60">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;