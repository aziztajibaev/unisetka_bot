const express = require('express');
const router = express.Router();

// Make sure the path is correct
const userController = require('./controllers/userController');
const colorController = require('./controllers/colorController');
const rawController = require('./controllers/rawController');
const settingController = require('./controllers/settingController');
const orderController = require('./controllers/orderController');

// User routes
router.post('/users', userController.create);  // Ensure userController.create is defined
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

router.post('/raws', rawController.create);
router.get('/raws', rawController.getAll);
router.get('/raws/:id', rawController.getById);
router.put('/raws/:id', rawController.update);
router.delete('/raws/:id', rawController.delete);

router.post('/colors', colorController.create);
router.get('/colors', colorController.getAll);
router.get('/colors/:id', colorController.getById);
router.put('/colors/:id', colorController.update);
router.delete('/colors/:id', colorController.delete);

router.post('/settings', settingController.create);
router.get('/settings', settingController.getAll);
router.get('/settings/:code', settingController.getByCode);
router.put('/settings/:code', settingController.update);
router.delete('/settings/:code', settingController.delete);

router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
