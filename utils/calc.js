// /utils/calc.js

/**
 * Calculate fuel cost based on route distance and traffic level
 * @param {Object} route - Route object
 * @param {Number} route.distanceKm - Distance in kilometers
 * @param {String} route.trafficLevel - Traffic level ('Low', 'Medium', 'High')
 * @returns {Number} fuel cost
 */
export const calculateFuelCost = (route) => {
  if (!route) return 0;

  const baseCost = 0.5; // per km
  const trafficMultipliers = {
    Low: 1,
    Medium: 1.2,
    High: 1.5
  };

  return route.distanceKm * baseCost * (trafficMultipliers[route.trafficLevel] || 1);
};

/**
 * Determine if a delivery is late
 * @param {Number} actualTime - Actual delivery time in minutes
 * @param {Number} baseTime - Base delivery time in minutes
 * @returns {Boolean} true if late
 */
export const isLate = (actualTime, baseTime) => {
  return actualTime > baseTime * 1.1; // 10% over base time is late
};

/**
 * Check if driver is fatigued based on last day's working hours
 * @param {Number} lastDayHours - Hours worked last day
 * @returns {Boolean} true if fatigued
 */
export const applyFatigue = (lastDayHours) => {
  return lastDayHours > 10; // if worked more than 10 hours last day
};

/**
 * Compute profit for an order
 * @param {Number} orderValue - Order value in Rs
 * @param {Boolean} onTime - Whether delivered on time
 * @param {Number} fuelCost - Fuel cost
 * @param {Number} penalty - Penalty for late delivery
 * @returns {Number} profit
 */
export const computeOrderProfit = (orderValue, onTime, fuelCost, penalty) => {
  const baseProfit = orderValue * 0.1; // 10% of order value
  const bonus = onTime ? 20 : 0;
  return baseProfit + bonus - fuelCost - penalty;
};

/**
 * Calculate delivery efficiency percentage
 * @param {Number} onTimeCount - Number of on-time deliveries
 * @param {Number} totalDeliveries - Total deliveries
 * @returns {Number} efficiency percentage
 */
export const calculateEfficiency = (onTimeCount, totalDeliveries) => {
  return totalDeliveries === 0 ? 0 : Math.round((onTimeCount / totalDeliveries) * 100);
};
