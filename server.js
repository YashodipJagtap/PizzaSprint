const express = require('express');
// import mongoose
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pizza-hunt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Log Mongo queries being executed
mongoose.set('debug', true);

// Listen on Render-compatible host
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌍 Server running on port ${PORT}`);
});
