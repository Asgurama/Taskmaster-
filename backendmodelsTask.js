const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
