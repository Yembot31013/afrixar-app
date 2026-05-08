import { FC, useState } from "react"
import { Pressable, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface LanguageSettingsScreenProps extends AppStackScreenProps<"LanguageSettings"> {}

type LanguageOption = {
  id: string
  label: string
  icon: keyof typeof Ionicons.glyphMap
}

const LANGUAGES: LanguageOption[] = [
  { id: "en-ke", label: "English (Kenya)", icon: "language-outline" },
  { id: "sw-ke", label: "Swahili", icon: "chatbubble-ellipses-outline" },
  { id: "fr", label: "French", icon: "globe-outline" },
]

export const LanguageSettingsScreen: FC<LanguageSettingsScreenProps> =
  function LanguageSettingsScreen() {
    const {
      themed,
      theme: { colors },
    } = useAppTheme()
    const [selectedId, setSelectedId] = useState<string>("en-ke")

    const onSelect = (option: LanguageOption) => {
      setSelectedId(option.id)
      console.log(`[Settings] Language selected: ${option.id} (${option.label})`)
    }

    return (
      <SafeAreaView style={themed($root)} edges={["bottom"]}>
        <ScrollView contentContainerStyle={themed($content)} showsVerticalScrollIndicator={false}>
          <View style={themed($hero)}>
            <View style={themed($heroIconCircle)}>
              <Ionicons name="language" size={34} color={colors.palette.primary600} />
            </View>
            <Text text="Language" preset="subheading" />
            <Text
              text="Choose the language used in your app interface."
              size="xs"
              style={themed($muted)}
            />
          </View>

          <View style={themed($group)}>
            {LANGUAGES.map((lang) => {
              const isActive = lang.id === selectedId
              return (
                <Pressable key={lang.id} style={themed($row)} onPress={() => onSelect(lang)}>
                  <View style={themed($left)}>
                    <Ionicons name={lang.icon} size={16} color={colors.textDim} />
                    <Text text={lang.label} size="sm" weight={isActive ? "semiBold" : "normal"} />
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

const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
