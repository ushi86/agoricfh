import { makeMint } from '@agoric/ertp';
import { Far } from '@endo/far';
import { E } from '@endo/eventual-send';
import { makeZoeKit } from '@agoric/zoe';
import { makeNotifierKit } from '@agoric/notifier';
import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';
import { makeContract } from '@agoric/contract-support';

const { zoeService } = makeZoeKit();
const { details: X } = assert;

// NFT Metadata structure
const createNFTMetadata = (name, description, image, attributes, tier) => {
  return {
    name,
    description,
    image,
    attributes: attributes || {},
    tier,
    mintDate: new Date().toISOString(),
    contractVersion: '2.0.0'
  };
};

// Tier definitions with requirements
const TIER_DEFINITIONS = {
  BRONZE: { minSpent: 0, rewardMultiplier: 1.0, maxNFTs: 5 },
  SILVER: { minSpent: 1000, rewardMultiplier: 1.2, maxNFTs: 10 },
  GOLD: { minSpent: 5000, rewardMultiplier: 1.5, maxNFTs: 20 },
  PLATINUM: { minSpent: 10000, rewardMultiplier: 2.0, maxNFTs: 50 },
  DIAMOND: { minSpent: 25000, rewardMultiplier: 3.0, maxNFTs: 100 }
};

