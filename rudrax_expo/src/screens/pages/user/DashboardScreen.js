// This is a placeholder file for src/screens/main/DashboardScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { COLORS } from "../../../theme/colors";
import { SPACING } from "../../../theme/spacing";
import { TYPOGRAPHY } from "../../../theme/typography";

const { width } = Dimensions.get("window");

export const DashboardScreen = ({navigation}) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    tasks: 24,
    projects: 12,
    completed: 156,
    pending: 8,
  });
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      title: "Project Alpha Updated",
      time: "5 min ago",
      type: "update",
    },
    { id: 2, title: "New Task Assigned", time: "1 hour ago", type: "task" },
    { id: 3, title: "Meeting Scheduled", time: "2 hours ago", type: "meeting" },
    { id: 4, title: "Document Uploaded", time: "3 hours ago", type: "upload" },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getActivityIcon = (type) => {
    const icons = {
      update: "refresh-circle",
      task: "checkmark-circle",
      meeting: "calendar",
      upload: "cloud-upload",
    };
    return icons[type] || "ellipse";
  };

  const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
      <View
        style={[styles.statIconContainer, { backgroundColor: color + "15" }]}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  // const ActivityCard = ({ activity }) => (
  //   <TouchableOpacity style={styles.activityCard}>
  //     <View style={styles.activityIconContainer}>
  //       <Ionicons name={getActivityIcon(activity.type)} size={20} color={COLORS.primary} />
  //     </View>
  //     <View style={styles.activityContent}>
  //       <Text style={styles.activityTitle}>{activity.title}</Text>
  //       <Text style={styles.activityTime}>{activity.time}</Text>
  //     </View>
  //     <Ionicons name="chevron-forward" size={20} color={COLORS.inactive} />
  //   </TouchableOpacity>
  // );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="checkmark-done"
          value={stats.tasks}
          label="Active Tasks"
          color={COLORS.primary}
        />
        <StatCard
          icon="briefcase"
          value={stats.projects}
          label="Projects"
          color={COLORS.secondary}
        />
        <StatCard
          icon="trophy"
          value={stats.completed}
          label="Completed"
          color={COLORS.success}
        />
        <StatCard
          icon="time"
          value={stats.pending}
          label="Pending"
          color={COLORS.warning}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity</Text> 
          {/* <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity> */}
        </View>

        {/* {recentActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))} */}
        <TouchableOpacity style={styles.activityCard} onPress={() => navigation.navigate('InspectionsList')}>
          <View style={styles.activityIconContainer}>
            <Ionicons
              name={getActivityIcon()}
              size={20}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Site Inspection</Text>
            <Text style={styles.activityTime}>update a site inspection </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.inactive} />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>New Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="folder-open" size={24} color={COLORS.secondary} />
            <Text style={styles.quickActionText}>Projects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="people" size={24} color={COLORS.success} />
            <Text style={styles.quickActionText}>Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="stats-chart" size={24} color={COLORS.warning} />
            <Text style={styles.quickActionText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: "#fff",
  },
  greeting: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statCard: {
    width: (width - SPACING.md * 3) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  seeAll: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "600",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  activityTime: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  quickActionButton: {
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: "#fff",
    borderRadius: 12,
    flex: 1,
    marginHorizontal: SPACING.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.text,
    marginTop: SPACING.sm,
    fontWeight: "600",
  },
});
