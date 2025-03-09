/**
 * Random generation utility functions
 */

/**
 * Get a random integer between min and max (inclusive)
 * 
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random float between min and max
 * 
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float
 */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Get a random element from an array
 * 
 * @param {Array} array - Array to select from
 * @returns {*} Random element from the array
 */
export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get a random boolean with specified probability
 * 
 * @param {number} probability - Probability of true (0-1)
 * @returns {boolean} Random boolean
 */
export function randomBool(probability = 0.5) {
  return Math.random() < probability;
}

/**
 * Get a random color in hex format
 * 
 * @returns {string} Random color in hex format
 */
export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Get a random position within specified bounds
 * 
 * @param {number} minX - Minimum X coordinate
 * @param {number} maxX - Maximum X coordinate
 * @param {number} minY - Minimum Y coordinate
 * @param {number} maxY - Maximum Y coordinate
 * @returns {Object} Object with random x, y coordinates
 */
export function randomPosition(minX, maxX, minY, maxY) {
  return {
    x: randomFloat(minX, maxX),
    y: randomFloat(minY, maxY)
  };
}

/**
 * Shuffle an array using the Fisher-Yates algorithm
 * 
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
