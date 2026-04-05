const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

// NEW (optional advanced structure support)
let userRoutes;
try {
  userRoutes = require("./routes/userRoutes");
} catch (err) {
  console.log("userRoutes not found, skipping...");
}

const app = express();


// STATIC FILES (OLD + NEW combined safely)
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));


// middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "change_this_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);


// MongoDB Connection (UNCHANGED)
mongoose.connect("mongodb://127.0.0.1:27017/movieBooking")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// Booking schema & model
const BookingSchema = new mongoose.Schema({
    name: String,
    movie: String,
    seat: String,
    date: {
        type: Date,
        default: Date.now
    }
});
const Booking = mongoose.model("Booking", BookingSchema);


// User schema/model
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    mobile: { type: String, unique: true },
    password: String
});
const User = mongoose.model("User", UserSchema);


// Movies list
const movies = [
    { id: 1, title: "Vikram", poster: "/images/vikram.jpg" },
    { id: 2, title: "Leo", poster: "/images/leo.jpg" },
    { id: 3, title: "Jailer", poster: "/images/jailer.jpg" },
    { id: 4, title: "Indian 2", poster: "/images/indian2.jpg" },
    { id: 5, title: "Kanguva", poster: "/images/kanguva.jpg" },
];


// OTP store
const otpStore = new Map();


// ROOT
app.get("/", (req, res) => {
    res.send("Movie Booking Server Running");
});


// MOVIES API
app.get("/movies", (req, res) => {
    res.json(movies);
});


// SIGNUP
app.post("/signup", async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, mobile, password: hash });

        await user.save();

        req.session.userId = user._id;

        res.json({
            success: true,
            user: { name, email, mobile }
        });

    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});


// LOGIN
app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user)
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });

        const ok = await bcrypt.compare(password, user.password);

        if (!ok)
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });

        req.session.userId = user._id;

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                mobile: user.mobile
            }
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// LOGOUT
app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.json({ success: true });
    });

});


// CURRENT USER
app.get("/me", async (req, res) => {

    if (!req.session.userId)
        return res.json({ user: null });

    const user = await User.findById(req.session.userId)
        .select("name email mobile");

    res.json({ user });

});


// SEND OTP
app.post("/send-otp", (req, res) => {

    const { mobile } = req.body;

    if (!mobile)
        return res.status(400).json({
            success: false,
            message: "mobile required"
        });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expires = Date.now() + 5 * 60 * 1000;

    otpStore.set(mobile, { code, expires });

    console.log(`OTP for ${mobile} = ${code}`);

    res.json({
        success: true,
        message: "OTP sent"
    });

});


// VERIFY OTP
app.post("/verify-otp", (req, res) => {

    const { mobile, otp } = req.body;

    const record = otpStore.get(mobile);

    if (!record)
        return res.status(400).json({
            success: false,
            message: "no otp requested"
        });

    if (Date.now() > record.expires) {

        otpStore.delete(mobile);

        return res.status(400).json({
            success: false,
            message: "otp expired"
        });

    }

    if (record.code !== otp)
        return res.status(400).json({
            success: false,
            message: "invalid otp"
        });

    otpStore.delete(mobile);

    res.json({ success: true });

});


// BOOKING API
app.post("/book", async (req, res) => {

    const { name, movie, seat } = req.body;

    const newBooking = new Booking({
        name,
        movie,
        seat
    });

    await newBooking.save();

    res.json({
        success: true,
        message: "Booking Successful"
    });

});


// NEW (optional route support)
if (userRoutes) {
  app.use("/api/users", userRoutes);
}


// START SERVER
app.listen(3000, () => {
    console.log("Server running on port 3000");
});