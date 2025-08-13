import express from 'express';
import xlsx from 'xlsx';
import Driver from '../models/driver.js';
import Order from '../models/order.js';
import Route from '../models/Route.js';

const router = express.Router();

const processExcelOrCSVFile = async (fileBuffer, modelType) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  let Model;
  let transformFn;

  switch (modelType) {
    case 'drivers':
      Model = Driver;
      transformFn = (item) => ({
        name: item.Name,
        currentShiftHours: item['Current Shift Hours'],
        pastWeekHours: item['Past Week Hours']
          ? item['Past Week Hours'].split(',').map(Number)
          : []
      });
      break;

    case 'orders':
      Model = Order;
      transformFn = (item) => ({
        orderId: item['Order ID'],
        valueRs: item['Value (Rs)'],
        route: item['Route ID'], // This should be ObjectId ideally
        deliveryTimestamp: item['Delivery Timestamp']
          ? new Date(item['Delivery Timestamp'])
          : null
      });
      break;

    case 'routes':
      Model = Route;
      transformFn = (item) => ({
        routeId: item['Route ID'],
        distanceKm: item['Distance (km)'],
        trafficLevel: item['Traffic Level'],
        baseTimeMin: item['Base Time (min)']
      });
      break;

    default:
      throw new Error('Invalid model type');
  }

  const transformedData = data.map(transformFn);
  return Model.insertMany(transformedData, { ordered: false });
};

router.post('/:type', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { type } = req.params;
    const { file } = req.files;

    if (!['drivers', 'orders', 'routes'].includes(type)) {
      return res.status(400).json({ message: 'Invalid import type' });
    }

    const result = await processExcelOrCSVFile(file.data, type);
    res.json({
      message: `${result.length} ${type} imported successfully`,
      count: result.length
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      message: 'Import failed',
      error: error.message
    });
  }
});

export default router;
