const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    movieName: String,

    showTime: String,

    seats: Array,

    totalPrice: Number,

    bookingTime: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Booking", bookingSchema);