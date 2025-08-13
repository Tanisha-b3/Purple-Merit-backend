// routes/simulation.js
import express from "express";
import Order from "../models/order.js";
import Driver from "../models/driver.js";
import Route from "../models/Route.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { drivers, startTime, maxHours } = req.body;

    // ===== 1. VALIDATION =====
    if (!drivers || !Number.isInteger(drivers) || drivers <= 0) {
      return res.status(400).json({ error: "'drivers' must be a positive integer" });
    }
    if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) {
      return res.status(400).json({ error: "'startTime' must be in HH:MM format" });
    }
    if (!maxHours || typeof maxHours !== "number" || maxHours <= 0 || maxHours > 24) {
      return res.status(400).json({ error: "'maxHours' must be between 1 and 24" });
    }

    // ===== 2. FETCH DATA =====
    const orders = await Order.find();
    const routes = await Route.find();
    const driverDocs = await Driver.find();

    if (!orders.length) return res.status(404).json({ error: "No orders found" });
    if (!routes.length) return res.status(404).json({ error: "No routes found" });

    // Map routes for quick lookup
    const routeMap = new Map(routes.map(r => [r.routeId, r]));

    // ===== 3. ALLOCATE ORDERS =====
    const driverCount = Math.min(drivers, driverDocs.length);
    const assignedOrders = orders.map((order, idx) => ({
      ...order.toObject(),
      driverId: idx % driverCount
    }));

    // ===== 4. CALCULATE KPIs =====
    let totalProfit = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    let fuelCosts = { Low: 0, Medium: 0, High: 0 };

    for (const order of assignedOrders) {
      const route = routeMap.get(order.route);
      if (!route) continue;

      // Base delivery time
      const baseTime = route.baseTimeMin;
      let deliveryTime = baseTime;

      // Fatigue Rule
      const driverData = driverDocs[order.driverId];
      if (driverData && driverData.currentShiftHours > 8) {
        deliveryTime *= 1.3;
      }

      // Actual delivery time (simulate if not provided)
      if (order.deliveryTimestamp) {
        deliveryTime = Math.ceil((order.deliveryTimestamp - new Date(order.createdAt)) / 60000);
      }

      let penalty = 0;
      let bonus = 0;

      // Late Delivery Penalty
      if (deliveryTime > baseTime + 10) {
        penalty += 50;
        lateDeliveries++;
      } else {
        onTimeDeliveries++;
      }

      // High Value Bonus
      if (order.valueRs > 1000 && deliveryTime <= baseTime + 10) {
        bonus += order.valueRs * 0.1;
      }

      // Fuel Cost
      let fuelCost = route.distanceKm * 5;
      if (route.trafficLevel === "High") fuelCost += route.distanceKm * 2;
      if (fuelCosts[route.trafficLevel] !== undefined) {
        fuelCosts[route.trafficLevel] += fuelCost;
      }

      // Profit
      const profit = order.valueRs + bonus - penalty - fuelCost;
      totalProfit += profit;
    }

    const efficiencyScore = Number(((onTimeDeliveries / orders.length) * 100).toFixed(2));
    const avgOrderValue = Number((orders.reduce((sum, o) => sum + o.valueRs, 0) / orders.length).toFixed(2));

    res.json({
      totalProfit: Number(totalProfit.toFixed(2)),
      efficiencyScore,
      onTimeDeliveries,
      lateDeliveries,
      fuelCosts,
      totalOrders: orders.length,
      totalDrivers: driverCount,
      totalRoutes: routes.length,
      averageOrderValue: avgOrderValue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
