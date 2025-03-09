/**
 * Utility functions for collision detection
 */

/**
 * Check if two rectangular entities are colliding using AABB collision detection
 * 
 * @param {Object} entity1 - First entity with x, y, width, height properties
 * @param {Object} entity2 - Second entity with x, y, width, height properties
 * @returns {boolean} True if the entities are colliding
 */
export function checkAABBCollision(entity1, entity2) {
  return (
    entity1.x < entity2.x + entity2.width &&
    entity1.x + entity1.width > entity2.x &&
    entity1.y < entity2.y + entity2.height &&
    entity1.y + entity1.height > entity2.y
  );
}

/**
 * Check if a point is inside a rectangular entity
 * 
 * @param {number} pointX - X coordinate of the point
 * @param {number} pointY - Y coordinate of the point
 * @param {Object} entity - Entity with x, y, width, height properties
 * @returns {boolean} True if the point is inside the entity
 */
export function checkPointCollision(pointX, pointY, entity) {
  return (
    pointX >= entity.x &&
    pointX <= entity.x + entity.width &&
    pointY >= entity.y &&
    pointY <= entity.y + entity.height
  );
}

/**
 * Check if an entity is out of the game boundaries
 * 
 * @param {Object} entity - Entity with x, y, width, height properties
 * @param {number} boundX - X boundary (usually game width)
 * @param {number} boundY - Y boundary (usually game height)
 * @returns {Object} Object containing boolean flags for each boundary collision
 */
export function checkBoundaryCollision(entity, boundX, boundY) {
  return {
    left: entity.x < 0,
    right: entity.x + entity.width > boundX,
    top: entity.y < 0,
    bottom: entity.y + entity.height > boundY
  };
}

/**
 * Group-to-group collision detection to find all colliding pairs
 * 
 * @param {Array} groupA - Array of entities
 * @param {Array} groupB - Array of entities
 * @returns {Array} Array of collision pairs { a: entityA, b: entityB }
 */
export function findCollisionPairs(groupA, groupB) {
  const collisions = [];
  
  groupA.forEach(entityA => {
    groupB.forEach(entityB => {
      if (checkAABBCollision(entityA, entityB)) {
        collisions.push({ a: entityA, b: entityB });
      }
    });
  });
  
  return collisions;
}