// Contract behavior
const makeBlockpointsNFTContract = (zoe, privateArgs) => {
  const {
    nftIssuerKit,
    rewardIssuerKit,
    adminWallet,
    feeCollector
  } = privateArgs;

  // State management
  const state = {
    nftCounter: 0,
    userNFTs: new Map(), // userId -> NFT[]
    userTiers: new Map(), // userId -> tier
    userSpending: new Map(), // userId -> totalSpent
    tierNFTs: new Map(), // tier -> NFT[]
    mintingFees: AmountMath.make(nftIssuerKit.brand, 0n),
    totalMinted: 0,
    paused: false,
    adminAddresses: [adminWallet],
    feeRate: 0.05 // 5% fee
  };

  // Helper functions
  const getUserTier = (userId) => {
    const totalSpent = state.userSpending.get(userId) || 0;
    let currentTier = 'BRONZE';
    
    for (const [tier, definition] of Object.entries(TIER_DEFINITIONS)) {
      if (totalSpent >= definition.minSpent) {
        currentTier = tier;
      } else {
        break;
      }
    }
    
    return currentTier;
  };

  const canMintNFT = (userId, tier) => {
    const userNFTs = state.userNFTs.get(userId) || [];
    const tierDefinition = TIER_DEFINITIONS[tier];
    return userNFTs.length < tierDefinition.maxNFTs;
  };

  const calculateReward = (spendingAmount, tier) => {
    const tierDefinition = TIER_DEFINITIONS[tier];
    return Math.floor(spendingAmount * tierDefinition.rewardMultiplier);
  };

  // Main contract methods
  const mintNFT = async (userId, metadata, shoppingData = {}) => {
    assert(!state.paused, 'Contract is paused');
    assert(userId, 'User ID is required');
    assert(metadata.name, 'NFT name is required');

    const userTier = getUserTier(userId);
    assert(canMintNFT(userId, userTier), `Cannot mint more NFTs for ${userTier} tier`);

    // Create NFT
    const nftId = `nft_${state.nftCounter++}`;
    const nftMetadata = createNFTMetadata(
      metadata.name,
      metadata.description,
      metadata.image,
      metadata.attributes,
      userTier
    );

    // Mint NFT
    const nftAmount = AmountMath.make(nftIssuerKit.brand, 1n);
    const nftPayment = await nftIssuerKit.mint.mintPayment(nftAmount);
    
    const nft = {
      nftId,
      metadata: nftMetadata,
      userId,
      tier: userTier,
      mintDate: new Date().toISOString(),
      shoppingData
    };

    // Update state
    if (!state.userNFTs.has(userId)) {
      state.userNFTs.set(userId, []);
    }
    state.userNFTs.get(userId).push(nft);
    
    if (!state.tierNFTs.has(userTier)) {
      state.tierNFTs.set(userTier, []);
    }
    state.tierNFTs.get(userTier).push(nft);
    
    state.totalMinted++;
    state.userTiers.set(userId, userTier);

    // Calculate and mint rewards
    const rewardAmount = calculateReward(shoppingData.amount || 0, userTier);
    if (rewardAmount > 0) {
      const rewardPayment = await rewardIssuerKit.mint.mintPayment(
        AmountMath.make(rewardIssuerKit.brand, BigInt(rewardAmount))
      );
      
      return {
        nftId,
        nft: nftPayment,
        metadata: nftMetadata,
        rewardAmount,
        rewardPayment,
        tier: userTier
      };
    }

    return {
      nftId,
      nft: nftPayment,
      metadata: nftMetadata,
      tier: userTier
    };
  };

  const transferNFT = async (fromUserId, toUserId, nftId) => {
    assert(!state.paused, 'Contract is paused');
    assert(fromUserId && toUserId, 'Both user IDs are required');
    assert(nftId, 'NFT ID is required');

    const userNFTs = state.userNFTs.get(fromUserId) || [];
    const nftIndex = userNFTs.findIndex(nft => nft.nftId === nftId);
    assert(nftIndex !== -1, 'NFT not found');

    const nft = userNFTs[nftIndex];
    
    // Remove from sender
    userNFTs.splice(nftIndex, 1);
    
    // Add to receiver
    if (!state.userNFTs.has(toUserId)) {
      state.userNFTs.set(toUserId, []);
    }
    state.userNFTs.get(toUserId).push(nft);

    return { success: true, nft };
  };

  const crossChainTransfer = async (userId, nftId, targetChain, recipientAddress) => {
    assert(!state.paused, 'Contract is paused');
    assert(userId && nftId && targetChain, 'Missing required parameters');

    const userNFTs = state.userNFTs.get(userId) || [];
    const nft = userNFTs.find(nft => nft.nftId === nftId);
    assert(nft, 'NFT not found');

    // Create transfer record
    const transferId = `transfer_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const transfer = {
      transferId,
      userId,
      nftId,
      targetChain,
      recipientAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
      nft
    };

    // In a real implementation, this would trigger cross-chain bridge
    // For now, we'll simulate the transfer
    setTimeout(() => {
      transfer.status = 'completed';
      console.log(`Cross-chain transfer ${transferId} completed`);
    }, 5000);

    return transfer;
  };

  const updateUserSpending = async (userId, amount) => {
    assert(!state.paused, 'Contract is paused');
    assert(userId && amount > 0, 'Valid user ID and amount required');

    const currentSpending = state.userSpending.get(userId) || 0;
    const newSpending = currentSpending + amount;
    state.userSpending.set(userId, newSpending);

    // Check for tier upgrade
    const newTier = getUserTier(userId);
    const currentTier = state.userTiers.get(userId) || 'BRONZE';
    
    if (newTier !== currentTier) {
      state.userTiers.set(userId, newTier);
      return { 
        tierUpgraded: true, 
        oldTier: currentTier, 
        newTier,
        totalSpent: newSpending
      };
    }

    return { 
      tierUpgraded: false, 
      currentTier: newTier,
      totalSpent: newSpending
    };
  };

  const getUserProfile = (userId) => {
    const nfts = state.userNFTs.get(userId) || [];
    const tier = state.userTiers.get(userId) || 'BRONZE';
    const totalSpent = state.userSpending.get(userId) || 0;
    const totalRewards = nfts.reduce((sum, nft) => sum + (nft.shoppingData?.rewardAmount || 0), 0);

    return {
      userId,
      tier,
      totalSpent,
      totalRewards,
      nftCount: nfts.length,
      nfts,
      joinDate: nfts.length > 0 ? nfts[0].mintDate : new Date().toISOString()
    };
  };

  const getPlatformStats = () => {
    return {
      totalUsers: state.userNFTs.size,
      totalNFTs: state.totalMinted,
      totalSpending: Array.from(state.userSpending.values()).reduce((sum, spent) => sum + spent, 0),
      tierDistribution: Object.fromEntries(
        Object.keys(TIER_DEFINITIONS).map(tier => [
          tier, 
          (state.tierNFTs.get(tier) || []).length
        ])
      ),
      mintingFees: state.mintingFees,
      paused: state.paused
    };
  };

  // Admin functions
  const pauseContract = (adminWallet) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    state.paused = true;
    return { success: true, paused: true };
  };

  const unpauseContract = (adminWallet) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    state.paused = false;
    return { success: true, paused: false };
  };

  const addAdmin = (adminWallet, newAdmin) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    state.adminAddresses.push(newAdmin);
    return { success: true, admins: state.adminAddresses };
  };

  const updateFeeRate = (adminWallet, newFeeRate) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    assert(newFeeRate >= 0 && newFeeRate <= 0.1, 'Fee rate must be between 0% and 10%');
    state.feeRate = newFeeRate;
    return { success: true, feeRate: newFeeRate };
  };

  const collectFees = (adminWallet) => {
    assert(state.adminAddresses.includes(adminWallet), 'Admin access required');
    const fees = state.mintingFees;
    state.mintingFees = AmountMath.make(nftIssuerKit.brand, 0n);
    return { success: true, fees };
  };

  // Return public interface
  return {
    // User functions
    mintNFT,
    transferNFT,
    crossChainTransfer,
    updateUserSpending,
    getUserProfile,
    
    // Query functions
    getPlatformStats,
    getUserTier,
    canMintNFT,
    
    // Admin functions
    pauseContract,
    unpauseContract,
    addAdmin,
    updateFeeRate,
    collectFees,
    
    // State access (for testing)
    getState: () => ({ ...state }),
    
    // Issuer access
    getNFTIssuer: () => nftIssuerKit.issuer,
    getRewardIssuer: () => rewardIssuerKit.issuer
  };
};

// Contract installation
const start = async (zcf) => {
  const { nftIssuerKit, rewardIssuerKit, adminWallet, feeCollector } = zcf.getTerms();

  const contract = makeBlockpointsNFTContract(zcf, {
    nftIssuerKit,
    rewardIssuerKit,
    adminWallet,
    feeCollector
  });

  // Return public API
  return {
    publicAPI: {
      mintNFT: contract.mintNFT,
      transferNFT: contract.transferNFT,
      crossChainTransfer: contract.crossChainTransfer,
      updateUserSpending: contract.updateUserSpending,
      getUserProfile: contract.getUserProfile,
      getPlatformStats: contract.getPlatformStats,
      getUserTier: contract.getUserTier,
      canMintNFT: contract.canMintNFT,
      pauseContract: contract.pauseContract,
      unpauseContract: contract.unpauseContract,
      addAdmin: contract.addAdmin,
      updateFeeRate: contract.updateFeeRate,
      collectFees: contract.collectFees
    }
  };
};

export { start }; 