require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_URL);

const User = require('./models/user.model');

const express = require('express');
const cors = require('cors');
const app = express();

//Routes
const authRoutes = require('./routes/auth');
const notesAppRoutes = require('./routes/notes-app');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

app.use(authRoutes);
app.use(notesAppRoutes);

app.listen(8000);

module.exports = app;