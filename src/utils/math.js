/**
 * Math utility functions for game calculations
 */

/**
 * Clamp a value between a minimum and maximum value
 * 
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * 
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Calculate the distance between two points
 * 
 * @param {number} x1 - X coordinate of first point
 * @param {number} y1 - Y coordinate of first point
 * @param {number} x2 - X coordinate of second point
 * @param {number} y2 - Y coordinate of second point
 * @returns {number} Distance between the points
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the normalized direction vector between two points
 * 
 * @param {number} x1 - X coordinate of first point
 * @param {number} y1 - Y coordinate of first point
 * @param {number} x2 - X coordinate of second point
 * @param {number} y2 - Y coordinate of second point
 * @returns {Object} Object with normalized x, y direction components
 */
export function direction(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Avoid division by zero
  if (dist === 0) {
    return { x: 0, y: 0 };
  }
  
  return {
    x: dx / dist,
    y: dy / dist
  };
}

/**
 * Convert degrees to radians
 * 
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 * 
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radToDeg(radians) {
  return radians * 180 / Math.PI;
}

/**
 * Get a point on a circle given an angle and radius
 * 
 * @param {number} centerX - X coordinate of circle center
 * @param {number} centerY - Y coordinate of circle center
 * @param {number} radius - Radius of the circle
 * @param {number} angleInDegrees - Angle in degrees
 * @returns {Object} Object with x, y coordinates of the point
 */
export function pointOnCircle(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = degToRad(angleInDegrees);
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}
