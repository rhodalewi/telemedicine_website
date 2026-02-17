const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');
const path = require('path');
const sessionMiddleware = require('./config/session');

dotenv.config();

//INITIALIZE THE APP
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 
        
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.get('/api', (req, res) => {
    res.send('From Backend side')
});

//ROUTES
app.use('/api/user', require('./Routes/patientRoutes'));
app.use('/api/doctor', require('./Routes/doctorRoutes'));
app.use('/api/appointment', require('./Routes/appointmentRoute'));
app.use('/api/admin', require('./Routes/adminRoutes'));
app.use('/api/hospital', require('./Routes/hospitalRoutes'));
app.use('/api/notification', require('./Routes/notificationRoutes'));

//STATIC FOLDER FOR UPLOADED FILES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//START THE SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));