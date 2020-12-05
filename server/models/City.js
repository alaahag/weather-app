const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    name: { type: String, required: true, unique: true },
    temperature: Number,
    condition: String,
    conditionPic: String,
    updatedAt: Date
});

const City = mongoose.model("city", expenseSchema, 'cities');
module.exports = City;