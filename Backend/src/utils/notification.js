const db = require('../config/database');

//CREATE NOTIFICATIONS
exports.createNotifications = async ({
    user_id,
    user_role,
    title,
    message,
    type
}) => {
    try {
        await db.execute('INSERT INTO notifications ( user_id, user_role, title, message, type) VALUES ( ?, ?, ?, ?, ?)', [user_id, user_role, title, message, type]);
    } catch (error) {
        console.error('Error creating notification:', error.message);
    }
};

//Recent Notification for doctor
exports.getRecentNotification = async (userId, userRole) => {
    const [getRecentNotification] = await db.execute('SELECT * FROM notifications WHERE user_id = ? AND user_role = ? AND is_read = 0 ORDER BY created_at DESC LIMIT 5', [userId, userRole])
    return getRecentNotification;
}