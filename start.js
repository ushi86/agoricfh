#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting BLOCKPOINTS Blockchain Platform...\n');

// Check if Agoric CLI is installed
const checkAgoricCLI = () => {
  return new Promise((resolve) => {
    const check = spawn('agoric', ['--version'], { stdio: 'pipe' });
    check.on('close', (code) => {
      resolve(code === 0);
    });
  });
};

// Install dependencies
const installDependencies = async () => {
  console.log('📦 Installing dependencies...');
  
  return new Promise((resolve, reject) => {
    const install = spawn('npm', ['install'], { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies installed successfully');
        resolve();
      } else {
        reject(new Error('Failed to install dependencies'));
      }
    });
  });
};

// Install backend dependencies
const installBackendDeps = async () => {
  console.log('📦 Installing backend dependencies...');
  
  return new Promise((resolve, reject) => {
    const install = spawn('npm', ['install'], { 
      stdio: 'inherit',
      cwd: join(__dirname, 'backend') 
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend dependencies installed successfully');
        resolve();
      } else {
        reject(new Error('Failed to install backend dependencies'));
      }
    });
  });
};

// Start Agoric chain
const startAgoricChain = async () => {
  console.log('⛓️  Starting Agoric blockchain...');
  
  return new Promise((resolve, reject) => {
    const chain = spawn('agoric', ['start', '--reset'], { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    
    // Give it some time to start
    setTimeout(() => {
      console.log('✅ Agoric chain started (background process)');
      resolve();
    }, 5000);
    
    chain.on('error', (error) => {
      reject(error);
    });
  });
};

// Deploy contracts
const deployContracts = async () => {
  console.log('📦 Deploying smart contracts...');
  
  return new Promise((resolve, reject) => {
    const deploy = spawn('node', ['scripts/deploy.js'], { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    
    deploy.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Contracts deployed successfully');
        resolve();
      } else {
        reject(new Error('Failed to deploy contracts'));
      }
    });
  });
};

// Start backend API
const startBackend = async () => {
  console.log('🔧 Starting backend API server...');
  
  return new Promise((resolve, reject) => {
    const backend = spawn('npm', ['run', 'dev'], { 
      stdio: 'inherit',
      cwd: join(__dirname, 'backend') 
    });
    
    // Give it some time to start
    setTimeout(() => {
      console.log('✅ Backend API server started (background process)');
      resolve();
    }, 3000);
    
    backend.on('error', (error) => {
      reject(error);
    });
  });
};

// Main startup function
const main = async () => {
  try {
    // Check if Agoric CLI is available
    const hasAgoricCLI = await checkAgoricCLI();
    if (!hasAgoricCLI) {
      console.log('⚠️  Agoric CLI not found. Please install it first:');
      console.log('   npm install -g @agoric/agoric-cli');
      console.log('   or visit: https://agoric.com/develop/getting-started/');
      process.exit(1);
    }

    // Install dependencies
    await installDependencies();
    await installBackendDeps();

    // Start Agoric chain
    await startAgoricChain();

    // Wait a bit for chain to be ready
    console.log('⏳ Waiting for blockchain to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Deploy contracts
    await deployContracts();

    // Start backend
    await startBackend();

    console.log('\n🎉 BLOCKPOINTS Platform is now running!');
    console.log('\n📋 Services:');
    console.log('   🌐 Blockchain: http://localhost:26657');
    console.log('   🔧 API Server: http://localhost:3001');
    console.log('   📊 Health Check: http://localhost:3001/health');
    console.log('\n📚 Next Steps:');
    console.log('   1. Set up your frontend application');
    console.log('   2. Connect your wallet to the platform');
    console.log('   3. Start minting NFTs and earning rewards!');
    console.log('\n🔗 Useful Commands:');
    console.log('   - View logs: agoric logs');
    console.log('   - Stop chain: agoric stop');
    console.log('   - Reset chain: agoric start --reset');

  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down BLOCKPOINTS...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down BLOCKPOINTS...');
  process.exit(0);
});

// Run main function
main(); 