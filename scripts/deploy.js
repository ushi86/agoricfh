import { makeAgoricClient } from '@agoric/cosmic-proto';
import { makeWalletConnection } from '@agoric/wallet-connection';
import { makeZoeKit } from '@agoric/zoe';
import { makeNotifierKit } from '@agoric/notifier';
import { Far } from '@endo/far';
import { E } from '@endo/eventual-send';

// Import our contract
import { start as blockpointsNFTStart } from '../contracts/blockpointsNFT.js';

const deployContracts = async () => {
  try {
    console.log('🚀 Starting BLOCKPOINTS deployment...');
    
    // Initialize Agoric client
    const client = await makeAgoricClient({
      rpc: process.env.AGORIC_RPC || 'http://localhost:26657',
      api: process.env.AGORIC_API || 'http://localhost:1317',
      chainId: process.env.AGORIC_CHAIN_ID || 'blockpoints-1'
    });

    // Initialize wallet connection
    const walletConnection = makeWalletConnection(client);
    
    // Initialize Zoe
    const { zoeService } = makeZoeKit();
    
    console.log('📦 Deploying BLOCKPOINTS NFT Contract...');
    
    // Deploy the NFT contract
    const contractBundle = {
      moduleFormat: 'endoZipBase64',
      endoZipBase64: await bundleContract(blockpointsNFTStart)
    };
    
    const installation = await E(zoeService).install(contractBundle);
    console.log('✅ Contract installed:', installation);
    
    // Start the contract
    const { publicAPI, invitations } = await E(zoeService).startInstance(
      installation,
      {},
      {}
    );
    
    console.log('✅ Contract started successfully!');
    console.log('📋 Contract details:');
    console.log('- Installation:', installation);
    console.log('- Public API:', publicAPI);
    console.log('- Invitations:', invitations);
    
    // Save deployment info
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      contract: 'BLOCKPOINTS_NFT',
      installation,
      publicAPI,
      invitations,
      network: {
        rpc: process.env.AGORIC_RPC || 'http://localhost:26657',
        api: process.env.AGORIC_API || 'http://localhost:1317',
        chainId: process.env.AGORIC_CHAIN_ID || 'blockpoints-1'
      }
    };
    
    // Save to file
    await saveDeploymentInfo(deploymentInfo);
    
    console.log('🎉 Deployment completed successfully!');
    console.log('📄 Deployment info saved to deployment-info.json');
    
    return deploymentInfo;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    throw error;
  }
};

// Helper function to bundle contract
const bundleContract = async (contractStart) => {
  // This would normally use Agoric's bundling tools
  // For now, we'll return a placeholder
  return 'contract-bundle-placeholder';
};

// Helper function to save deployment info
const saveDeploymentInfo = async (info) => {
  const fs = await import('fs/promises');
  await fs.writeFile(
    'deployment-info.json',
    JSON.stringify(info, null, 2)
  );
};

// Run deployment if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployContracts()
    .then(() => {
      console.log('✅ Deployment script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Deployment script failed:', error);
      process.exit(1);
    });
}

export { deployContracts }; 