import { FC } from "react"
import { Platform, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import type { PendingInterest } from "@/context/PipelineContext"
import { formatSentAgo, formatTimeRemainingCompact } from "@/context/PipelineContext"
import type { ActiveTask, CompletedTask } from "@/mocks/active"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export type InterestSentCardProps = {
  item: PendingInterest
  now: number
  waitingCopy: string
  onWithdraw: () => void
}

export const InterestSentCard: FC<InterestSentCardProps> = function InterestSentCard(props) {
  const { item, now, waitingCopy, onWithdraw } = props
  const { themed } = useAppTheme()

  return (
    <View style={themed($pipelineCardShell)}>
      <View style={themed($accentInterest)} />
      <View style={themed($cardBody)}>
        <Text text={item.title} weight="semiBold" size="sm" style={themed($cardTitle)} />
        <Text text={item.subtitle} size="xs" style={themed($cardSubtitle)} />

        <View style={themed($hairline)} />

        <Text text={waitingCopy} size="xxs" style={themed($waitingLine)} />

        <View style={themed($interestFooter)}>
          <Text
            text={`${formatSentAgo(item.appliedAt, now)} · ${formatTimeRemainingCompact(item.expiresAt, now)}`}
            size="xxs"
            style={themed($metaMuted)}
          />
          <Pressable
            onPress={onWithdraw}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Withdraw interest"
          >
            <Text text="Withdraw" size="xxs" weight="semiBold" style={themed($withdrawLink)} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export type ActiveJobCardProps = {
  task: ActiveTask
}

export const ActiveJobCard: FC<ActiveJobCardProps> = function ActiveJobCard(props) {
  const { task } = props
  const { themed } = useAppTheme()
  const { label: counterpartLabel, detail: counterpartDetail } = splitCounterpart(task.counterpart)
  const statusStyle = themed(statusStyleForLabel(task.statusLabel))

  return (
    <View style={themed($pipelineCardShell)}>
      <View style={themed($accentActive)} />
      <View style={themed($cardBody)}>
        <View style={themed($activeHeader)}>
          <View style={themed($titleColumn)}>
            <Text
              text={task.title}
              weight="semiBold"
              size="sm"
              style={themed($cardTitle)}
              numberOfLines={2}
            />
          </View>
          <Text text={task.statusLabel} size="xxs" weight="semiBold" style={statusStyle} />
        </View>

        {counterpartLabel ? (
          <View style={themed($counterpartBlock)}>
            <Text text={counterpartLabel} size="xxs" style={themed($counterpartLabel)} />
            <Text text={counterpartDetail} size="xs" style={themed($counterpartName)} />
          </View>
        ) : (
          <Text text={task.counterpart} size="xs" style={themed($cardSubtitle)} />
        )}

        <View style={themed($hairline)} />

        <View style={themed($activeMeta)}>
          <Text text={task.payoutOrBudget} weight="semiBold" size="sm" style={themed($payout)} />
          <Text text={task.etaLabel} size="xxs" style={themed($eta)} />
        </View>
      </View>
    </View>
  )
}

export type ActiveNowCardProps = {
  task: ActiveTask
}

export const ActiveNowCard: FC<ActiveNowCardProps> = function ActiveNowCard(props) {
  const { task } = props
  const { themed, theme } = useAppTheme()
  const statusStyle = themed(statusStyleForLabel(task.statusLabel))

  return (
    <View style={themed($activeNowShell)}>
      <View style={themed($activeNowHeader)}>
        <View style={themed($activeNowIconWrap)}>
          <Ionicons name="flash-outline" size={18} color={theme.colors.palette.primary600} />
        </View>
        <View style={themed($titleColumn)}>
          <Text text="Active now" size="xxs" style={themed($counterpartLabel)} />
          <Text text={task.title} weight="semiBold" size="sm" style={themed($cardTitle)} />
        </View>
        <Text text={task.statusLabel} size="xxs" weight="semiBold" style={statusStyle} />
      </View>
      <Text text={task.counterpart} size="xs" style={themed($cardSubtitle)} />
      <View style={themed($hairline)} />
      <View style={themed($activeMeta)}>
        <Text text={task.payoutOrBudget} weight="semiBold" size="sm" style={themed($payout)} />
        <Text text={task.etaLabel} size="xxs" style={themed($eta)} />
      </View>
    </View>
  )
}

export type CompletedJobCardProps = {
  item: CompletedTask
}

export const CompletedJobCard: FC<CompletedJobCardProps> = function CompletedJobCard(props) {
  const { item } = props
  const { themed, theme } = useAppTheme()

  return (
    <View style={themed($pipelineCardShell)}>
      <View style={themed($accentComplete)} />
      <View style={themed($cardBody)}>
        <View style={themed($activeHeader)}>
          <View style={themed($titleColumn)}>
            <Text text={item.title} weight="semiBold" size="sm" style={themed($cardTitle)} />
          </View>
          <View style={themed($completePillWrap)}>
            <Ionicons name="checkmark-circle" size={13} color={theme.colors.palette.success500} />
            <Text text="Done" size="xxs" weight="semiBold" style={themed($completePillText)} />
          </View>
        </View>

        <Text text={item.counterpart} size="xs" style={themed($cardSubtitle)} />
        <View style={themed($hairline)} />
        <View style={themed($activeMeta)}>
          <Text text={item.payoutOrBudget} weight="semiBold" size="sm" style={themed($payout)} />
          <Text text={item.completedLabel} size="xxs" style={themed($eta)} />
        </View>
      </View>
    </View>
  )
}

function splitCounterpart(counterpart: string): { label: string; detail: string } {
  const idx = counterpart.indexOf(" · ")
  if (idx === -1) return { label: "", detail: counterpart }
  return {
    label: counterpart.slice(0, idx).trim(),
    detail: counterpart.slice(idx + 3).trim(),
  }
}

function statusStyleForLabel(label: string): ThemedStyle<TextStyle> {
  const lower = label.toLowerCase()
  if (lower.includes("progress")) return $statusInProgress
  if (lower.includes("route") || lower.includes("en route")) return $statusEnRoute
  return $statusScheduled
}

const $pipelineCardShell: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: "row",
  borderRadius: 14,
  backgroundColor: colors.palette.neutral100,
  overflow: "hidden",
  ...Platform.select({
    ios: {
      shadowColor: colors.palette.neutral900,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
})

const $accentInterest: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 3,
  backgroundColor: colors.tint,
})

const $accentActive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 3,
  backgroundColor: colors.palette.secondary400,
})

