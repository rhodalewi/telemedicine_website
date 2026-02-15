const express = require('express');
const router = express.Router();
const { patientSessionAuth, isPatient } = require('../Middleware/authMiddleware');
const { getPatienttNotifications, markAsRead, markAllRead, deleteNotification } = require('../Controllers/notificationController');

//GET NOTIFICATIONS FOR PATIENT;
router.get('/patientNotifications', patientSessionAuth, isPatient, getPatienttNotifications);

//MARK ONE NOTIFICATION AS READ
router.put('/markAsRead/:notificationId/read', patientSessionAuth, isPatient, markAsRead);

//MARK ALL NOTIFICATION AS READ
router.put('/markAllRead', patientSessionAuth, isPatient, markAllRead);

//DELETE NOTIFICATION
router.delete('/deleteNotification/:notificationId', patientSessionAuth, isPatient, deleteNotification);

module.exports = router;