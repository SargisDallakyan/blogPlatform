const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    username: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const Users = mongoose.model("Users", UserSchema);

module.exports = { Users }