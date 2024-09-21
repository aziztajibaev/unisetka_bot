const Order = require('../models/order');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order' });
    }
};

const createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        Object.assign(order, req.body);
        await order.update();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        await Order.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

const getOrderWithItems = async (req, res) => {
    try {
        const orderDetails = await Order.getOrderWithItems(req.params.id);
        if (!orderDetails) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(orderDetails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order with items' });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderWithItems
};
