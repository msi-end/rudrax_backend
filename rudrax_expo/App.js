import React, { useState } from "react";
import { StatusBar, View, Modal, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { DashboardScreen } from "./src/screens/pages/user/DashboardScreen";
import { AdminDashboard } from "./src/screens/main/AdminDashboard";
import { ManagerDashboard } from "./src/screens/main/ManagerDashboard";
import { NotificationsScreen } from "./src/screens/main/NotificationsScreen";
import { SettingsScreen } from "./src/screens/main/SettingsScreen";
import { SiteInspectionsScreen } from "./src/screens/pages/user/Site_inspection";
import { InspectionDetailsScreen } from "./src/screens/pages/user/Site_inspectionDetails";
import { SimpleDrawerContent } from "./src/components/navigation/SimpleDrawerContent";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Dashboard (if you want nested screens in Dashboard)
function DashboardStack() {
  const { isRole } = useAuth();

  const DashboardComponent = isRole("admin")
    ? AdminDashboard
    : isRole("manager")
    ? ManagerDashboard
    : DashboardScreen;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DashboardMain" component={DashboardComponent} />
      <Stack.Screen name="InspectionsList" component={SiteInspectionsScreen} />
      <Stack.Screen name="InspectionDetails" component={InspectionDetailsScreen}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Notifications
function NotificationsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="NotificationsList" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Settings
function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function TabNavigator() {
  const { isRole } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={28}
          color="#fff"
          onPress={() => setMenuVisible(true)}
          style={styles.menuIcon}
        />
        <View style={styles.headerTitle}>
          <Ionicons name="shield-checkmark" size={24} color="#fff" />
        </View>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#fff"
          style={styles.notificationIcon}
        />
      </View>

      {/* Bottom Tabs with Stack Navigators */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Dashboard") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Inspections") {
              iconName = focused ? "document-text" : "document-text-outline";
            } else if (route.name === "Notifications") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: {
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
            borderTopWidth: 1,
            borderTopColor: "#eee",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{
            title: isRole("admin")
              ? "Admin"
              : isRole("manager")
              ? "Manager"
              : "Dashboard",
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsStack}
          options={{ tabBarBadge: 3 }}
        />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>

      {/* Drawer Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <SimpleDrawerContent onClose={() => setMenuVisible(false)} />
      </Modal>
    </View>
  );
}

// Root Stack Navigator (for Auth flow)
function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40,
  },
  menuIcon: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  notificationIcon: {
    padding: 8,
  },
});
