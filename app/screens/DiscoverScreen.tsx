import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Pressable, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import {
  DEFAULT_DISCOVER_FILTERS,
  DiscoverFiltersModal,
  type DiscoverFilterValues,
} from "@/components/discover/DiscoverFiltersModal"
import { DiscoverRadarLoading } from "@/components/discover/DiscoverRadarLoading"
import { SwipeDeck, type SwipeDirection } from "@/components/discover/SwipeDeck"
import { Text } from "@/components/Text"
import type { AppMode } from "@/context/AppModeContext"
import { usePipeline } from "@/context/PipelineContext"
import type { DiscoverCard } from "@/mocks/discover"
import { filterDiscoverCards } from "@/mocks/discover"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const LOADING_MESSAGES = [
  "Scanning what’s open near you…",
  "Applying your preferences…",
  "Ranking by fit, distance, and freshness…",
  "Almost there — polishing your deck…",
]

interface DiscoverScreenProps extends MainTabScreenProps<"Discover"> {}

export const DiscoverScreen: FC<DiscoverScreenProps> = function DiscoverScreen() {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  /** Discover feed uses the earn/tasks deck only (no mode toggle on this screen). */
  const mode: AppMode = "worker"
  const { recordInterest } = usePipeline()

  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [savedFilters, setSavedFilters] = useState<DiscoverFilterValues>(DEFAULT_DISCOVER_FILTERS)
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [deckLoading, setDeckLoading] = useState(false)
  const [loadingLine, setLoadingLine] = useState(0)

  const baseDeck = useMemo(() => filterDiscoverCards(mode, "All"), [])

  const [queue, setQueue] = useState<DiscoverCard[]>(baseDeck)

  useEffect(() => {
    setQueue(baseDeck)
  }, [baseDeck])

  useEffect(() => {
    if (!deckLoading) return undefined
    const id = setInterval(() => {
      setLoadingLine((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 700)
    return () => clearInterval(id)
  }, [deckLoading])

  useEffect(() => {
    if (!deckLoading) return undefined
    const t = setTimeout(() => {
      setQueue(filterDiscoverCards(mode, "All"))
      setDeckLoading(false)
    }, 1850)
    return () => clearTimeout(t)
  }, [deckLoading])

  const onSwipe = (direction: SwipeDirection, item: DiscoverCard) => {
    if (direction === "right") {
      recordInterest(item, mode)
    }
    setQueue((q) => q.filter((c) => c.id !== item.id))
  }

  const handleApplyFilters = useCallback((values: DiscoverFilterValues, count: number) => {
    setSavedFilters(values)
    setActiveFilterCount(count)
    setFilterSheetOpen(false)
    setLoadingLine(0)
    setDeckLoading(true)
  }, [])

  const rightStamp = "INTEREST"
  const subline = "Swipe right to show interest — they accept to match."

  const renderCard = (card: DiscoverCard) => {
    if (card.kind === "task") {
      return (
        <View style={themed($cardInner)}>
          <View style={themed($pillRow)}>
            <Text
              text={card.category.toUpperCase()}
              size="xxs"
              weight="bold"
              style={themed($pill)}
            />
            <Text
              text={card.urgency === "today" ? "TODAY" : "FLEX"}
              size="xxs"
              weight="bold"
              style={themed(card.urgency === "today" ? $pillAccent : $pillMuted)}
            />
          </View>
          <Text text={card.title} preset="heading" style={themed($cardTitle)} />
          <Text text={card.summary} size="sm" style={themed($cardBody)} />
          <View style={themed($metaRow)}>
            <Text text={card.location} size="xs" weight="semiBold" />
            <Text text={card.budgetLabel} size="xs" weight="semiBold" style={themed($accent)} />
          </View>
          <View style={themed($footerRow)}>
            <Text text={`Posted by ${card.posterName}`} size="xxs" style={themed($muted)} />
            <Text text={card.duration} size="xxs" style={themed($muted)} />
          </View>
        </View>
      )
    }

    return (
      <View style={themed($cardInner)}>
        <View style={themed($pillRow)}>
          <Text text="TALENT" size="xxs" weight="bold" style={themed($pillTalent)} />
          {card.badge ? (
            <Text
              text={card.badge.toUpperCase()}
              size="xxs"
              weight="bold"
              style={themed($pillAccent)}
            />
          ) : null}
        </View>
        <Text text={card.name} preset="heading" style={themed($cardTitle)} />
        <Text text={card.headline} size="sm" weight="semiBold" style={themed($accent)} />
        <Text text={card.skillTags.join(" · ")} size="xs" style={themed($cardBody)} />
        <View style={themed($metaRow)}>
          <Text
            text={`${card.rating.toFixed(2)}★ · ${card.jobsDone} jobs`}
            size="xs"
            weight="semiBold"
          />
          <Text text={`${card.responseMins}m avg reply`} size="xs" style={themed($muted)} />
        </View>
        <Text text={card.neighborhood} size="xxs" style={themed($muted)} />
      </View>
    )
  }

  return (
    <SafeAreaView style={themed($root)} edges={["top"]}>
      <DiscoverFiltersModal
        visible={filterSheetOpen}
        initialValues={savedFilters}
        onClose={() => setFilterSheetOpen(false)}
        onApply={handleApplyFilters}
      />

      <ScrollView
        contentContainerStyle={themed($scroll)}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={themed($headerBlock)}>
          <View style={themed($titleRow)}>
            <View style={themed($titleTextWrap)}>
              <Text text="Discover" preset="heading" style={themed($heroHeading)} />
            </View>
            <Pressable
              style={themed($filterBtn)}
              onPress={() => setFilterSheetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Open match preferences"
              hitSlop={8}
            >
              <Ionicons name="filter-outline" size={22} color={colors.textDim} />
              {activeFilterCount > 0 ? (
                <View style={themed($filterBadge)}>
                  <Text
                    text={activeFilterCount > 9 ? "9+" : String(activeFilterCount)}
                    size="xxs"
                    weight="bold"
                    style={themed($filterBadgeText)}
                  />
                </View>
              ) : null}
            </Pressable>
          </View>
          <Text text={subline} size="xs" style={themed($muted)} numberOfLines={3} />
        </View>

        <View style={themed($deckSection)}>
          {deckLoading ? (
            <DiscoverRadarLoading
              message={LOADING_MESSAGES[loadingLine]}
              hint="Tuning your deck — hang tight."
            />
          ) : (
            <SwipeDeck<DiscoverCard>
              items={queue}
              onSwipe={onSwipe}
              renderCard={(item) => renderCard(item)}
              rightStampLabel={rightStamp}
              leftStampLabel="SKIP"
              emptyHint="You’re caught up. Adjust preferences for a fresh pass."
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $scroll: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xxl,
  gap: spacing.md,
})

const $headerBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
  paddingTop: spacing.xxs,
})

const $titleRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
})

const $titleTextWrap: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minWidth: 0,
})

