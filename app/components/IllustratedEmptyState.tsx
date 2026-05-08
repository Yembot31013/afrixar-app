import { FC } from "react"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export type IllustratedEmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
}

/** Centered empty state with icon ring — main app tabs and lists (not the Ignite demo EmptyState). */
export const IllustratedEmptyState: FC<IllustratedEmptyStateProps> = function IllustratedEmptyState(
  props,
) {
  const { icon, title, subtitle } = props
  const { themed, theme } = useAppTheme()

  return (
    <View style={themed($wrap)}>
      <View style={themed($iconRing)}>
        <Ionicons name={icon} size={30} color={theme.colors.tint} />
      </View>
      <Text text={title} preset="subheading" style={themed($title)} />
      <Text text={subtitle} size="sm" style={themed($subtitle)} />
    </View>
  )
}

const $wrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
  gap: spacing.sm,
  minHeight: 220,
})

const $iconRing: ThemedStyle<ViewStyle> = ({ colors, isDark }) => ({
  width: 76,
  height: 76,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isDark ? colors.palette.neutral300 : colors.palette.primary100,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: isDark ? colors.separator : colors.palette.primary200,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "center",
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
  lineHeight: 22,
  maxWidth: 300,
})
