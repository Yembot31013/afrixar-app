import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Alert, Modal, Pressable, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export type WorkNature = "on_site" | "remote" | "hybrid" | "either"
export type BudgetBand = "any" | "under_2k" | "2k_10k" | "10k_plus"
export type TimingPreference = "today" | "this_week" | "flexible"
export type SortPreference = "nearest" | "budget" | "newest"

export type DiscoverFilterValues = {
  radiusKm: number
  workNature: WorkNature
  categories: string[]
  budget: BudgetBand
  timing: TimingPreference
  sort: SortPreference
  verifiedOnly: boolean
}

export const DEFAULT_DISCOVER_FILTERS: DiscoverFilterValues = {
  radiusKm: 10,
  workNature: "either",
  categories: [],
  budget: "any",
  timing: "flexible",
  sort: "nearest",
  verifiedOnly: false,
}

const RADIUS_OPTIONS = [2, 5, 10, 25, 100] as const
const CATEGORY_OPTIONS = ["Home", "Tech", "Delivery", "Creative"] as const

const PRIORITY_PREVIEW_ROWS = [
  {
    key: "radius",
    title: "Extended radius boost",
    subtitle: "Prioritized matches slightly beyond your selected radius.",
  },
  {
    key: "queue",
    title: "Priority invite queue",
    subtitle: "Your invites surface faster when you hire.",
  },
  {
    key: "verified",
    title: "Verified sender lift",
    subtitle: "Stronger trust placement for verified profiles.",
  },
] as const

export function countActiveDiscoverFilters(v: DiscoverFilterValues): number {
  let n = 0
  if (v.radiusKm !== DEFAULT_DISCOVER_FILTERS.radiusKm) n++
  if (v.workNature !== DEFAULT_DISCOVER_FILTERS.workNature) n++
  if (v.categories.length > 0) n++
  if (v.budget !== DEFAULT_DISCOVER_FILTERS.budget) n++
  if (v.timing !== DEFAULT_DISCOVER_FILTERS.timing) n++
  if (v.sort !== DEFAULT_DISCOVER_FILTERS.sort) n++
  if (v.verifiedOnly !== DEFAULT_DISCOVER_FILTERS.verifiedOnly) n++
  return n
}

function radiusLabel(km: number): string {
  if (km >= 100) return "City-wide"
  return `${km} km`
}

type Props = {
  visible: boolean
  initialValues: DiscoverFilterValues
  onClose: () => void
  /** Filters are not applied to mock data yet — parent runs loading UX only. */
  onApply: (values: DiscoverFilterValues, activeCount: number) => void
}

