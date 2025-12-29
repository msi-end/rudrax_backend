const express = require('express');
const router = express.Router();
const NotificationController = require('@/controllers/notification');
const authMiddleware = require('@/middleware/verifyRoles');

router.get('/', NotificationController.getUserNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/:notif_Id/read', NotificationController.markAsRead);
router.patch('/mark-all-read', NotificationController.markAllAsRead);
router.post('/send-to-roles', NotificationController.sendToRoles);
router.post('/send-to-users', NotificationController.sendToUsers);

module.exports = router;
