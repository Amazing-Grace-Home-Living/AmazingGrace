// walletManager.js
export const WalletManager = {
  // Initialize connection to Firebase
  init: (db) => {
    this.db = db;
  },

  // Sync points from a game to the global wallet
  syncPoints: async (userId, amount, source) => {
    const walletRef = firebase.database().ref(`user_wallets/${userId}`);
    await walletRef.transaction((wallet) => {
      if (wallet) {
        wallet.balance += amount;
        wallet.lastUpdated = Date.now();
        wallet.lastSource = source;
      }
      return wallet;
    });
    console.log(`Synced ${amount} points from ${source}`);
  },

  // Deduct points for store purchases
  spendPoints: async (userId, cost) => {
    const walletRef = firebase.database().ref(`user_wallets/${userId}`);
    let success = false;
    await walletRef.transaction((wallet) => {
      if (wallet && wallet.balance >= cost) {
        wallet.balance -= cost;
        wallet.spent_total = (wallet.spent_total || 0) + cost;
        success = true;
      }
      return wallet;
    });
    return success;
  }
};
