const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: String,
    author: String,
    price: Number,
    availability: Number
});

const books = mongoose.model("book", bookSchema);

module.exports = books;