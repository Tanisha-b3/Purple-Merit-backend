import mongoose from 'mongoose'
const RouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  distanceKm: { type: Number, required: true },
  trafficLevel: { type: String, enum: ['Low','Medium','High'], default: 'Low' },
  baseTimeMin: { type: Number, required: true }
}, { timestamps: true })
export default mongoose.model('Route', RouteSchema)