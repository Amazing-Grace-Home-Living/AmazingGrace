// walletManager.js — localStorage-based wallet management (Firebase removed)
const WALLETS_KEY = 'matrix_user_wallets';

function getWallets() {
  try {
    const raw = localStorage.getItem(WALLETS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveWallets(wallets) {
  try {
    localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
  } catch (e) {
    console.warn('[walletManager.js] Could not persist wallets:', e);
  }
}

export const WalletManager = {
  // Initialize connection (localStorage, not Firebase)
  init: () => {
    // localStorage initialization not needed
  },

  // Sync points from a game to the global wallet
  syncPoints: async (userId, amount, source) => {
    const wallets = getWallets();
    if (!wallets[userId]) {
      wallets[userId] = { balance: 0, lastUpdated: null, lastSource: null };
    }
    wallets[userId].balance += amount;
    wallets[userId].lastUpdated = Date.now();
    wallets[userId].lastSource = source;
    saveWallets(wallets);
    console.log(`Synced ${amount} points from ${source}`);
  },

  // Deduct points for store purchases
  spendPoints: async (userId, cost) => {
    const wallets = getWallets();
    if (!wallets[userId]) {
      wallets[userId] = { balance: 0, spent_total: 0 };
    }
    let success = false;
    if (wallets[userId].balance >= cost) {
      wallets[userId].balance -= cost;
      wallets[userId].spent_total = (wallets[userId].spent_total || 0) + cost;
      success = true;
      saveWallets(wallets);
    }
    return success;
  }
};
