import { makeMint } from '@agoric/ertp';
import { Far } from '@endo/far';
import { E } from '@endo/eventual-send';

export const start = async (zcf) => {
  const { mint: nftMint, issuer: nftIssuer } = makeMint('NFT');
  const { mint: collateralMint, issuer: collateralIssuer } = makeMint('Collateral');

  const userNFTs = new Map();
  const userCollateral = new Map();

  const mintNFT = (userId, metadata) => {
    const nft = nftMint.mintPayment({ userId, metadata });
    if (!userNFTs.has(userId)) userNFTs.set(userId, []);
    userNFTs.get(userId).push(nft);
    return nft;
  };

  const lockCollateral = (userId, amount) => {
    const collateral = collateralMint.mintPayment({ userId, amount });
    if (!userCollateral.has(userId)) userCollateral.set(userId, 0);
    userCollateral.set(userId, userCollateral.get(userId) + amount);
    return collateral;
  };

  const transferNFT = async (userId, nft, targetChain) => {
    console.log(`Transferring NFT to ${targetChain} for user ${userId}`);
  };

  const liquidateCollateral = (userId) => {
    const collateralAmount = userCollateral.get(userId);
    if (collateralAmount > 0) {
      console.log(`Liquidating collateral for user ${userId}`);
      userCollateral.set(userId, 0);
    }
  };

  zcf.makeInvitation(() => {
    const userId = zcfSeat.getCurrentAllocation().userId;
    const metadata = zcfSeat.getCurrentAllocation().metadata;
    return mintNFT(userId, metadata);
  }, 'Mint NFT');

  zcf.makeInvitation(() => {
    const userId = zcfSeat.getCurrentAllocation().userId;
    const amount = zcfSeat.getCurrentAllocation().amount;
    return lockCollateral(userId, amount);
  }, 'Lock Collateral');

  return { nftIssuer, collateralIssuer };
};