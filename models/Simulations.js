import mongoose from 'mongoose';

const SimulationSchema = new mongoose.Schema({
  totalDrivers: Number,
  startTime: String,
  maxHours: Number,
  totalOrders: Number,
  onTimeDeliveries: Number,
  efficiency: Number,
  totalProfit: Number,
  fuelBreakdown: {
    Low: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    High: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Simulation', SimulationSchema);