export const DiscoverFiltersModal: FC<Props> = function DiscoverFiltersModal({
  visible,
  initialValues,
  onClose,
  onApply,
}) {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const [draft, setDraft] = useState<DiscoverFilterValues>(initialValues)

  useEffect(() => {
    if (visible) setDraft(initialValues)
  }, [visible, initialValues])

  const activeCount = useMemo(() => countActiveDiscoverFilters(draft), [draft])

  const reset = useCallback(() => {
    setDraft({ ...DEFAULT_DISCOVER_FILTERS })
  }, [])

  const apply = useCallback(() => {
    onApply(draft, activeCount)
  }, [draft, activeCount, onApply])

  const toggleCategory = (c: string) => {
    setDraft((d) => {
      const has = d.categories.includes(c)
      return {
        ...d,
        categories: has ? d.categories.filter((x) => x !== c) : [...d.categories, c],
      }
    })
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={themed($modalRoot)} edges={["top", "bottom"]}>
        <View style={themed($modalHeader)}>
          <Pressable
            onPress={onClose}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
          >
            <Ionicons name="close" size={28} color={colors.text} />
          </Pressable>
          <Text text="Match preferences" preset="heading" size="xl" style={themed($headerTitle)} />
          <Pressable onPress={reset} hitSlop={12}>
            <Text text="Reset" size="sm" weight="semiBold" style={themed($resetBtn)} />
          </Pressable>
        </View>

        <ScrollView
          style={themed($scroll)}
          contentContainerStyle={themed($scrollContent)}
          showsVerticalScrollIndicator={false}
        >
          <Text
            text="Fine-tune what appears in your deck. Konnect will rank nearby opportunities that fit — you can change this anytime."
            size="sm"
            style={themed($intro)}
          />

          <Text text="Search radius" preset="formLabel" style={themed($sectionLabel)} />
          <View style={themed($chipWrap)}>
            {RADIUS_OPTIONS.map((km) => {
              const on = draft.radiusKm === km
              return (
                <Pressable
                  key={km}
                  style={themed(on ? $chipOn : $chipOff)}
                  onPress={() => setDraft((d) => ({ ...d, radiusKm: km }))}
                >
                  <Text
                    text={radiusLabel(km)}
                    size="xs"
                    weight="semiBold"
                    style={themed(on ? $chipLabelOn : $chipLabelOff)}
                  />
                </Pressable>
              )
            })}
          </View>

          <Text text="Work nature" preset="formLabel" style={themed($sectionLabel)} />
          <View style={themed($chipWrap)}>
            {(
              [
                ["on_site", "On-site"],
                ["remote", "Remote"],
                ["hybrid", "Hybrid"],
                ["either", "Either"],
              ] as const
            ).map(([key, label]) => {
              const on = draft.workNature === key
              return (
                <Pressable
                  key={key}
                  style={themed(on ? $chipOn : $chipOff)}
                  onPress={() => setDraft((d) => ({ ...d, workNature: key }))}
                >
                  <Text
                    text={label}
                    size="xs"
                    weight="semiBold"
                    style={themed(on ? $chipLabelOn : $chipLabelOff)}
                  />
                </Pressable>
              )
            })}
          </View>

          <Text text="Categories" preset="formLabel" style={themed($sectionLabel)} />
          <Text text="Leave empty to include every category." size="xxs" style={themed($hint)} />
          <View style={themed($chipWrap)}>
            {CATEGORY_OPTIONS.map((c) => {
              const on = draft.categories.includes(c)
              return (
                <Pressable
                  key={c}
                  style={themed(on ? $chipOn : $chipOff)}
                  onPress={() => toggleCategory(c)}
                >
                  <Text
                    text={c}
                    size="xs"
                    weight="semiBold"
                    style={themed(on ? $chipLabelOn : $chipLabelOff)}
                  />
                </Pressable>
              )
            })}
          </View>

          <Text text="Budget band" preset="formLabel" style={themed($sectionLabel)} />
          <View style={themed($chipWrap)}>
            {(
              [
                ["any", "Any"],
                ["under_2k", "Under KES 2k"],
                ["2k_10k", "KES 2k – 10k"],
                ["10k_plus", "KES 10k+"],
              ] as const
            ).map(([key, label]) => {
              const on = draft.budget === key
              return (
                <Pressable
                  key={key}
                  style={themed(on ? $chipOn : $chipOff)}
                  onPress={() => setDraft((d) => ({ ...d, budget: key }))}
                >
                  <Text
                    text={label}
                    size="xs"
                    weight="semiBold"
                    style={themed(on ? $chipLabelOn : $chipLabelOff)}
                  />
                </Pressable>
              )
            })}
          </View>

          <Text text="When you need it" preset="formLabel" style={themed($sectionLabel)} />
          <View style={themed($chipWrap)}>
            {(
              [
                ["today", "Today"],
                ["this_week", "This week"],
                ["flexible", "Flexible"],
              ] as const
            ).map(([key, label]) => {
              const on = draft.timing === key
              return (
                <Pressable
                  key={key}
                  style={themed(on ? $chipOn : $chipOff)}
                  onPress={() => setDraft((d) => ({ ...d, timing: key }))}
                >
                  <Text
                    text={label}
                    size="xs"
                    weight="semiBold"
                    style={themed(on ? $chipLabelOn : $chipLabelOff)}
                  />
                </Pressable>
              )
            })}
          </View>

          <Text text="Sort deck by" preset="formLabel" style={themed($sectionLabel)} />
          <View style={themed($chipWrap)}>
            {(
              [
                ["nearest", "Nearest first"],
                ["budget", "Highest budget"],
                ["newest", "Newest posts"],
              ] as const
            ).map(([key, label]) => {
              const on = draft.sort === key
              return (
                <Pressable
                  key={key}
                  style={themed(on ? $chipOn : $chipOff)}
                  onPress={() => setDraft((d) => ({ ...d, sort: key }))}
                >
                  <Text
                    text={label}
                    size="xs"
                    weight="semiBold"
                    style={themed(on ? $chipLabelOn : $chipLabelOff)}
                  />
                </Pressable>
              )
            })}
          </View>

          <Pressable
            style={themed($toggleRow)}
            onPress={() => setDraft((d) => ({ ...d, verifiedOnly: !d.verifiedOnly }))}
          >
            <View style={themed($toggleText)}>
              <Text text="Verified listings only" weight="semiBold" size="sm" />
              <Text
                text="IDs and businesses checked by Konnect — fewer surprises."
                size="xxs"
                style={themed($hint)}
              />
            </View>
            <View style={themed(draft.verifiedOnly ? $switchOn : $switchOff)}>
              <View
                style={[
                  themed($switchKnob),
                  themed(draft.verifiedOnly ? $switchKnobEnd : $switchKnobStart),
                ]}
              />
            </View>
          </Pressable>

          <Text text="Konnect Priority" preset="formLabel" style={themed($sectionLabel)} />
          <Text
            text="Premium filters stay optional — preview what unlocks with Priority."
            size="xxs"
            style={themed($hint)}
          />
          {PRIORITY_PREVIEW_ROWS.map((row) => (
            <Pressable
              key={row.key}
              style={themed($premiumLockedRow)}
              onPress={() =>
                Alert.alert(
                  "Konnect Priority",
                  "Radius boost, invite priority, and verified lift ship with subscription pricing — launching soon.",
                )
              }
            >
              <Ionicons name="lock-closed-outline" size={18} color={colors.textDim} />
              <View style={themed($premiumLockedText)}>
                <Text text={row.title} weight="semiBold" size="sm" />
                <Text text={row.subtitle} size="xxs" style={themed($hint)} />
              </View>
              <Text text="Premium" size="xxs" weight="bold" style={themed($premiumPill)} />
            </Pressable>
          ))}

          <View style={themed($footnote)}>
            <Ionicons name="information-circle-outline" size={18} color={colors.textDim} />
            <Text
              text="Matching uses live data in production. This preview keeps your deck unchanged — we're polishing the engine."
              size="xxs"
              style={themed($footnoteText)}
            />
          </View>
        </ScrollView>

        <View style={themed($footer)}>
          <Pressable style={themed($applyBtn)} onPress={apply}>
            <Text text="Apply preferences" weight="bold" size="sm" style={themed($applyLabel)} />
            {activeCount > 0 ? (
              <View style={themed($applyBadge)}>
                <Text
                  text={String(activeCount)}
                  size="xxs"
                  weight="bold"
                  style={themed($applyBadgeText)}
                />
              </View>
            ) : null}
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const $modalRoot: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $modalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.sm,
})

