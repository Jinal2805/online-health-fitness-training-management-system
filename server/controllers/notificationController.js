const Notification = require("../models/Notification");

// GET USER NOTIFICATIONS
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 });
console.log("LOGGED USER:", req.user._id);
        res.json(
            notifications.map((n) => ({
                _id: n._id,
                title: n.title,
                message: n.message,
                type: n.type,
                important: n.important,
                read: n.isRead,
                time: new Date(n.createdAt).toLocaleString()
            }))
        );

    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

// MARK AS READ
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, {
            isRead: true
        });

        res.json({ message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Error updating notification" });
    }
};