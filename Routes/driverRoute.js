import express from 'express';
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver
} from "../Controller/DriversController.js";

const router = express.Router();

router.get('/', getDrivers);
router.post('/', createDriver);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);

export default router;