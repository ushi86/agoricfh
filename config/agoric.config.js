export default {
  // Agoric chain configuration
  chainName: 'BLOCKPOINTS',
  chainId: 'blockpoints-1',
  
  // RPC endpoints
  rpc: {
    local: 'http://localhost:26657',
    testnet: 'https://testnet.rpc.agoric.net',
    mainnet: 'https://mainnet.rpc.agoric.net'
  },
  
  // API endpoints
  api: {
    local: 'http://localhost:1317',
    testnet: 'https://testnet.api.agoric.net',
    mainnet: 'https://mainnet.api.agoric.net'
  },
  
  // Contract configuration
  contracts: {
    blockpointsNFT: {
      name: 'BLOCKPOINTS NFT Contract',
      description: 'Main NFT rewards contract for BLOCKPOINTS platform',
      version: '1.0.0',
      path: '../contracts/blockpointsNFT.js'
    }
  },
  
  // Wallet configuration
  wallet: {
    name: 'BLOCKPOINTS Wallet',
    mnemonic: process.env.AGORIC_MNEMONIC || '',
    address: process.env.AGORIC_ADDRESS || '',
    chainId: 'blockpoints-1'
  },
  
  // Network configuration
  network: {
    default: 'local',
    environments: {
      local: {
        rpc: 'http://localhost:26657',
        api: 'http://localhost:1317',
        chainId: 'blockpoints-1'
      },
      testnet: {
        rpc: 'https://testnet.rpc.agoric.net',
        api: 'https://testnet.api.agoric.net',
        chainId: 'agoric-testnet-1'
      },
      mainnet: {
        rpc: 'https://mainnet.rpc.agoric.net',
        api: 'https://mainnet.api.agoric.net',
        chainId: 'agoric-1'
      }
    }
  },
  
  // Development settings
  dev: {
    autoStart: true,
    resetOnStart: true,
    logLevel: 'info',
    enableTelemetry: false
  }
}; 