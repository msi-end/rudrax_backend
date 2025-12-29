#!/bin/bash

# Folder name
DIR="Notifications"

# Create directory
mkdir -p "$DIR"

# 1. Get User Notifications
cat << 'EOF' > "$DIR/01-get-user-notifications.bru"
meta {
  name: Get User Notifications
  type: http
}

get {
  url: {{base_url}}/notifications
}

query {
  unreadOnly: false
  limit: 20
  offset: 0
}

headers {
  Authorization: Bearer {{token}}
}

response {
}
EOF

# 2. Get Unread Notification Count
cat << 'EOF' > "$DIR/02-get-unread-count.bru"
meta {
  name: Get Unread Notification Count
  type: http
}

get {
  url: {{base_url}}/notifications/unread-count
}

headers {
  Authorization: Bearer {{token}}
}

response {
}
EOF

# 3. Mark Notification As Read
cat << 'EOF' > "$DIR/03-mark-notification-read.bru"
meta {
  name: Mark Notification As Read
  type: http
}

patch {
  url: {{base_url}}/notifications/{{notif_Id}}/read
}

headers {
  Authorization: Bearer {{token}}
}

response {
}
EOF

# 4. Mark All Notifications As Read
cat << 'EOF' > "$DIR/04-mark-all-notifications-read.bru"
meta {
  name: Mark All Notifications As Read
  type: http
}

patch {
  url: {{base_url}}/notifications/mark-all-read
}

headers {
  Authorization: Bearer {{token}}
}

response {
}
EOF

# 5. Send Notification To Roles
cat << 'EOF' > "$DIR/05-send-notification-to-roles.bru"
meta {
  name: Send Notification To Roles
  type: http
}

post {
  url: {{base_url}}/notifications/send-to-roles
}

headers {
  Authorization: Bearer {{token}}
  Content-Type: application/json
}

body:json {
  {
    "title": "System Alert",
    "message": "Server maintenance tonight",
    "type": "info",
    "roles": ["branch", "supervisor"],
    "metadata": {
      "priority": "high"
    }
  }
}

response {
}
EOF

# 6. Send Notification To Users
cat << 'EOF' > "$DIR/06-send-notification-to-users.bru"
meta {
  name: Send Notification To Users
  type: http
}

post {
  url: {{base_url}}/notifications/send-to-users
}

headers {
  Authorization: Bearer {{token}}
  Content-Type: application/json
}

body:json {
  {
    "title": "Reminder",
    "message": "Please update your profile",
    "type": "warning",
    "userIds": [3, 7, 15],
    "metadata": {
      "screen": "profile"
    }
  }
}

response {
}
EOF

echo "✅ Bruno notification files created in ./$DIR"
