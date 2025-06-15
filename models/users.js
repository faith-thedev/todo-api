const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,  // Ensures the field is mandatory
        unique: true,    // Ensures usernames are unique
        trim: true       // Removes whitespace
    },
    email: {
        type: String,
        required: true,  // Ensures the field is mandatory
        unique: true,    // Ensures emails are unique
        trim: true       // Removes whitespace
    },
    password: {
        type: String,
        required: true,  // Ensures the field is mandatory
        minlength: 6     // Minimum length for security
    },

})
module.exports = mongoose.model('User', userSchema);

