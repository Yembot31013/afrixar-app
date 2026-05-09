import { TextStyle, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/Icon"
import { DiscoverScreen } from "@/screens/DiscoverScreen"
import { MyWorkScreen } from "@/screens/MyWorkScreen"
import { ProfileScreen } from "@/screens/ProfileScreen"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { ChatStackNavigator } from "./ChatStackNavigator"
import type { MainTabParamList } from "./navigationTypes"

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainTabNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 64 }]),
        tabBarActiveTintColor: colors.palette.primary500,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={24}
              color={focused ? colors.palette.primary500 : colors.textDim}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyWork"
        component={MyWorkScreen}
        options={{
          tabBarLabel: "My Tasks",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "briefcase" : "briefcase-outline"}
              size={24}
              color={focused ? colors.palette.primary500 : colors.textDim}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarLabel: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
              size={24}
              color={focused ? colors.palette.primary500 : colors.textDim}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={focused ? colors.palette.primary500 : colors.textDim}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderTopColor: colors.palette.neutral400,
  borderTopWidth: 1,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xs,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.medium,
  fontSize: 11,
})
