// src/api/controllers/orderItemController.js
const OrderItem = require('../models/orderItem');

exports.getAllOrderItems = async (req, res) => {
    try {
        const items = await OrderItem.findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order items' });
    }
};

exports.getOrderItemById = async (req, res) => {
    try {
        const item = await OrderItem.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: 'Order item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order item' });
    }
};

exports.createOrderItem = async (req, res) => {
    const orderItem = new OrderItem(req.body);
    try {
        await orderItem.save();
        res.status(201).json(orderItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order item' });
    }
};

exports.updateOrderItem = async (req, res) => {
    const orderItem = new OrderItem({ ...req.body, item_id: req.params.id });
    try {
        await orderItem.update();
        res.json(orderItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order item' });
    }
};

exports.deleteOrderItem = async (req, res) => {
    try {
        await OrderItem.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order item' });
    }
};
