// BLOCKPOINTS Cross-Chain Bridge Smart Contract
// Handles NFT transfers between Agoric and other blockchains

import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';
import { makeZoe } from '@agoric/zoe';
import { makeContract } from '@agoric/contract-support';

const { details: X } = assert;

// Supported chains and their configurations
const SUPPORTED_CHAINS = {
  'ethereum': {
    name: 'Ethereum',
    chainId: 1,
    gasLimit: 300000,
    confirmations: 12,
    bridgeAddress: '0x1234567890123456789012345678901234567890'
  },
  'polygon': {
    name: 'Polygon',
    chainId: 137,
    gasLimit: 500000,
    confirmations: 256,
    bridgeAddress: '0x0987654321098765432109876543210987654321'
  },
  'binance': {
    name: 'Binance Smart Chain',
    chainId: 56,
    gasLimit: 400000,
    confirmations: 15,
    bridgeAddress: '0xabcdef1234567890abcdef1234567890abcdef12'
  },
  'arbitrum': {
    name: 'Arbitrum One',
    chainId: 42161,
    gasLimit: 350000,
    confirmations: 10,
    bridgeAddress: '0x3456789012345678901234567890123456789012'
  }
};

// Transfer statuses
const TRANSFER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Contract behavior
const makeBlockpointsBridgeContract = (zoe, privateArgs) => {
  const {
    nftIssuerKit,
    bridgeTokenIssuerKit,
    adminWallet,
    feeCollector
  } = privateArgs;

  // State management
  const state = {
    transferCounter: 0,
    transfers: new Map(), // transferId -> Transfer
    userTransfers: new Map(), // userId -> transferIds[]
    chainTransfers: new Map(), // chainId -> transferIds[]
    bridgeFees: AmountMath.make(bridgeTokenIssuerKit.brand, 0n),
    totalTransfers: 0,
    successfulTransfers: 0,
    failedTransfers: 0,
    paused: false,
    adminAddresses: [adminWallet],
    bridgeFee: 0.01, // 1% bridge fee
    minTransferAmount: 1,
    maxTransferAmount: 1000,
    supportedChains: Object.keys(SUPPORTED_CHAINS)
  };

  // Helper functions
  const generateTransferId = () => {
    return `bridge_${state.transferCounter++}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  };

  const validateTransfer = (userId, nftId, targetChain, amount) => {
    assert(!state.paused, 'Bridge is paused');
    assert(userId, 'User ID is required');
    assert(nftId, 'NFT ID is required');
    assert(targetChain, 'Target chain is required');
    assert(state.supportedChains.includes(targetChain), 'Unsupported target chain');
    assert(amount >= state.minTransferAmount, `Amount must be at least ${state.minTransferAmount}`);
    assert(amount <= state.maxTransferAmount, `Amount cannot exceed ${state.maxTransferAmount}`);
  };

  const calculateBridgeFee = (amount) => {
    return Math.ceil(amount * state.bridgeFee);
  };

  const createTransferRecord = (userId, nftId, targetChain, amount, recipientAddress) => {
    const transferId = generateTransferId();
    const bridgeFee = calculateBridgeFee(amount);
    
    const transfer = {
      transferId,
      userId,
      nftId,
      targetChain,
      amount,
      recipientAddress: recipientAddress || userId,
      bridgeFee,
      status: TRANSFER_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chainConfig: SUPPORTED_CHAINS[targetChain],
      transactionHash: null,
      confirmations: 0,
      metadata: {}
    };

    return transfer;
  };

  // Main contract methods
  const initiateTransfer = async (userId, nftId, targetChain, amount, recipientAddress = null) => {
    validateTransfer(userId, nftId, targetChain, amount);

    const transfer = createTransferRecord(userId, nftId, targetChain, amount, recipientAddress);
    
    // Store transfer
    state.transfers.set(transfer.transferId, transfer);
    
    // Update user transfers
    if (!state.userTransfers.has(userId)) {
      state.userTransfers.set(userId, []);
    }
    state.userTransfers.get(userId).push(transfer.transferId);
    
    // Update chain transfers
    if (!state.chainTransfers.has(targetChain)) {
      state.chainTransfers.set(targetChain, []);
    }
    state.chainTransfers.get(targetChain).push(transfer.transferId);
    
    state.totalTransfers++;

    // In a real implementation, this would trigger the actual bridge transaction
    // For now, we'll simulate the bridge process
    setTimeout(() => {
      processTransfer(transfer.transferId);
    }, 2000);

    return {
      transferId: transfer.transferId,
      status: transfer.status,
      bridgeFee: transfer.bridgeFee,
      estimatedTime: SUPPORTED_CHAINS[targetChain].confirmations * 15 // minutes
    };
  };

  const processTransfer = async (transferId) => {
    const transfer = state.transfers.get(transferId);
    if (!transfer || transfer.status !== TRANSFER_STATUS.PENDING) {
      return;
    }

    // Update status to processing
    transfer.status = TRANSFER_STATUS.PROCESSING;
    transfer.updatedAt = new Date().toISOString();
    state.transfers.set(transferId, transfer);

    try {
      // Simulate bridge transaction
      const transactionHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      
      // Simulate confirmation process
      let confirmations = 0;
      const maxConfirmations = transfer.chainConfig.confirmations;
      
      const confirmationInterval = setInterval(() => {
        confirmations++;
        transfer.confirmations = confirmations;
        transfer.updatedAt = new Date().toISOString();
        state.transfers.set(transferId, transfer);

        if (confirmations >= maxConfirmations) {
          clearInterval(confirmationInterval);
          completeTransfer(transferId, transactionHash);
        }
      }, 5000); // Simulate 5 seconds per confirmation

    } catch (error) {
      failTransfer(transferId, error.message);
    }
  };

  const completeTransfer = (transferId, transactionHash) => {
    const transfer = state.transfers.get(transferId);
    if (!transfer) return;

    transfer.status = TRANSFER_STATUS.COMPLETED;
    transfer.transactionHash = transactionHash;
    transfer.updatedAt = new Date().toISOString();
    state.transfers.set(transferId, transfer);
    
    state.successfulTransfers++;

    console.log(`Transfer ${transferId} completed successfully`);
  };

  const failTransfer = (transferId, error) => {
    const transfer = state.transfers.get(transferId);
    if (!transfer) return;

    transfer.status = TRANSFER_STATUS.FAILED;
    transfer.error = error;
    transfer.updatedAt = new Date().toISOString();
    state.transfers.set(transferId, transfer);
    
    state.failedTransfers++;

    console.log(`Transfer ${transferId} failed: ${error}`);
  };

  const cancelTransfer = async (transferId, userId) => {
    const transfer = state.transfers.get(transferId);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    assert(transfer.userId === userId, 'Only transfer owner can cancel');
    assert(transfer.status === TRANSFER_STATUS.PENDING, 'Can only cancel pending transfers');

    transfer.status = TRANSFER_STATUS.CANCELLED;
    transfer.updatedAt = new Date().toISOString();
    state.transfers.set(transferId, transfer);

    return { success: true, transferId, status: transfer.status };
  };

  const getTransferDetails = (transferId) => {
    return state.transfers.get(transferId);
  };

  const getUserTransfers = (userId, filters = {}) => {
    const userTransferIds = state.userTransfers.get(userId) || [];
    const transfers = userTransferIds
      .map(id => state.transfers.get(id))
      .filter(transfer => transfer !== undefined);

    // Apply filters
    let filteredTransfers = transfers;
    
    if (filters.status) {
      filteredTransfers = filteredTransfers.filter(t => t.status === filters.status);
    }
    
    if (filters.targetChain) {
      filteredTransfers = filteredTransfers.filter(t => t.targetChain === filters.targetChain);
    }
    
    if (filters.startDate) {
      filteredTransfers = filteredTransfers.filter(t => new Date(t.createdAt) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filteredTransfers = filteredTransfers.filter(t => new Date(t.createdAt) <= new Date(filters.endDate));
    }

    return {
      transfers: filteredTransfers,
      totalCount: filteredTransfers.length,
      totalAmount: filteredTransfers.reduce((sum, t) => sum + t.amount, 0)
    };
  };

  const getChainTransfers = (chainId, filters = {}) => {
    const chainTransferIds = state.chainTransfers.get(chainId) || [];
    const transfers = chainTransferIds
      .map(id => state.transfers.get(id))
      .filter(transfer => transfer !== undefined);

    // Apply filters
    let filteredTransfers = transfers;
    
    if (filters.status) {
      filteredTransfers = filteredTransfers.filter(t => t.status === filters.status);
    }

    return {
      transfers: filteredTransfers,
      totalCount: filteredTransfers.length,
      totalAmount: filteredTransfers.reduce((sum, t) => sum + t.amount, 0)
    };
  };

  const getBridgeStats = () => {
    const totalAmount = Array.from(state.transfers.values())
      .reduce((sum, t) => sum + t.amount, 0);

    const totalFees = Array.from(state.transfers.values())
      .reduce((sum, t) => sum + t.bridgeFee, 0);

    const chainStats = {};
    state.supportedChains.forEach(chain => {
      const chainTransfers = getChainTransfers(chain);
      chainStats[chain] = {
        totalTransfers: chainTransfers.totalCount,
        totalAmount: chainTransfers.totalAmount,
        successfulTransfers: chainTransfers.transfers.filter(t => t.status === TRANSFER_STATUS.COMPLETED).length,
        failedTransfers: chainTransfers.transfers.filter(t => t.status === TRANSFER_STATUS.FAILED).length
      };
    });

    return {
      totalTransfers: state.totalTransfers,
      successfulTransfers: state.successfulTransfers,
      failedTransfers: state.failedTransfers,
      totalAmount,
      totalFees,
      bridgeFee: state.bridgeFee,
      supportedChains: state.supportedChains,
      chainStats,
      paused: state.paused
    };
  };

  const getSupportedChains = () => {
    return Object.entries(SUPPORTED_CHAINS).map(([id, config]) => ({
      id,
      name: config.name,
      chainId: config.chainId,
      gasLimit: config.gasLimit,
      confirmations: config.confirmations
    }));
  };

  // Admin functions
  const pauseBridge = (adminWallet) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    state.paused = true;
    return { success: true, paused: true };
  };

  const unpauseBridge = (adminWallet) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    state.paused = false;
    return { success: true, paused: false };
  };

  const updateBridgeFee = (adminWallet, newFee) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    assert(newFee >= 0 && newFee <= 0.1, 'Bridge fee must be between 0% and 10%');
    state.bridgeFee = newFee;
    return { success: true, bridgeFee: newFee };
  };

  const updateTransferLimits = (adminWallet, minAmount, maxAmount) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    assert(minAmount > 0, 'Minimum amount must be positive');
    assert(maxAmount > minAmount, 'Maximum amount must be greater than minimum');
    state.minTransferAmount = minAmount;
    state.maxTransferAmount = maxAmount;
    return { 
      success: true, 
      minTransferAmount: minAmount, 
      maxTransferAmount: maxAmount 
    };
  };

  const addSupportedChain = (adminWallet, chainId, config) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    assert(config.name && config.chainId, 'Chain configuration is incomplete');
    
    SUPPORTED_CHAINS[chainId] = config;
    state.supportedChains.push(chainId);
    
    return { success: true, supportedChains: state.supportedChains };
  };

  const collectBridgeFees = (adminWallet) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    const fees = state.bridgeFees;
    state.bridgeFees = AmountMath.make(bridgeTokenIssuerKit.brand, 0n);
    return { success: true, fees };
  };

  // Return public interface
  return {
    // User functions
    initiateTransfer,
    cancelTransfer,
    getTransferDetails,
    getUserTransfers,
    
    // Query functions
    getBridgeStats,
    getSupportedChains,
    getChainTransfers,
    
    // Admin functions
    pauseBridge,
    unpauseBridge,
    updateBridgeFee,
    updateTransferLimits,
    addSupportedChain,
    collectBridgeFees,
    
    // State access (for testing)
    getState: () => ({ ...state }),
    
    // Issuer access
    getBridgeTokenIssuer: () => bridgeTokenIssuerKit.issuer
  };
};

// Contract installation
const start = async (zcf) => {
  const { nftIssuerKit, bridgeTokenIssuerKit, adminWallet, feeCollector } = zcf.getTerms();

  const contract = makeBlockpointsBridgeContract(zcf, {
    nftIssuerKit,
    bridgeTokenIssuerKit,
    adminWallet,
    feeCollector
  });

  // Return public API
  return {
    publicAPI: {
      initiateTransfer: contract.initiateTransfer,
      cancelTransfer: contract.cancelTransfer,
      getTransferDetails: contract.getTransferDetails,
      getUserTransfers: contract.getUserTransfers,
      getBridgeStats: contract.getBridgeStats,
      getSupportedChains: contract.getSupportedChains,
      getChainTransfers: contract.getChainTransfers,
      pauseBridge: contract.pauseBridge,
      unpauseBridge: contract.unpauseBridge,
      updateBridgeFee: contract.updateBridgeFee,
      updateTransferLimits: contract.updateTransferLimits,
      addSupportedChain: contract.addSupportedChain,
      collectBridgeFees: contract.collectBridgeFees
    }
  };
};

export { start }; 