const $heroHeading: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: -0.5,
})

const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  lineHeight: 18,
})

const $filterBtn: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 44,
  height: 44,
  borderRadius: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.border,
  alignItems: "center",
  justifyContent: "center",
})

const $filterBadge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 4,
  right: 4,
  minWidth: 18,
  height: 18,
  paddingHorizontal: 4,
  borderRadius: 9,
  backgroundColor: colors.palette.primary500,
  alignItems: "center",
  justifyContent: "center",
})

const $filterBadgeText: ThemedStyle<TextStyle> = ({ colors, isDark }) => ({
  color: isDark ? colors.palette.neutral900 : colors.palette.neutral100,
  fontSize: 10,
})

const $deckSection: ThemedStyle<ViewStyle> = () => ({
  minHeight: 500,
})

const $cardInner: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  paddingTop: spacing.sm,
  gap: spacing.xs,
  minHeight: 360,
})

const $pillRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.xs,
  flexWrap: "wrap",
})

const $pill: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral800,
  backgroundColor: colors.palette.neutral300,
  overflow: "hidden",
  paddingHorizontal: spacing.xs,
  paddingVertical: 3,
  borderRadius: 6,
})

const $pillAccent: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral900,
  backgroundColor: colors.palette.primary100,
  overflow: "hidden",
  paddingHorizontal: spacing.xs,
  paddingVertical: 3,
  borderRadius: 6,
})

const $pillMuted: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  backgroundColor: colors.palette.neutral300,
  overflow: "hidden",
  paddingHorizontal: spacing.xs,
  paddingVertical: 3,
  borderRadius: 6,
})

const $pillTalent: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.secondary500,
  backgroundColor: colors.palette.secondary100,
  overflow: "hidden",
  paddingHorizontal: spacing.xs,
  paddingVertical: 3,
  borderRadius: 6,
})

const $cardTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $cardBody: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  lineHeight: 20,
})

const $metaRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: spacing.sm,
})

const $footerRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: "auto",
  paddingTop: spacing.md,
})

const $accent: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})
