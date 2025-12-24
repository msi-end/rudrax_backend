import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { TYPOGRAPHY } from '../../theme/typography';

export const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const DrawerItem = ({ icon, label, onPress, color = COLORS.text }) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.drawerItemText, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.inactive} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
      </View>

      <ScrollView style={styles.drawerContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAIN</Text>
          <DrawerItem icon="home-outline" label="Home" onPress={() => props.navigation.navigate('Home')} />
          <DrawerItem icon="person-outline" label="Profile" onPress={() => {}} />
          <DrawerItem icon="stats-chart-outline" label="Analytics" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <DrawerItem icon="settings-outline" label="Settings" onPress={() => {}} />
          <DrawerItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
          <DrawerItem icon="moon-outline" label="Dark Mode" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <DrawerItem icon="help-circle-outline" label="Help Center" onPress={() => {}} />
          <DrawerItem icon="chatbubble-outline" label="Contact Us" onPress={() => {}} />
          <DrawerItem icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => {}} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <DrawerItem
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    alignItems: 'center',
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
  drawerContent: {
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
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  drawerItemText: {
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