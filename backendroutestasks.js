const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

// Middleware to authenticate user using JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Create a new task
router.post('/', authenticate, async (req, res) => {
    const { name, description, deadline, priority } = req.body;

    try {
        const task = new Task({ userId: req.user.userId, name, description, deadline, priority });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all tasks for a user
router.get('/', authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a task
router.put('/:taskId', authenticate, async (req, res) => {
    const { taskId } = req.params;
    const { name, description, deadline, priority } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: req.user.userId },
            { name, description, deadline, priority },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a task
router.delete('/:taskId', authenticate, async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: taskId, userId: req.user.userId });

        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
