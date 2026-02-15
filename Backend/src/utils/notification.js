const db = require('../config/database');

//CREATE NOTIFICATIONS
exports.createNotifications = async (patientId, title, message, type = 'info') => {
    try {
        await db.execute('INSERT INTO notifications ( patient_id, title, message, type) VALUES (?, ?, ?)', [patientId, title, message, type]);
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};