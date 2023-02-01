const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    id: String,
    password: String,
    email: String,
    membership: Boolean,
    type: Number
});

const users = mongoose.model("users", userSchema);

module.exports = users;