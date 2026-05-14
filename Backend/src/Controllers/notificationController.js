const db = require('../config/database');

//GET NOTIFICATION
exports.getNotifications = async (req, res) => {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    try {
        //fetch all notifications
        const [notifications] = await db.execute('SELECT * FROM notifications WHERE user_id = ? AND user_role = ? ORDER BY created_at DESC', [userId, userRole]);
        
        //get unread count for bell icon
        const [unreadCount] = await db.execute(`SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND user_role = ? AND is_read = 0`, [userId, userRole])

        return res.status(200).json({
            allNotifications: notifications,
            notificationCount: unreadCount[0].count
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch notifications!', error: error.message });
    }
};

//MARK NOTIFICATION AS READ
exports.markAsRead = async (req, res) => {
    const {notificationId} = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    try {
        //check if notification exists and belongs to the current user
        const [checkNotification] = await db.execute(
            'SELECT notification_id, is_read FROM notifications WHERE notification_id = ? AND user_id = ? AND user_role = ?',
            [notificationId, userId, userRole]
        );
        if (checkNotification.length === 0) {
            return res.status(404).json({ message: 'Notification not found or does not belong to user!' });
        }
        if (checkNotification[0].is_read === 1) {
            return res.status(400).json({ message: 'Notification already marked as read!' });
        }

        //mark notification
        await db.execute('UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ? AND user_role = ?', [notificationId, userId, userRole]);
        return res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update notification!', error: error.message });
    };
};

//MARK ALL NOTIFICATION AS READ
exports.markAllRead = async (req, res) => {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    try {
        const [allRead] = await db.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND user_role = ?', [userId, userRole]);
        if (allRead.affectedRows === 0) {
            return res.status(400).json({ message: 'No notification found!' });
        };

        return res.status(200).json({ message: 'All notification marked as read' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to mark all notifications as read!', error: error.message });
    }
};

//DELETE NOTIFICATION
exports.deleteNotification = async (req, res) => {
    const {notificationId} = req.params;
    /* const userId = req.session.id; */

    try {
        const [deleteNotification] = await db.execute('DELETE FROM notifications WHERE notification_id = ?', [notificationId]);

        //check if already deleted
        if (deleteNotification.affectedRows === 0) {
            return res.status(400).json({ message: 'Notification not found!' })
        };

        return res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: ' Failed to delete notification!', error: error.message });
    }
}; 