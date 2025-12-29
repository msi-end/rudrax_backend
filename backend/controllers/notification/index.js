const Notification = require('@/models/notification');

class NotificationController {
   static async getUserNotifications(req, res) {
      try {
         const { unreadOnly, limit, offset } = req.query;
         const userId = req.user?.id || 5;
         const userRole = req.user?.role || 'admin';

         const notifications = await Notification.getUserNotifications(
            userId,
            userRole,
            unreadOnly === 'true',
            parseInt(limit) || 20,
            parseInt(offset) || 0
         );

         res.json({
            success: true,
            data: notifications,
         });
      } catch (error) {
         console.log('Error in notifications ',error);

         res.status(500).json({
            success: false,
            message: 'Failed to get notifications',
         });
      }
   }
   static async getUnreadCount(req, res) {
      try {
         const userId = req.user.id;
         const userRole = req.user.role;

         const count = await Notification.getNotificationCount(userId, userRole, true);

         res.json({
            success: true,
            count,
         });
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Failed to get unread count',
         });
      }
   }

   static async markAsRead(req, res) {
      try {
         const { notif_Id } = req.params;
         const userId = req.user?.id||5;

         await Notification.markAsRead(notif_Id, userId);

         res.json({
            success: true,
            message: 'Notification marked as read',
         });
      } catch (error) {
         console.log(error)
         res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read',
         });
      }
   }

   static async markAllAsRead(req, res) {
      try {
         const userId = req.user.id;

         await Notification.markAllAsRead(userId);

         res.json({
            success: true,
            message: 'All notifications marked as read',
         });
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read',
         });
      }
   }

   static async sendToRoles(req, res) {
      try {
         // Check s permission ( super_admin)
         if (req.user.role !== 'super_admin') {
            return res.status(403).json({
               success: false,
               message: 'Permission denied',
            });
         }
         const { title, message, type, roles, metadata } = req.body;
         if (!title || !message || !roles || !Array.isArray(roles)) {
            return res.status(400).json({
               success: false,
               message: 'Title, message, and roles array are required',
            });
         }

         const notificationId = await Notification.notifyRoles({ title, message, type, metadata }, roles);

         res.json({
            success: true,
            notificationId,
            message: 'Notification sent to specified roles',
         });
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Failed to send notification to roles',
         });
      }
   }

   static async sendToUsers(req, res) {
      try {
         // Check permission ( super_admin or supervisor)
         if (!['super_admin', 'supervisor'].includes(req.user.role)) {
            return res.status(403).json({
               success: false,
               message: 'Permission denied',
            });
         }

         const { title, message, type, userIds, metadata } = req.body;

         if (!title || !message || !userIds || !Array.isArray(userIds)) {
            return res.status(400).json({
               success: false,
               message: 'Title, message, and userIds array are required',
            });
         }

         const notificationId = await Notification.notifyUsers({ title, message, type, metadata }, userIds);

         res.json({
            success: true,
            notificationId,
            message: 'Notification sent to specified users',
         });
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Failed to send notification to users',
         });
      }
   }
}

module.exports = NotificationController;
