import Order from '../models/order.js';
import Driver from '../models/driver.js';
import Route from '../models/Route.js';
import { calculateFuelCost, isLate, computeOrderProfit, calculateEfficiency } from '../utils/calc.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Fetch data in parallel
    const [orders, drivers, routes] = await Promise.all([
      Order.find().lean(),
      Driver.find().lean(),
      Route.find().lean()
    ]);

    // Totals
    const totalOrders = orders.length;
    const totalDrivers = drivers.length;
    const totalRoutes = routes.length;

    // Aggregate values
    const totalOrderValue = orders.reduce((sum, o) => sum + (o.valueRs || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalOrderValue / totalOrders : 0;

    // Fuel breakdown & profit calculations
    let fuelBreakdown = { Low: 0, Medium: 0, High: 0 };
    let totalFuelCost = 0;
    let totalProfit = 0;
    let onTimeCount = 0;

    for (const order of orders) {
      const route = routes.find(r => r.routeId === order.route);
      if (!route) continue;

      const fuelCost = calculateFuelCost(route);
      totalFuelCost += fuelCost;
      fuelBreakdown[route.trafficLevel] = (fuelBreakdown[route.trafficLevel] || 0) + fuelCost;

      const deliveryTime = order.deliveryTimestamp
        ? (order.deliveryTimestamp - order.createdAt) / 60000 // in minutes
        : route.baseTimeMin;

      const onTime = !isLate(deliveryTime, route.baseTimeMin);
      if (onTime) onTimeCount++;

      const penalty = onTime ? 0 : 50;
      totalProfit += computeOrderProfit(order.valueRs, onTime, fuelCost, penalty);
    }

    const efficiency = calculateEfficiency(onTimeCount, totalOrders);

    // Build response
    const response = {
      totals: {
        orders: totalOrders,
        drivers: totalDrivers,
        routes: totalRoutes,
        averageOrderValue: Number(avgOrderValue.toFixed(2)),
        totalOrderValue: Number(totalOrderValue.toFixed(2))
      },
      performance: {
        profit: Number(totalProfit.toFixed(2)),
        efficiency,
        onTime: onTimeCount,
        late: totalOrders - onTimeCount
      },
      costs: {
        fuel: {
          Low: Number(fuelBreakdown.Low.toFixed(2)),
          Medium: Number(fuelBreakdown.Medium.toFixed(2)),
          High: Number(fuelBreakdown.High.toFixed(2))
        },
        maintenance: 0,
        labor: 0
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
};
