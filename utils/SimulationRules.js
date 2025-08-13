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

export const isLate = (actualTime, baseTime) => {
  return actualTime > baseTime * 1.1; // 10% over base time is late
};

export const applyFatigue = (lastDayHours) => {
  return lastDayHours > 10; // if worked more than 10 hours last day
};

export const computeOrderProfit = (orderValue, onTime, fuelCost, penalty) => {
  const baseProfit = orderValue * 0.1; // 10% of order value
  const bonus = onTime ? 20 : 0;
  return baseProfit + bonus - fuelCost - penalty;
};

export const calculateEfficiency = (onTimeCount, totalDeliveries) => {
  return totalDeliveries === 0 ? 0 : Math.round((onTimeCount / totalDeliveries) * 100);
};