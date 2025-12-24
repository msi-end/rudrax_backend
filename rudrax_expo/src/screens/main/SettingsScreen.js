import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS } from "../../theme/colors";
import { SPACING } from "../../theme/spacing";
import { TYPOGRAPHY } from "../../theme/typography";

export const SettingsScreen = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    autoSave: true,
    biometrics: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingsItem = ({
    icon,
    title,
    value,
    onPress,
    showChevron = true,
    color = COLORS.text,
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={[styles.settingsIcon, { backgroundColor: color + "15" }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.settingsItemText}>{title}</Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsValue}>{value}</Text>}
        {showChevron && (
          <Ionicons name="chevron-forward" size={20} color={COLORS.inactive} />
        )}
      </View>
    </TouchableOpacity>
  );

  const CustomToggle = ({ value }) => (
    <View style={[styles.toggle, value && styles.toggleActive]}>
      <View style={[styles.toggleCircle, value && styles.toggleCircleActive]} />
    </View>
  );

  const SettingsToggle = ({
    icon,
    title,
    settingKey,
    color = COLORS.primary,
  }) => {
    const isEnabled = settings[settingKey] === true;

    return (
      <TouchableOpacity
        style={styles.settingsItem}
        onPress={() => toggleSetting(settingKey)}
      >
        <View style={styles.settingsItemLeft}>
          <View
            style={[styles.settingsIcon, { backgroundColor: color + "15" }]}
          >
            <Ionicons name={icon} size={22} color={color} />
          </View>
          <Text style={styles.settingsItemText}>{title}</Text>
        </View>
        <CustomToggle value={isEnabled} />
      </TouchableOpacity>
    );
  };

  const handleClearCache = () => {
    Alert.alert("Clear Cache", "Are you sure you want to clear the cache?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          Alert.alert("Success", "Cache cleared successfully");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || "User"}</Text>
          <Text style={styles.profileEmail}>
            {user?.email || "user@example.com"}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.sectionContent}>
          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            onPress={() => {}}
            color={COLORS.primary}
          />
          <SettingsItem
            icon="key-outline"
            title="Change Password"
            onPress={() => {}}
            color={COLORS.secondary}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            onPress={() => {}}
            color={COLORS.success}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <View style={styles.sectionContent}>
          <SettingsToggle
            icon="notifications-outline"
            title="Push Notifications"
            settingKey="pushNotifications"
          />
          <SettingsToggle
            icon="mail-outline"
            title="Email Notifications"
            settingKey="emailNotifications"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.sectionContent}>
          <SettingsToggle
            icon="moon-outline"
            title="Dark Mode"
            settingKey="darkMode"
            color={COLORS.text}
          />
          <SettingsToggle
            icon="save-outline"
            title="Auto Save"
            settingKey="autoSave"
          />
          <SettingsToggle
            icon="finger-print-outline"
            title="Biometric Login"
            settingKey="biometrics"
          />
          <SettingsItem
            icon="language-outline"
            title="Language"
            value="English"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA & STORAGE</Text>
        <View style={styles.sectionContent}>
          <SettingsItem
            icon="cloud-download-outline"
            title="Download Data"
            onPress={() => {}}
            color={COLORS.primary}
          />
          <SettingsItem
            icon="trash-outline"
            title="Clear Cache"
            onPress={handleClearCache}
            color={COLORS.warning}
          />
          <SettingsItem
            icon="server-outline"
            title="Storage Usage"
            value="245 MB"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.sectionContent}>
          <SettingsItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => {}}
            color={COLORS.primary}
          />
          <SettingsItem
            icon="chatbubble-outline"
            title="Contact Support"
            onPress={() => {}}
            color={COLORS.secondary}
          />
          <SettingsItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => {}}
          />
          <SettingsItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.sectionContent}>
          <SettingsItem
            icon="information-circle-outline"
            title="App Version"
            value="1.0.0"
            onPress={() => {}}
            showChevron={false}
          />
          <SettingsItem
            icon="star-outline"
            title="Rate Us"
            onPress={() => {}}
            color={COLORS.warning}
          />
          <SettingsItem
            icon="share-social-outline"
            title="Share App"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  editButton: {
    padding: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.inactive,
    fontWeight: "600",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionContent: {
    backgroundColor: "#fff",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  settingsItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  settingsItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsValue: {
    ...TYPOGRAPHY.caption,
    color: COLORS.inactive,
    marginRight: SPACING.sm,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleCircleActive: {
    alignSelf: "flex-end",
  },
  bottomPadding: {
    height: SPACING.xl,
  },
});
