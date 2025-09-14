// Storage utilities for favorites and form drafts with localStorage persistence

// Local storage keys for different data types
const FAVORITE_KEY = 'mh_favorites';
const FORM_DRAFT_KEY = 'mh_join_draft';

// ============ Named exports ============

/**
 * Retrieve user's favorite resource IDs from localStorage
 * @returns {Array<number>} Array of favorite resource IDs
 */
export function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []; }
  catch { return []; }
}

/**
 * Toggle favorite status for a resource
 * @param {number} id - Resource ID to toggle favorite status
 * @returns {Array<number>} Updated array of favorite resource IDs
 */
export function toggleFavorite(id) {
  const favs = getFavorites();
  const i = favs.indexOf(id);
  if (i >= 0) favs.splice(i, 1); // Remove if already favorited
  else favs.push(id); // Add if not favorited
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favs));
  return favs;
}

/**
 * Save form draft data to localStorage
 * @param {Object} draft - Form data to save as draft
 */
export function saveFormDraft(draft) {
  localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(draft));
}

/**
 * Load saved form draft from localStorage
 * @returns {Object} Saved form draft data or empty object
 */
export function loadFormDraft() {
  try { return JSON.parse(localStorage.getItem(FORM_DRAFT_KEY)) || {}; }
  catch { return {}; }
}

/**
 * Clear saved form draft from localStorage
 */
export function clearFormDraft() {
  localStorage.removeItem(FORM_DRAFT_KEY);
}

// ============ Default export ============
export default {
  getFavorites,
  toggleFavorite,
  saveFormDraft,
  loadFormDraft,
  clearFormDraft,
};
