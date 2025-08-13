import mongoose from 'mongoose'


const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentShiftHours: { type: Number, default: 0 },
  pastWeekHours: { type: [Number], default: [] }
}, { timestamps: true })

export default mongoose.model('Driver', DriverSchema)