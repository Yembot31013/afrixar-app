import { ComponentType, FC, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { FadeInDown } from "react-native-reanimated"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = ({ navigation }) => {
  const authEmailInput = useRef<TextInput>(null)
  const authPasswordInput = useRef<TextInput>(null)

  const [authName, setAuthName] = useState("")
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { setAuthToken } = useAuth()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  function signUp() {
    setIsSubmitted(true)
    if (!authName || !authEmail || !authPassword) return

    setIsSubmitted(false)
    // Mock login with fake token
    setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  return (
    <SafeAreaView style={themed($root)} edges={["top", "bottom"]}>
      <View style={themed($header)}>
        <PressableIcon 
          icon="back" 
          size={24} 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("GetStarted")} 
          color={colors.text} 
        />
      </View>

      <View style={themed($screenContentContainer)}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text text="Create Account" preset="heading" style={themed($heading)} />
          <Text text="Join Konnect and discover your next opportunity." preset="subheading" style={themed($subheading)} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TextField
            value={authName}
            onChangeText={setAuthName}
            containerStyle={themed($textField)}
            autoCapitalize="words"
            autoComplete="name"
            autoCorrect={false}
            label="Full Name"
            placeholder="John Doe"
            onSubmitEditing={() => authEmailInput.current?.focus()}
          />

          <TextField
            ref={authEmailInput}
            value={authEmail}
            onChangeText={setAuthEmail}
            containerStyle={themed($textField)}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            label="Email Address"
            placeholder="john@example.com"
            onSubmitEditing={() => authPasswordInput.current?.focus()}
          />

          <TextField
            ref={authPasswordInput}
            value={authPassword}
            onChangeText={setAuthPassword}
            containerStyle={themed($textField)}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            secureTextEntry={isAuthPasswordHidden}
            label="Password"
            placeholder="Create a strong password"
            onSubmitEditing={signUp}
            RightAccessory={PasswordRightAccessory}
          />

          <Button
            testID="signup-button"
            text="Create Account"
            style={themed($tapButton)}
            preset="reversed"
            onPress={signUp}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={themed($footer)}>
          <Text text="Already have an account?" size="sm" style={themed($footerText)} />
          <Button
            preset="default"
            text="Log In"
            style={themed($loginLink)}
            textStyle={themed($loginLinkText)}
            onPress={() => navigation.navigate("Login")}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.sm,
  paddingBottom: spacing.xs,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
})

const $heading: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xs,
  fontSize: 32,
  lineHeight: 40,
  color: colors.text,
})

const $subheading: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xl,
  color: colors.textDim,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.md,
  paddingVertical: spacing.md,
  borderRadius: 100,
  backgroundColor: colors.palette.primary500,
  borderWidth: 0,
})

const $footer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.xl,
  gap: spacing.xs,
})

const $footerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $loginLink: ThemedStyle<ViewStyle> = () => ({
  minHeight: 0,
  paddingHorizontal: 0,
  paddingVertical: 0,
  backgroundColor: "transparent",
  borderWidth: 0,
})

const $loginLinkText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontWeight: "bold",
})
