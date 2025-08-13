import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  valueRs: { type: Number, required: true },
  route: { type: String, required: true },  // store routeId string here
  deliveryTimestamp: { type: Date }
}, { timestamps: true })

export default mongoose.model('Order', OrderSchema)
