import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Network, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getTransferHistory } from '../utils/api';

const CrossChainBridge = () => {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransfers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getTransferHistory();
        if (response.success && response.data && response.data.transfers) {
          setTransfers(response.data.transfers);
        } else {
          setError('Failed to load transfer history');
        }
      } catch (err) {
        setError('Failed to load transfer history');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransfers();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading transfer history...</p>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 relative">
      <div>
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
            <ArrowRightLeft className="w-4 h-4 text-gold-400" />
            <span className="font-display text-sm font-medium text-white/90">
              Cross-Chain Bridge
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            Seamless <span className="gradient-text">NFT Transfers</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Transfer your NFTs across multiple blockchains with our advanced interoperability protocol.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Transfer Status */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Transfer History</h3>
            </div>
            <div className="space-y-4">
              {transfers.length === 0 ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center my-12">
                  <ArrowRightLeft className="w-16 h-16 text-gold-400 mb-6" />
                  <h4 className="font-sans text-2xl font-bold mb-2">No Bridge Activity</h4>
                  <p className="text-white/70 mb-4">No cross-chain transfers have been made yet. Start transferring your NFTs across chains!</p>
                </div>
              ) : (
                transfers.map((transfer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display font-semibold text-white">{transfer.nftId || transfer.nft || 'NFT'}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                        transfer.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        transfer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {transfer.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/60 text-sm">
                      <span>{transfer.userId}</span>
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>{transfer.targetChain}</span>
                      <span className="ml-auto text-gold-400 font-mono">{transfer.timestamp ? new Date(transfer.timestamp).toLocaleString() : ''}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CrossChainBridge;