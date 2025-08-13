export const validateDriverInput = (driverData) => {
  const errors = [];
  
  if (!driverData.name || driverData.name.trim() === '') {
    errors.push('Driver name is required');
  }
  
  if (driverData.currentShiftHours && driverData.currentShiftHours < 0) {
    errors.push('Shift hours cannot be negative');
  }
  
  return errors;
};

export const validateRouteInput = (routeData) => {
  const errors = [];
  
  if (!routeData.routeId || routeData.routeId.trim() === '') {
    errors.push('Route ID is required');
  }
  
  if (!routeData.distanceKm || routeData.distanceKm <= 0) {
    errors.push('Distance must be a positive number');
  }
  
  if (!routeData.baseTimeMin || routeData.baseTimeMin <= 0) {
    errors.push('Base time must be a positive number');
  }
  
  return errors;
};

export const validateOrderInput = (orderData) => {
  const errors = [];
  
  if (!orderData.orderId || orderData.orderId.trim() === '') {
    errors.push('Order ID is required');
  }
  
  if (!orderData.valueRs || orderData.valueRs <= 0) {
    errors.push('Order value must be a positive number');
  }
  
  return errors;
};