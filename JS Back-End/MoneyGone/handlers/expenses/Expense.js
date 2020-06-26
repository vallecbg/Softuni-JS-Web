const mongoose = require('mongoose')
const { Schema, model: Model} = mongoose
const { String, Number, ObjectId, Boolean} = Schema.Types

const expenseSchema = new Schema({
    merchant: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    total: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50
    },
    report: {
        type: Boolean,
        required: true,
        default: false
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    }

})

module.exports = new Model('Expense', expenseSchema)