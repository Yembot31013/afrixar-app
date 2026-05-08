import { FC } from "react"
import { Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { MOCK_WORKER_PROFILE } from "@/mocks/profile"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface EditProfileScreenProps extends AppStackScreenProps<"EditProfile"> {}

const FIELDS = [
  { id: "f1", label: "Display name", value: "Amina Wanjiku" },
  { id: "f2", label: "Headline", value: "Trusted home services professional" },
  { id: "f3", label: "Primary service", value: "Cleaning · Home care" },
  { id: "f4", label: "Service area", value: "Westlands, Kilimani, Kileleshwa" },
]

export const EditProfileScreen: FC<EditProfileScreenProps> = function EditProfileScreen() {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <SafeAreaView style={themed($root)} edges={["bottom"]}>
      <ScrollView contentContainerStyle={themed($content)} showsVerticalScrollIndicator={false}>
        <View style={themed($hero)}>
          <View style={themed($avatarShell)}>
            <Image source={MOCK_WORKER_PROFILE.avatar} style={themed($avatar)} />
          </View>
          <Text text="Amina Wanjiku" preset="subheading" />
          <View style={themed($verifiedChip)}>
            <Ionicons name="checkmark-circle" size={13} color={colors.palette.success500} />
            <Text
              text="Profile active"
              size="xxs"
              weight="semiBold"
              style={themed($verifiedChipTxt)}
            />
          </View>
        </View>

        <View style={themed($group)}>
          {FIELDS.map((f) => (
            <View key={f.id} style={themed($row)}>
              <Text text={f.label} size="xs" style={themed($muted)} />
              <Text text={f.value} size="sm" weight="semiBold" />
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
const $avatarShell: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 96,
  height: 96,
  borderRadius: 999,
  padding: 3,
  backgroundColor: colors.palette.primary200,
})
const $avatar: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: "100%",
  borderRadius: 999,
})
const $verifiedChip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxxs,
  backgroundColor: colors.palette.success100,
  paddingHorizontal: spacing.xs,
  paddingVertical: 4,
  borderRadius: 999,
})
const $verifiedChipTxt: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.success500,
})
const $group: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 14,
  overflow: "hidden",
})
const $row: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  gap: 2,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})
const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textDim })
