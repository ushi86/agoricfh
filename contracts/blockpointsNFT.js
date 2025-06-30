import { makeMint } from '@agoric/ertp';
import { Far } from '@endo/far';
import { E } from '@endo/eventual-send';
import { makeZoeKit } from '@agoric/zoe';
import { makeNotifierKit } from '@agoric/notifier';

const { zoeService } = makeZoeKit();

export const start = async (zcf) => {
  // Create mints for NFTs and collateral tokens
  const { mint: nftMint, issuer: nftIssuer, brand: nftBrand } = makeMint('BLOCKPOINTS_NFT');
  const { mint: collateralMint, issuer: collateralIssuer, brand: collateralBrand } = makeMint('BLOCKPOINTS_COLLATERAL');
  const { mint: rewardMint, issuer: rewardIssuer, brand: rewardBrand } = makeMint('BLOCKPOINTS_REWARDS');

  // Storage for user data
  const userNFTs = new Map();
  const userCollateral = new Map();
  const userRewards = new Map();
  const userProfiles = new Map();
  const nftMetadata = new Map();

  // Notifier for real-time updates
  const { notifier: updatesNotifier, updater: updatesUpdater } = makeNotifierKit();

  // Helper function to create user profile
  const createUserProfile = (userId, userData = {}) => {
    const profile = {
      userId,
      joinDate: new Date().toISOString(),
      totalSpent: 0,
      totalRewards: 0,
      nftCount: 0,
      tier: 'BRONZE',
      ...userData
    };
    userProfiles.set(userId, profile);
    return profile;
  };

  // Mint NFT for user
  const mintNFT = (userId, metadata) => {
    const nftId = `nft_${userId}_${Date.now()}`;
    const nft = nftMint.mintPayment({ 
      userId, 
      nftId,
      metadata: {
        name: metadata.name || 'BLOCKPOINTS NFT',
        description: metadata.description || 'Earned through shopping',
        image: metadata.image || '',
        attributes: metadata.attributes || {},
        tier: metadata.tier || 'BRONZE',
        mintDate: new Date().toISOString(),
        ...metadata
      }
    });

    if (!userNFTs.has(userId)) {
      userNFTs.set(userId, []);
    }
    userNFTs.get(userId).push({ nftId, nft, metadata: nft.value[0].metadata });
    nftMetadata.set(nftId, nft.value[0].metadata);

    // Update user profile
    const profile = userProfiles.get(userId) || createUserProfile(userId);
    profile.nftCount += 1;
    userProfiles.set(userId, profile);

    // Notify updates
    updatesUpdater.updateState({
      type: 'NFT_MINTED',
      userId,
      nftId,
      metadata: nft.value[0].metadata
    });

    return { nftId, nft, metadata: nft.value[0].metadata };
  };

  // Lock collateral for premium features
  const lockCollateral = (userId, amount) => {
    const collateralId = `collateral_${userId}_${Date.now()}`;
    const collateral = collateralMint.mintPayment({ 
      userId, 
      collateralId,
      amount,
      lockDate: new Date().toISOString()
    });

    if (!userCollateral.has(userId)) {
      userCollateral.set(userId, []);
    }
    userCollateral.get(userId).push({ collateralId, collateral, amount });

    updatesUpdater.updateState({
      type: 'COLLATERAL_LOCKED',
      userId,
      collateralId,
      amount
    });

    return { collateralId, collateral, amount };
  };

  // Unlock collateral
  const unlockCollateral = (userId, collateralId) => {
    const userCollaterals = userCollateral.get(userId) || [];
    const collateralIndex = userCollaterals.findIndex(c => c.collateralId === collateralId);
    
    if (collateralIndex === -1) {
      throw new Error('Collateral not found');
    }

    const collateral = userCollaterals[collateralIndex];
    userCollaterals.splice(collateralIndex, 1);
    userCollateral.set(userId, userCollaterals);

    updatesUpdater.updateState({
      type: 'COLLATERAL_UNLOCKED',
      userId,
      collateralId
    });

    return collateral;
  };

  // Award rewards for shopping
  const awardRewards = (userId, amount, reason = 'shopping') => {
    const rewardId = `reward_${userId}_${Date.now()}`;
    const reward = rewardMint.mintPayment({ 
      userId, 
      rewardId,
      amount,
      reason,
      awardDate: new Date().toISOString()
    });

    if (!userRewards.has(userId)) {
      userRewards.set(userId, []);
    }
    userRewards.get(userId).push({ rewardId, reward, amount, reason });

    // Update user profile
    const profile = userProfiles.get(userId) || createUserProfile(userId);
    profile.totalRewards += amount;
    userProfiles.set(userId, profile);

    updatesUpdater.updateState({
      type: 'REWARDS_AWARDED',
      userId,
      rewardId,
      amount,
      reason
    });

    return { rewardId, reward, amount, reason };
  };

  // Transfer NFT (placeholder for cross-chain functionality)
  const transferNFT = async (userId, nftId, targetChain) => {
    const userNFTsList = userNFTs.get(userId) || [];
    const nftIndex = userNFTsList.findIndex(n => n.nftId === nftId);
    
    if (nftIndex === -1) {
      throw new Error('NFT not found');
    }

    updatesUpdater.updateState({
      type: 'NFT_TRANSFER_INITIATED',
      userId,
      nftId,
      targetChain
    });

    // TODO: Implement actual cross-chain transfer logic
    console.log(`Transferring NFT ${nftId} to ${targetChain} for user ${userId}`);
    
    return { success: true, nftId, targetChain };
  };

  // Get user profile
  const getUserProfile = (userId) => {
    return userProfiles.get(userId) || createUserProfile(userId);
  };

  // Get user NFTs
  const getUserNFTs = (userId) => {
    return userNFTs.get(userId) || [];
  };

  // Get user collateral
  const getUserCollateral = (userId) => {
    return userCollateral.get(userId) || [];
  };

  // Get user rewards
  const getUserRewards = (userId) => {
    return userRewards.get(userId) || [];
  };

  // Update user tier based on activity
  const updateUserTier = (userId) => {
    const profile = userProfiles.get(userId);
    if (!profile) return null;

    let newTier = 'BRONZE';
    if (profile.totalSpent >= 10000) newTier = 'PLATINUM';
    else if (profile.totalSpent >= 5000) newTier = 'GOLD';
    else if (profile.totalSpent >= 1000) newTier = 'SILVER';

    profile.tier = newTier;
    userProfiles.set(userId, profile);

    updatesUpdater.updateState({
      type: 'TIER_UPDATED',
      userId,
      newTier
    });

    return newTier;
  };

  // Liquidate collateral (for default scenarios)
  const liquidateCollateral = (userId) => {
    const userCollaterals = userCollateral.get(userId) || [];
    const totalCollateral = userCollaterals.reduce((sum, c) => sum + c.amount, 0);
    
    if (totalCollateral > 0) {
      userCollateral.set(userId, []);
      
      updatesUpdater.updateState({
        type: 'COLLATERAL_LIQUIDATED',
        userId,
        totalCollateral
      });
    }

    return totalCollateral;
  };

  // Create Zoe invitations
  const mintNFTInvitation = zcf.makeInvitation(
    (seat) => {
      const { userId, metadata } = seat.getCurrentAllocation();
      return mintNFT(userId, metadata);
    },
    'Mint NFT'
  );

  const lockCollateralInvitation = zcf.makeInvitation(
    (seat) => {
      const { userId, amount } = seat.getCurrentAllocation();
      return lockCollateral(userId, amount);
    },
    'Lock Collateral'
  );

  const awardRewardsInvitation = zcf.makeInvitation(
    (seat) => {
      const { userId, amount, reason } = seat.getCurrentAllocation();
      return awardRewards(userId, amount, reason);
    },
    'Award Rewards'
  );

  // Public API
  const publicAPI = Far('BLOCKPOINTS API', {
    mintNFT,
    lockCollateral,
    unlockCollateral,
    awardRewards,
    transferNFT,
    getUserProfile,
    getUserNFTs,
    getUserCollateral,
    getUserRewards,
    updateUserTier,
    liquidateCollateral,
    getUpdatesNotifier: () => updatesNotifier,
    getIssuers: () => ({ nftIssuer, collateralIssuer, rewardIssuer }),
    getBrands: () => ({ nftBrand, collateralBrand, rewardBrand })
  });

  return {
    publicAPI,
    nftIssuer,
    collateralIssuer,
    rewardIssuer,
    nftBrand,
    collateralBrand,
    rewardBrand,
    invitations: {
      mintNFT: mintNFTInvitation,
      lockCollateral: lockCollateralInvitation,
      awardRewards: awardRewardsInvitation
    }
  };
}; 