const $headerTitle: ThemedStyle<TextStyle> = () => ({
  flex: 1,
  textAlign: "center",
})

const $resetBtn: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})

const $scroll: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $scrollContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.md,
  gap: spacing.sm,
})

const $intro: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  lineHeight: 22,
  marginBottom: spacing.sm,
})

const $sectionLabel: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

const $hint: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginTop: -4,
})

const $chipWrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.xs,
})

const $chipOn: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs + 2,
  borderRadius: 999,
  backgroundColor: colors.palette.overlay20,
  borderWidth: 1,
  borderColor: colors.tint,
})

const $chipOff: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs + 2,
  borderRadius: 999,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.border,
})

const $chipLabelOn: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $chipLabelOff: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $toggleRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: spacing.md,
  padding: spacing.md,
  borderRadius: spacing.md,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  marginTop: spacing.sm,
})

const $toggleText: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  gap: 4,
})

const $switchOff: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 48,
  height: 28,
  borderRadius: 14,
  backgroundColor: colors.palette.neutral400,
  padding: 3,
  justifyContent: "center",
})

const $switchOn: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 48,
  height: 28,
  borderRadius: 14,
  backgroundColor: colors.tint,
  padding: 3,
  justifyContent: "center",
})

const $switchKnob: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: colors.palette.neutral100,
})

const $switchKnobStart: ThemedStyle<ViewStyle> = () => ({
  marginLeft: 2,
})

const $switchKnobEnd: ThemedStyle<ViewStyle> = () => ({
  marginLeft: 22,
})

const $footnote: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: spacing.xs,
  marginTop: spacing.md,
  paddingBottom: spacing.sm,
})

const $footnoteText: ThemedStyle<TextStyle> = ({ colors }) => ({
  flex: 1,
  color: colors.textDim,
  lineHeight: 18,
})

const $footer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.sm,
  paddingBottom: spacing.md,
  borderTopWidth: 1,
  borderTopColor: colors.palette.neutral400,
  backgroundColor: colors.background,
})

const $applyBtn: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: spacing.sm,
  paddingVertical: spacing.md,
  borderRadius: spacing.md,
  backgroundColor: colors.palette.primary500,
})

const $applyLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $applyBadge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  minWidth: 22,
  height: 22,
  paddingHorizontal: 6,
  borderRadius: 11,
  backgroundColor: colors.palette.neutral100,
  alignItems: "center",
  justifyContent: "center",
})

const $applyBadgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})

const $premiumLockedRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.palette.neutral100,
})

const $premiumLockedText: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minWidth: 0,
  gap: 2,
})

const $premiumPill: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
