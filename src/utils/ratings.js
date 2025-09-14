// Rating system utilities with local storage persistence

const RATINGS_KEY = 'mh_ratings';

function readRatings() {
  try {
    const raw = localStorage.getItem(RATINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeRatings(ratings) {
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
}

export function getUserRating(resourceId, userId) {
  const ratings = readRatings();
  const resourceRatings = ratings[resourceId] || {};
  return resourceRatings[userId] || null;
}

export function setUserRating(resourceId, userId, rating) {
  const ratings = readRatings();
  if (!ratings[resourceId]) {
    ratings[resourceId] = {};
  }
  ratings[resourceId][userId] = rating;
  writeRatings(ratings);
}

export function getResourceStats(resourceId) {
  const ratings = readRatings();
  const resourceRatings = ratings[resourceId] || {};
  const ratingValues = Object.values(resourceRatings).filter(r => typeof r === 'number' && r >= 1 && r <= 5);
  
  if (ratingValues.length === 0) {
    return { average: 0, count: 0, ratings: [] };
  }
  
  const average = ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length;
  return {
    average: Math.round(average * 10) / 10, // Round to 1 decimal place
    count: ratingValues.length,
    ratings: ratingValues
  };
}

export function getAllResourceStats() {
  const ratings = readRatings();
  const stats = {};
  
  Object.keys(ratings).forEach(resourceId => {
    stats[resourceId] = getResourceStats(resourceId);
  });
  
  return stats;
}

export default {
  getUserRating,
  setUserRating,
  getResourceStats,
  getAllResourceStats,
};
