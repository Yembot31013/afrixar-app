import { FC } from "react"
import { Pressable, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ThemeSettingsScreenProps extends AppStackScreenProps<"ThemeSettings"> {}

type ThemeOption = {
  id: "auto" | "light" | "dark"
  label: string
  icon: keyof typeof Ionicons.glyphMap
  override: "light" | "dark" | undefined
}

const OPTIONS: ThemeOption[] = [
  { id: "auto", label: "Auto (system)", icon: "settings-outline", override: undefined },
  { id: "light", label: "Light", icon: "sunny-outline", override: "light" },
  { id: "dark", label: "Dark", icon: "moon-outline", override: "dark" },
]

export const ThemeSettingsScreen: FC<ThemeSettingsScreenProps> = function ThemeSettingsScreen() {
  const {
    themed,
    theme: { colors },
    themeContext,
    setThemeContextOverride,
  } = useAppTheme()
  const selectedId: ThemeOption["id"] =
    themeContext === undefined ? "auto" : themeContext === "dark" ? "dark" : "light"

  const onSelect = (option: ThemeOption) => {
    setThemeContextOverride(option.override)
    console.log(`[Settings] Theme selected: ${option.id} (${option.label})`)
  }

  return (
    <SafeAreaView style={themed($root)} edges={["bottom"]}>
      <ScrollView contentContainerStyle={themed($content)} showsVerticalScrollIndicator={false}>
        <View style={themed($hero)}>
          <View style={themed($heroIconCircle)}>
            <Ionicons name="contrast-outline" size={34} color={colors.palette.primary600} />
          </View>
          <Text text="Theme" preset="subheading" />
          <Text text="Choose how Konnect looks on your device." size="xs" style={themed($muted)} />
        </View>

        <View style={themed($group)}>
          {OPTIONS.map((opt) => {
            const isActive = opt.id === selectedId
            return (
              <Pressable key={opt.id} style={themed($row)} onPress={() => onSelect(opt)}>
                <View style={themed($left)}>
                  <View style={themed($rowIconWrap)}>
                    <Ionicons
                      name={opt.icon}
                      size={15}
                      color={isActive ? colors.palette.primary500 : colors.textDim}
                    />
                  </View>
                  <Text text={opt.label} size="sm" weight={isActive ? "semiBold" : "normal"} />
                </View>
                {isActive ? (
                  <Ionicons name="checkmark-circle" size={17} color={colors.palette.success500} />
                ) : null}
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  gap: spacing.md,
  paddingBottom: spacing.xxl,
})

const $hero: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.md,
  gap: spacing.xs,
})

const $heroIconCircle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 88,
  height: 88,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.primary100,
})

const $group: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 14,
  overflow: "hidden",
})

const $row: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $left: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
})

const $rowIconWrap: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 24,
  height: 24,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.neutral200,
})

const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
