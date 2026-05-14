const express = require('express');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../Middleware/authMiddleware');
const { getNotifications, markAsRead, markAllRead, deleteNotification } = require('../Controllers/notificationController');

//GET NOTIFICATIONS FOR USERS;
router.get('/getNotifications', isAuthenticated, authorizeRoles('patient', 'doctor'), getNotifications);

//MARK ONE NOTIFICATION AS READ
router.put('/markAsRead/:notificationId/read', isAuthenticated, authorizeRoles('patient', 'doctor'), markAsRead);

//MARK ALL NOTIFICATION AS READ
router.put('/markAllRead', isAuthenticated, authorizeRoles('patient', 'doctor'), markAllRead);

//DELETE NOTIFICATION
router.delete('/deleteNotification/:notificationId', isAuthenticated, deleteNotification);

module.exports = router;