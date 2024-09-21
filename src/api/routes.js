const express = require('express');
const router = express.Router();

// Make sure the path is correct
const userController = require('../api/controllers/userController');
const rawController = require('../api/controllers/rawController');
const colorController = require('../api/controllers/colorController');
const settingController = require('../api/controllers/settingController');
const orderController = require('../api/controllers/orderController');
const orderItemController = require('../api/controllers/orderItemController');

// User routes
router.get('/users/', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users/', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.get('/raws', rawController.getAllRaws);
router.get('/raws/:id', rawController.getRawById);
router.post('/raws', rawController.createRaw);
router.put('/raws/:id', rawController.updateRaw);
router.delete('/raws/:id', rawController.deleteRaw);

router.get('/colors', colorController.getAllColors);
router.get('/colors/:id', colorController.getColorById);
router.post('/colors', colorController.createColor);
router.put('/colors/:id', colorController.updateColor);
router.delete('/colors/:id', colorController.deleteColor);

router.get('/settings', settingController.getAllSettings);
router.get('/settings/:code', settingController.getSettingByCode);
router.post('/settings', settingController.createSetting);
router.put('/settings/:code', settingController.updateSetting);
router.delete('/settings/:code', settingController.deleteSetting);

router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.post('/orders', orderController.createOrder);
router.put('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);
router.get('/orders/:id/items', orderController.getOrderWithItems);

router.get('/order-items', orderItemController.getAllOrderItems);
router.get('/order-items/:id', orderItemController.getOrderItemById);
router.post('/order-items', orderItemController.createOrderItem);
router.put('/order-items/:id', orderItemController.updateOrderItem);
router.delete('/order-items/:id', orderItemController.deleteOrderItem);

module.exports = router;
