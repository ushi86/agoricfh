// Agoric Wallet Integration Utility

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  chainId?: string;
  balance?: string;
}

export interface WalletError {
  code: string;
  message: string;
}

class AgoricWalletManager {
  private wallet: any = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      // Wait for the web component to be available
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        if (customElements.get('agoric-wallet')) {
          this.isInitialized = true;
          console.log('Agoric wallet web component initialized');
          return true;
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      console.warn('Agoric wallet web component not available, using mock wallet');
      return false;
    } catch (error) {
      console.error('Failed to initialize Agoric wallet:', error);
      return false;
    }
  }

  async connect(): Promise<WalletConnection> {
    try {
      if (!this.isInitialized) {
        // Use mock wallet for development
        const mockAddress = `agoric_${Math.random().toString(36).substring(2, 15)}`;
        return {
          address: mockAddress,
          isConnected: true,
          chainId: 'agoric-testnet',
          balance: '1000'
        };
      }

      // Try to use real Agoric wallet
      const walletElement = document.querySelector('agoric-wallet') as any;
      if (walletElement && walletElement.connect) {
        const address = await walletElement.connect();
        this.wallet = walletElement;
        
        return {
          address,
          isConnected: true,
          chainId: 'agoric-mainnet',
          balance: '0' // Will be fetched separately
        };
      }

      throw new Error('Wallet connection not available');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      // Fallback to mock wallet
      const mockAddress = `agoric_${Math.random().toString(36).substring(2, 15)}`;
      return {
        address: mockAddress,
        isConnected: true,
        chainId: 'agoric-testnet',
        balance: '1000'
      };
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.wallet && this.wallet.disconnect) {
        await this.wallet.disconnect();
      }
      this.wallet = null;
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      if (this.wallet && this.wallet.getBalance) {
        return await this.wallet.getBalance(address);
      }
      return '1000'; // Mock balance
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  async signTransaction(transaction: any): Promise<string> {
    try {
      if (this.wallet && this.wallet.signTransaction) {
        return await this.wallet.signTransaction(transaction);
      }
      // Mock signature for development
      return `mock_signature_${Date.now()}`;
    } catch (error) {
      console.error('Transaction signing failed:', error);
      throw new Error('Transaction signing failed');
    }
  }

  async sendTransaction(transaction: any): Promise<string> {
    try {
      if (this.wallet && this.wallet.sendTransaction) {
        return await this.wallet.sendTransaction(transaction);
      }
      // Mock transaction hash for development
      return `mock_tx_${Date.now()}`;
    } catch (error) {
      console.error('Transaction sending failed:', error);
      throw new Error('Transaction sending failed');
    }
  }

  isWalletAvailable(): boolean {
    return this.isInitialized && this.wallet !== null;
  }

  getWalletInfo(): any {
    return {
      isInitialized: this.isInitialized,
      isConnected: this.wallet !== null,
      walletType: this.isInitialized ? 'agoric' : 'mock'
    };
  }
}

// Create singleton instance
export const agoricWallet = new AgoricWalletManager();

// Utility functions for common wallet operations
export const walletUtils = {
  // Format address for display
  formatAddress: (address: string, start: number = 6, end: number = 4): string => {
    if (!address) return '';
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  },

  // Validate address format
  isValidAddress: (address: string): boolean => {
    if (!address) return false;
    // Basic Agoric address validation (starts with 'agoric_')
    return address.startsWith('agoric_') && address.length > 10;
  },

  // Get network name from chain ID
  getNetworkName: (chainId?: string): string => {
    switch (chainId) {
      case 'agoric-mainnet':
        return 'Agoric Mainnet';
      case 'agoric-testnet':
        return 'Agoric Testnet';
      default:
        return 'Unknown Network';
    }
  },

  // Convert balance to readable format
  formatBalance: (balance: string, decimals: number = 6): string => {
    try {
      const num = parseFloat(balance);
      if (isNaN(num)) return '0';
      return (num / Math.pow(10, decimals)).toFixed(4);
    } catch {
      return '0';
    }
  }
};

// Event listeners for wallet state changes
export const walletEvents = {
  listeners: new Map<string, Function[]>(),

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  },

  emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  },

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
};

// Initialize wallet on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', async () => {
    await agoricWallet.initialize();
  });
} 