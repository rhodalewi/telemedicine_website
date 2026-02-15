const db = require('../config/database');

//GET NOTIFICATION FOR PATIENT
exports.getPatienttNotifications = async (req, res) => {
    const patientId = req.session.patientId;

    try {
        const [notifications] = await db.execute('SELECT notification_id, title, message, createdAT, is_read FROM notifications WHERE patient_id = ? ORDER BY createdAT DESC', [patientId]);

        return res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch notifications!', error: error.message });
    }
};

//MARK NOTIFICATION AS READ
exports.markAsRead = async (req, res) => {
    const patientId = req.session.patientId;
    const { notificationId } = req.params;

    try {
        const [notification] = await db.execute('UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND patient_id = ?', [notificationId, patientId]);

        if (notification.length === 0) {
            return res.status(400).json({ message: 'Notification not found!' });
        };

        return res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to mark notification as read!', error: error.message });
    }
};

//MARK ALL NOTIFICATION AS READ
exports.markAllRead = async (req, res) => {
    const patientId = req.session.patientId;

    try {
        const [result] = await db.execute('UPDATE notifications SET is_read = 1 WHERE patient_id = ?', [patientId]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'No notification found!' });
        };

        return res.status(200).json({ message: 'All notification marked as read' });
    } catch (error) {
        console.error(Error);
        return res.status(500).json({ message: 'Failed to mark all notifications as read!', error: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    const patientId = req.session.patientId;
    const { notificationId } = req.params;

    try {
        const [deleteResult] = await db.execute('DELETE FROM notifications WHERE notification_id = ? AND patient_id = ?', [notificationId, patientId]);

        if (deleteResult.affectedRows === 0) {
            return res.status(400).json({ message: 'Notification not found!' });
        };

        return res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Delete notification failed!', error: error.message });
    }
};