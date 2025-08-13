import { connectDB } from './config/db.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import SimulateRoutes from './Routes/SimulateRoutes.js'
import  authRoutes from './Routes/AuthRoute.js'
import driverRoutes from './Routes/driverRoute.js';
import orderRoutes from './Routes/orderRoute.js';
import RouteRoutes from './Routes/RouteRoute.js';
import statsRoutes from './Routes/StatsRoutes.js'
// import importRoutes from './Routes/import.js';
dotenv.config()
const app = express()
// app.use(cors())
app.use(express.json())
// app.use('/api/import', importRoutes);
// import cors from 'cors';

// Replace simple cors() with:
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use('/api/drivers', driverRoutes)
app.use('/routes', RouteRoutes)
app.use('/orders', orderRoutes)
app.use('/api/simulate', SimulateRoutes)
app.use("/api/auth", authRoutes);
app.use('/api/stats', statsRoutes);
app.get('/', (req,res) => res.json({ message: 'Your backend ready' }))
const PORT = 5000
connectDB(process.env.MONGO_URI)
  .then(()=>{
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`
    ))
  })
  .catch(err=>{ console.error('DB connect failed:', err) })