const $accentComplete: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 3,
  backgroundColor: colors.palette.success500,
})

const $activeNowShell: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderRadius: 16,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.border,
  padding: spacing.md,
  gap: spacing.xs,
  ...Platform.select({
    ios: {
      shadowColor: colors.palette.neutral900,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 2 },
    default: {},
  }),
})

const $activeNowHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: spacing.sm,
})

const $activeNowIconWrap: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 32,
  height: 32,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.primary100,
})

const $cardBody: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
  gap: spacing.xs,
})

const $cardTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  lineHeight: 20,
})

const $cardSubtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  lineHeight: 18,
})

const $hairline: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: StyleSheet.hairlineWidth,
  backgroundColor: colors.separator,
  opacity: 0.9,
  marginVertical: spacing.xxs,
})

const $waitingLine: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  letterSpacing: 0.2,
})

const $interestFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: spacing.sm,
  marginTop: spacing.xxs,
})

const $metaMuted: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral700,
  flex: 1,
  lineHeight: 16,
})

const $withdrawLink: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})

const $activeHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: spacing.sm,
})

const $titleColumn: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minWidth: 0,
})

const $counterpartBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: 2,
  marginTop: spacing.xxs,
})

const $counterpartLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  letterSpacing: 0.4,
  textTransform: "uppercase",
})

const $counterpartName: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $activeMeta: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: spacing.md,
})

const $payout: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary600,
})

const $eta: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "right",
  flexShrink: 0,
})

const $statusBase: ThemedStyle<TextStyle> = ({ spacing }) => ({
  overflow: "hidden",
  paddingHorizontal: spacing.sm,
  paddingVertical: 4,
  borderRadius: 8,
  flexShrink: 0,
})

const $statusEnRoute: ThemedStyle<TextStyle> = (theme) => ({
  ...$statusBase(theme),
  color: theme.colors.palette.primary600,
  backgroundColor: theme.colors.palette.primary100,
})

const $statusScheduled: ThemedStyle<TextStyle> = (theme) => ({
  ...$statusBase(theme),
  color: theme.colors.palette.neutral700,
  backgroundColor: theme.colors.palette.neutral300,
})

const $statusInProgress: ThemedStyle<TextStyle> = (theme) => ({
  ...$statusBase(theme),
  color: theme.colors.palette.secondary500,
  backgroundColor: theme.colors.palette.secondary100,
})

const $completePillWrap: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  backgroundColor: colors.palette.success100,
  borderRadius: 8,
  paddingVertical: 4,
  paddingHorizontal: spacing.xs,
})

const $completePillText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.success500,
})
