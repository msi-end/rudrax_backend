import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { TYPOGRAPHY } from '../../theme/typography';

export const SimpleDrawerContent = ({ onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          onClose();
          logout();
        },
      },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, color = COLORS.text }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.inactive} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.overlay}>
     
      <View style={styles.menu}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MAIN</Text>
            <MenuItem icon="home-outline" label="Home" onPress={onClose} />
            <MenuItem icon="person-outline" label="Profile" onPress={onClose} />
            <MenuItem icon="stats-chart-outline" label="Analytics" onPress={onClose} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
            <MenuItem icon="settings-outline" label="Settings" onPress={onClose} />
            <MenuItem icon="notifications-outline" label="Notifications" onPress={onClose} />
            <MenuItem icon="moon-outline" label="Dark Mode" onPress={onClose} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUPPORT</Text>
            <MenuItem icon="help-circle-outline" label="Help Center" onPress={onClose} />
            <MenuItem icon="chatbubble-outline" label="Contact Us" onPress={onClose} />
            <MenuItem icon="shield-checkmark-outline" label="Privacy Policy" onPress={onClose} />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <MenuItem
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
            color={COLORS.error}
          />
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </View>
       <TouchableOpacity 
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: 280,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    padding: 8,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userName: {
    ...TYPOGRAPHY.h3,
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  menuContent: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.inactive,
    fontWeight: '600',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  menuItemText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    marginLeft: SPACING.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: SPACING.md,
  },
  versionContainer: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  versionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.inactive,
  },
});