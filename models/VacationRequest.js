const mongoose = require('mongoose');

const vacationRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    period: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['waiting', 'approved', 'rejected'], default: 'waiting' }
});

const VacationRequest = mongoose.model('VacationRequest', vacationRequestSchema);

module.exports = VacationRequest;