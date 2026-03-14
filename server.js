const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// REPLACE THIS LINK WITH YOUR ACTUAL MONGODB LINK
const mongoURI = "mongodb+srv://Aryanpopalghat:Aryanpopalghat23@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ DATABASE CONNECTED"))
    .catch(err => console.error("❌ CONNECTION ERROR:", err.message));

// DATA MODELS
const Worker = mongoose.model('Worker', new mongoose.Schema({
    name: String, service: String, phone: String, lat: Number, lng: Number
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
    name: String, service: String, phone: String, address: String, date: { type: Date, default: Date.now }
}));

// API ROUTES
app.get('/api/workers', async (req, res) => {
    try { res.json(await Worker.find()); } catch (e) { res.status(500).json([]); }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: "Booking Confirmed!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/apply', async (req, res) => {
    try {
        const { workerName, workerService, workerPhone, workerLat, workerLng } = req.body;
        const newWorker = new Worker({
            name: workerName, service: workerService, phone: workerPhone,
            lat: parseFloat(workerLat) || 28.61, lng: parseFloat(workerLng) || 77.20
        });
        await newWorker.save();
        res.status(201).json({ message: "Application Successful!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN DATA
app.get('/api/admin/bookings', async (req, res) => res.json(await Booking.find()));
app.get('/api/admin/applications', async (req, res) => res.json(await Worker.find()));

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
