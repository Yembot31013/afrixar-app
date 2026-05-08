import { FC, useState } from "react"
import { ScrollView, Switch, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface NotificationSettingsScreenProps extends AppStackScreenProps<"NotificationSettings"> {}

type NotificationItem = {
  id: string
  label: string
  icon: keyof typeof Ionicons.glyphMap
}

const ITEMS: NotificationItem[] = [
  { id: "n1", label: "Job alerts", icon: "briefcase-outline" },
  { id: "n2", label: "Chat messages", icon: "chatbubble-ellipses-outline" },
  { id: "n3", label: "Wallet updates", icon: "wallet-outline" },
  { id: "n4", label: "Trust & safety", icon: "shield-checkmark-outline" },
]

export const NotificationSettingsScreen: FC<NotificationSettingsScreenProps> =
  function NotificationSettingsScreen() {
    const {
      themed,
      theme: { colors },
    } = useAppTheme()
    const [settings, setSettings] = useState<Record<string, boolean>>({
      n1: true,
      n2: true,
      n3: true,
      n4: true,
    })

    return (
      <SafeAreaView style={themed($root)} edges={["bottom"]}>
        <ScrollView contentContainerStyle={themed($content)} showsVerticalScrollIndicator={false}>
          <View style={themed($hero)}>
            <View style={themed($heroIconCircle)}>
              <Ionicons name="notifications-outline" size={34} color={colors.palette.primary600} />
            </View>
            <Text text="Notification settings" preset="subheading" />
            <Text
              text="Choose what should notify you in Konnect."
              size="xs"
              style={themed($muted)}
            />
          </View>

          <View style={themed($group)}>
            {ITEMS.map((item) => (
              <View key={item.id} style={themed($row)}>
                <View style={themed($left)}>
                  <View style={themed($rowIconWrap)}>
                    <Ionicons name={item.icon} size={15} color={colors.textDim} />
                  </View>
                  <Text text={item.label} size="sm" />
                </View>
                <Switch
                  value={!!settings[item.id]}
                  onValueChange={(value) => {
                    setSettings((prev) => ({ ...prev, [item.id]: value }))
                    console.log(`[Settings] Notification ${item.id}: ${value ? "on" : "off"}`)
                  }}
                  trackColor={{ false: colors.separator, true: colors.palette.primary300 }}
                  thumbColor={
                    settings[item.id] ? colors.palette.primary600 : colors.palette.neutral100
                  }
                />
              </View>
            ))}
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
const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textDim })
