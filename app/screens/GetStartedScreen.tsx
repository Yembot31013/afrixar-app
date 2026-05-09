import { FC } from "react"
import { View, ViewStyle, TextStyle, StyleSheet, ImageBackground } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"

import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"

const bgImage = require("../../assets/images/get-started-bg.png")

interface GetStartedScreenProps extends AppStackScreenProps<"GetStarted"> { }

export const GetStartedScreen: FC<GetStartedScreenProps> = ({ navigation }) => {
  const { themed, theme: { colors } } = useAppTheme()

  return (
    <ImageBackground source={bgImage} style={themed($root)} resizeMode="cover">
      <LinearGradient
        colors={[
          "transparent",
          "rgba(0,0,0,0.4)",
          "rgba(0,0,0,0.8)",
          "rgba(0,0,0,0.95)",
        ]}
        locations={[0, 0.4, 0.7, 1]}
        style={themed($gradient)}
      />
      <SafeAreaView style={themed($container)} edges={["top", "bottom"]}>
        <View style={themed($bottomSection)}>
          <Animated.View entering={FadeInDown.delay(300).springify()} style={themed($textSection)}>
            <Text text="Your next opportunity awaits." preset="heading" style={themed($heading)} />
            <Text
              text="Connect with the best talent and find the perfect jobs near you."
              size="md"
              style={themed($subheading)}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).springify()} style={themed($buttonSection)}>
            <Button
              text="Get Started"
              preset="reversed"
              style={themed($primaryBtn)}
              onPress={() => navigation.navigate("SignUp")}
            />
            <Button
              text="Log In"
              preset="default"
              style={themed($secondaryBtn)}
              textStyle={themed($secondaryBtnText)}
              onPress={() => navigation.navigate("Login")}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $gradient: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFillObject,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xxl,
  justifyContent: "flex-end",
})

const $topSection: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: 40,
})

const $logoBox: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 90,
  height: 90,
  borderRadius: 24,
  backgroundColor: colors.palette.primary500,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: colors.palette.primary500,
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.8,
  shadowRadius: 20,
  elevation: 10,
})

const $logoText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 14,
  letterSpacing: 1,
})

const $bottomSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xl,
  justifyContent: "flex-end",
})

const $textSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $heading: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 42,
  lineHeight: 48,
  color: colors.palette.neutral100,
})

const $subheading: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral300,
  lineHeight: 24,
})

const $buttonSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $primaryBtn: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingVertical: spacing.md,
  borderRadius: 100,
  backgroundColor: colors.palette.primary500,
  borderWidth: 0,
})

const $secondaryBtn: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.md,
  borderRadius: 100,
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.3)",
})

const $secondaryBtnText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})
