/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Config from "@/config"
import { useAuth } from "@/context/AuthContext"
import { EditProfileScreen } from "@/screens/EditProfileScreen"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { IdVerificationScreen } from "@/screens/IdVerificationScreen"
import { KycVerificationScreen } from "@/screens/KycVerificationScreen"
import { LanguageSettingsScreen } from "@/screens/LanguageSettingsScreen"
import { LoginScreen } from "@/screens/LoginScreen"
import { NotificationSettingsScreen } from "@/screens/NotificationSettingsScreen"
import { PhoneVerificationScreen } from "@/screens/PhoneVerificationScreen"
import { ThemeSettingsScreen } from "@/screens/ThemeSettingsScreen"
import { WalletScreen } from "@/screens/WalletScreen"
import { useAppTheme } from "@/theme/context"

import { MainTabNavigator } from "./MainTabNavigator"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated } = useAuth()

  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? "MainTabs" : "Login"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="Wallet"
            component={WalletScreen}
            options={{
              headerShown: true,
              title: "Wallet",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="KycVerification"
            component={KycVerificationScreen}
            options={{
              headerShown: true,
              title: "KYC verification",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="IdVerification"
            component={IdVerificationScreen}
            options={{
              headerShown: true,
              title: "ID documents",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="PhoneVerification"
            component={PhoneVerificationScreen}
            options={{
              headerShown: true,
              title: "Phone verification",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerShown: true,
              title: "Edit profile",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="LanguageSettings"
            component={LanguageSettingsScreen}
            options={{
              headerShown: true,
              title: "Language",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="ThemeSettings"
            component={ThemeSettingsScreen}
            options={{
              headerShown: true,
              title: "Theme",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettingsScreen}
            options={{
              headerShown: true,
              title: "Notification settings",
              headerShadowVisible: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
