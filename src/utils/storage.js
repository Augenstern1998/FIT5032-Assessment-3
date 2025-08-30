const FAVORITE_KEY = 'mh_favorites';
const FORM_DRAFT_KEY = 'mh_join_draft';

// ============ Named exports============
export function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []; }
  catch { return []; }
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  const i = favs.indexOf(id);
  if (i >= 0) favs.splice(i, 1);
  else favs.push(id);
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favs));
  return favs;
}

export function saveFormDraft(draft) {
  localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(draft));
}

export function loadFormDraft() {
  try { return JSON.parse(localStorage.getItem(FORM_DRAFT_KEY)) || {}; }
  catch { return {}; }
}

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
