import { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface IdVerificationScreenProps extends AppStackScreenProps<"IdVerification"> {}

export const IdVerificationScreen: FC<IdVerificationScreenProps> = function IdVerificationScreen() {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <SafeAreaView style={themed($root)} edges={["bottom"]}>
      <ScrollView contentContainerStyle={themed($content)} showsVerticalScrollIndicator={false}>
        <View style={themed($hero)}>
          <View style={themed($iconCircle)}>
            <Ionicons name="card-outline" size={34} color={colors.palette.success500} />
          </View>
          <View style={themed($verifiedChip)}>
            <Ionicons name="checkmark-circle" size={13} color={colors.palette.success500} />
            <Text
              text="Document verified"
              size="xxs"
              weight="semiBold"
              style={themed($verifiedChipTxt)}
            />
          </View>
          <Text text="ID documents approved" preset="subheading" />
        </View>

        <View style={themed($group)}>
          <DetailRow label="Document type" value="National ID" />
          <DetailRow label="Document number" value="40******28" />
          <DetailRow label="Issued country" value="Kenya" />
          <DetailRow label="Validity" value="Valid until 2029" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  const { themed } = useAppTheme()
  return (
    <View style={themed($row)}>
      <Text text={label} size="xs" style={themed($muted)} />
      <Text text={value} size="sm" weight="semiBold" />
    </View>
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
const $iconCircle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 88,
  height: 88,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.success100,
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
  borderRadius: 14,
  overflow: "hidden",
  backgroundColor: colors.palette.neutral100,
})
const $row: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  gap: 2,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})
const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textDim })
