/**
 * credits.js — Client-side credit module for the Matrix of Conscience Arcade.
 *
 * Rules (from Matrix Governance):
 *   1 point scored  → 1 credit
 *   $1 donated      → 300 credits
 *
 * Storage: localStorage key "aghl-credits"
 * Exports: getCredits, addCreditsFromPoints, addCreditsFromDonation, spendCredits
 */

const CREDITS_PER_DOLLAR = 300;
import {
  getNexusConnector,
  readCreditsTotal,
  writeCreditsTotal,
} from './arcade/js/nexus-connector.js';

/**
 * Read the raw credits object from localStorage.
 * @returns {{ total: number }}
 */
function _load() {
  return { total: readCreditsTotal() };
}

/**
 * Persist the credits object to localStorage.
 * @param {{ total: number }} data
 */
function _save(data) {
  writeCreditsTotal(data.total);
}

/**
 * Return the current total credit balance.
 * @returns {number}
 */
export function getCredits() {
  return readCreditsTotal();
}

/**
 * Award 1 credit for every point scored.
 * @param {number} points  Raw game score (integer).
 * @returns {number}       New total balance.
 */
export function addCreditsFromPoints(points) {
  if (!Number.isFinite(points) || points <= 0) return getCredits();
  const data = _load();
  const value = Math.floor(points);
  data.total += value;
  _save(data);
  _dispatch(data.total, {
    type: 'EARN_REWARD',
    module: 'MATCH_MAKER',
    value,
    currency: 'LUMEN',
    reason: 'Gameplay points',
  });
  return data.total;
}

/**
 * Award 300 credits for every dollar donated.
 * @param {number} dollars  Donation amount in whole dollars.
 * @returns {number}        New total balance.
 */
export function addCreditsFromDonation(dollars) {
  if (!Number.isFinite(dollars) || dollars <= 0) return getCredits();
  const data = _load();
  const value = Math.floor(dollars) * CREDITS_PER_DOLLAR;
  data.total += value;
  _save(data);
  _dispatch(data.total, {
    type: 'EARN_REWARD',
    module: 'DONATION',
    value,
    currency: 'LUMEN',
    reason: 'Donation credits',
  });
  return data.total;
}

/**
 * Spend credits on a purchase.  Returns false if balance is insufficient.
 * @param {number} amount  Credits to deduct.
 * @returns {boolean}      true if purchase succeeded.
 */
export function spendCredits(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return false;
  const data = _load();
  if (data.total < amount) return false;
  const value = Math.floor(amount);
  data.total -= value;
  _save(data);
  _dispatch(data.total, {
    type: 'SPEND_RESOURCE',
    module: 'NEXUS_STORE',
    value,
    currency: 'LUMEN',
    reason: 'Store purchase',
  });
  return true;
}

/**
 * Dispatch a custom DOM event so any live HUD element can react.
 * @param {number} total
 */
function _dispatch(total, transaction) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('credits:updated', { detail: { total } }));
    getNexusConnector().publishTransaction({
      ...transaction,
      balanceAfter: total,
    });
  }
}
