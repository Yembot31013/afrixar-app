import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Pressable, ScrollView, StyleSheet, TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"
import MapView, { Marker } from "react-native-maps"

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

const DUMMY_MARKERS = [
  { latOff: 0.005, lngOff: 0.005 },
  { latOff: -0.008, lngOff: 0.002 },
  { latOff: 0.003, lngOff: -0.007 },
  { latOff: -0.004, lngOff: -0.004 },
  { latOff: 0.008, lngOff: -0.002 },
]
const LIGHT_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9f6ef" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
]

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
]

const LOADING_MESSAGES = [
  "Scanning what’s open near you…",
  "Applying your preferences…",
  "Ranking by fit, distance, and freshness…",
  "Almost there — polishing your deck…",
]

interface DiscoverScreenProps extends MainTabScreenProps<"Discover"> { }

export const DiscoverScreen: FC<DiscoverScreenProps> = function DiscoverScreen() {
  const {
    themed,
    theme: { colors, spacing, isDark },
  } = useAppTheme()
  /** Discover feed uses the earn/tasks deck only (no mode toggle on this screen). */
  const mode: AppMode = "worker"
  const { recordInterest, pendingInterests } = usePipeline()

  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [savedFilters, setSavedFilters] = useState<DiscoverFilterValues>(DEFAULT_DISCOVER_FILTERS)
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [deckLoading, setDeckLoading] = useState(false)
  const [loadingLine, setLoadingLine] = useState(0)
  const [showHint, setShowHint] = useState(true)

  const pulse = useSharedValue(1)
  const hintOpacity = useSharedValue(1)

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.15, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      true,
    )
  }, [])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }))

  const hintStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }))

  const initialDeck = useMemo(() => filterDiscoverCards(mode, "All"), [mode])
  const [queue, setQueue] = useState<DiscoverCard[]>(initialDeck)

  useEffect(() => {
    const interestedIds = new Set(pendingInterests.map((p) => p.sourceCardId))
    setQueue(initialDeck.filter((c) => !interestedIds.has(c.id)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only filter on mount

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
      const all = filterDiscoverCards(mode, "All")
      const interestedIds = new Set(pendingInterests.map((p) => p.sourceCardId))
      setQueue(all.filter((c) => !interestedIds.has(c.id)))
      setDeckLoading(false)
    }, 1850)
    return () => clearTimeout(t)
  }, [deckLoading, mode, pendingInterests])

  const onSwipe = (direction: SwipeDirection, item: DiscoverCard) => {
    if (showHint) {
      setShowHint(false)
      hintOpacity.value = withTiming(0, { duration: 500 })
    }
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

  const rightStamp = "INTERESTED"
  const subline = ""

  const getCategoryIcon = (cat: string): any => {
    const c = cat.toLowerCase()
    if (c.includes("clean")) return "sparkles"
    if (c.includes("delivery")) return "bicycle"
    if (c.includes("repair")) return "construct"
    if (c.includes("home")) return "home"
    return "briefcase"
  }

  const renderCard = (card: DiscoverCard) => {
    if (card.kind === "task") {
      return (
        <View style={themed($cardInner)}>
          <View style={themed($pillRow)}>
            <View style={themed($categoryPill)}>
              <Ionicons
                name={getCategoryIcon(card.category)}
                size={12}
                color={colors.palette.neutral800}
                style={{ marginRight: 4 }}
              />
              <Text
                text={card.category.toUpperCase()}
                size="xxs"
                weight="bold"
                style={themed($pillText)}
              />
            </View>
            <Animated.View style={[themed(card.urgency === "today" ? $urgencyPillAccent : $urgencyPill), card.urgency === "today" && pulseStyle]}>
              <Ionicons
                name={card.urgency === "today" ? "flash" : "calendar-outline"}
                size={10}
                color={card.urgency === "today" ? colors.palette.neutral100 : colors.textDim}
                style={{ marginRight: 4 }}
              />
              <Text
                text={card.urgency === "today" ? "TODAY" : "FLEXIBLE"}
                size="xxs"
                weight="bold"
                style={themed(card.urgency === "today" ? $pillTextLight : $pillTextDim)}
              />
            </Animated.View>
            <View style={themed($effortPill)}>
              <Text text="MEDIUM EFFORT" size="xxs" weight="bold" style={themed($pillTextDim)} />
            </View>
          </View>

          <View style={themed($titleSection)}>
            <Text text={card.title} preset="heading" style={themed($cardTitle)} />
            <Text text={card.summary} size="sm" style={themed($cardBody)} numberOfLines={2} />
          </View>

          <View style={themed($mapContainer)} pointerEvents="none">
            <MapView
              style={themed($mapView)}
              initialRegion={{
                latitude: -1.2921 + (Math.random() * 0.02 - 0.01),
                longitude: 36.8219 + (Math.random() * 0.02 - 0.01),
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              }}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
              liteMode={true}
              cacheEnabled={true}
              customMapStyle={isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
            >
              <Marker coordinate={{ latitude: -1.2921, longitude: 36.8219 }} />
              {DUMMY_MARKERS.map((m, i) => (
                <Marker
                  key={i}
                  coordinate={{ latitude: -1.2921 + m.latOff, longitude: 36.8219 + m.lngOff }}
                  opacity={0.4}
                />
              ))}
            </MapView>
            <View style={themed($mapOverlay)}>
              <Ionicons name="navigate-circle" size={16} color={colors.palette.neutral100} />
              <Text text={card.location || "Nairobi"} size="xs" weight="bold" style={themed($mapOverlayText)} />
            </View>
          </View>

          <View style={themed($divider)} />

          <View style={themed($mainStatsRow)}>
            <View style={themed($metaItem)}>
              <Ionicons name="location" size={16} color={colors.palette.primary300} />
              <View>
                <Text text={card.location} size="xs" weight="bold" style={themed($metaText)} />
                <Text text="1.8 km away" size="xxs" style={themed($muted)} />
              </View>
            </View>
            <View style={themed($priceContainer)}>
              <Text text={card.budgetLabel} size="md" weight="bold" style={themed($budgetHighlight)} />
              <Text text="EST. PAY" size="xxs" weight="bold" style={themed($priceLabel)} />
            </View>
          </View>

          <View style={themed($footerRow)}>
            <View style={themed($posterInfo)}>
              <View style={themed($avatarPlaceholder)}>
                <Image
                  source={{ uri: `https://i.pravatar.cc/150?u=${card.id}` }}
                  style={themed($avatarImage)}
                />
                <View style={themed($verifiedBadge)}>
                  <Ionicons name="checkmark-circle" size={10} color={colors.palette.primary500} />
                </View>
              </View>
              <View>
                <View style={themed($posterNameRow)}>
                  <Text text={card.posterName} size="xs" weight="bold" style={themed($metaText)} />
                  <Text text="· 4.9★" size="xs" weight="medium" style={themed($ratingText)} />
                </View>
                <Text text="Verified Requester" size="xxs" style={themed($muted)} />
              </View>
            </View>
            <Text text={card.duration} size="xxs" style={themed($muted)} />
          </View>
        </View>
      )
    }

    return (
      <View style={themed($cardInner)}>
        <View style={themed($pillRow)}>
          <View style={themed($talentPill)}>
            <Text text="TALENT" size="xxs" weight="bold" style={themed($pillTextLight)} />
          </View>
          {card.badge ? (
            <View style={themed($urgencyPillAccent)}>
              <Text
                text={card.badge.toUpperCase()}
                size="xxs"
                weight="bold"
                style={themed($pillTextLight)}
              />
            </View>
          ) : null}
        </View>

        <View style={themed($titleSection)}>
          <Text text={card.name} preset="heading" style={themed($cardTitle)} />
          <View style={themed($posterNameRow)}>
            <Text text={card.headline} size="sm" weight="bold" style={themed($budgetHighlight)} />
            <Ionicons name="checkmark-circle" size={14} color={colors.palette.primary500} style={{ marginLeft: 4 }} />
          </View>
        </View>

        <Text text={card.skillTags.join(" · ")} size="xs" style={themed($cardBody)} />

        <View style={themed($mapContainer)} pointerEvents="none">
          <MapView
            style={themed($mapView)}
            initialRegion={{
              latitude: -1.2921 + (Math.random() * 0.02 - 0.01),
              longitude: 36.8219 + (Math.random() * 0.02 - 0.01),
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            zoomEnabled={false}
            liteMode={true}
            cacheEnabled={true}
            customMapStyle={isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
          >
            <Marker coordinate={{ latitude: -1.2921, longitude: 36.8219 }} />
            {DUMMY_MARKERS.map((m, i) => (
              <Marker
                key={i}
                coordinate={{ latitude: -1.2921 + m.latOff, longitude: 36.8219 + m.lngOff }}
                opacity={0.4}
              />
            ))}
          </MapView>
          <View style={themed($mapOverlay)}>
            <Ionicons name="navigate-circle" size={16} color={colors.palette.neutral100} />
            <Text text={card.neighborhood || "Nairobi"} size="xs" weight="bold" style={themed($mapOverlayText)} />
          </View>
        </View>

        <View style={themed($divider)} />

        <View style={themed($mainStatsRow)}>
          <View style={themed($metaItem)}>
            <Ionicons name="star" size={18} color={colors.palette.primary300} />
            <View>
              <Text
                text={`${card.rating.toFixed(2)} Rating`}
                size="xs"
                weight="bold"
                style={themed($metaText)}
              />
              <Text text={`${card.jobsDone} jobs completed`} size="xxs" style={themed($muted)} />
            </View>
          </View>
          <View style={themed($metaItem)}>
            <Ionicons name="flash" size={18} color={colors.palette.secondary400} />
            <View>
              <Text text={`${card.responseMins}m reply`} size="xs" weight="bold" style={themed($metaText)} />
              <Text text="Fast responder" size="xxs" style={themed($muted)} />
            </View>
          </View>
        </View>

        <View style={[themed($metaItem), { marginTop: spacing.sm }]}>
          <Ionicons name="location-outline" size={14} color={colors.textDim} />
          <Text text={`${card.neighborhood} · Nearby`} size="xxs" style={themed($muted)} />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={themed($root)} edges={["top"]}>
      <LinearGradient
        colors={[colors.palette.primary100, colors.background]}
        style={themed($gradientBg)}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      />
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
          {activeFilterCount > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={themed($activeFiltersScroll)}
            >
              {savedFilters.workNature !== "either" && (
                <View style={themed($filterChip)}>
                  <Text text={savedFilters.workNature.replace("_", " ")} size="xxs" weight="bold" style={themed($filterChipText)} />
                </View>
              )}
              {savedFilters.timing !== "flexible" && (
                <View style={themed($filterChip)}>
                  <Text text={savedFilters.timing.toUpperCase()} size="xxs" weight="bold" style={themed($filterChipText)} />
                </View>
              )}
              <View style={themed($filterChip)}>
                <Text text={`< ${savedFilters.radiusKm}km`} size="xxs" weight="bold" style={themed($filterChipText)} />
              </View>
            </ScrollView>
          )}
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
          {showHint && queue.length > 0 && (
            <Animated.View style={[themed($hintOverlay), hintStyle]} pointerEvents="none">
              <Ionicons name="swap-horizontal" size={24} color={colors.palette.primary300} />
              <Text text="Swipe to discover" size="xxs" weight="bold" style={themed($hintText)} />
            </Animated.View>
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

const $gradientBg: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

const $scroll: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.md,
  gap: spacing.xs,
  flexGrow: 1,
})

const $headerBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
  paddingTop: spacing.sm,
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
  letterSpacing: -1,
})

const $hintOverlay: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  bottom: 120,
  alignSelf: "center",
  alignItems: "center",
  gap: spacing.xxs,
})

const $hintText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  opacity: 0.8,
})

const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  lineHeight: 18,
})

const $divider: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.palette.neutral300,
  marginVertical: spacing.xs,
})

const $activeFiltersScroll: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.xs,
  marginTop: spacing.xs,
  paddingBottom: 2,
})

const $filterChip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary100,
  paddingHorizontal: spacing.sm,
  paddingVertical: 4,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.palette.primary300,
})

const $filterChipText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
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
  minHeight: 460,
  flex: 1,
})

const $cardInner: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  paddingTop: spacing.md,
  gap: spacing.sm,
  flex: 1,
  justifyContent: "space-between",
})

const $titleSection: ThemedStyle<ViewStyle> = () => ({
  gap: 4,
})

const $pillRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.xs,
  flexWrap: "wrap",
})

const $categoryPill: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral300,
  paddingHorizontal: spacing.xs,
  paddingVertical: 4,
  borderRadius: 6,
})

const $urgencyPill: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral300,
  paddingHorizontal: spacing.xs,
  paddingVertical: 4,
  borderRadius: 6,
})

const $urgencyPillAccent: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.primary300,
  paddingHorizontal: spacing.xs,
  paddingVertical: 4,
  borderRadius: 6,
})

const $effortPill: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral300,
  paddingHorizontal: spacing.xs,
  paddingVertical: 4,
  borderRadius: 6,
})

const $pillText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral800,
})

const $pillTextDim: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $pillTextLight: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $talentPill: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.secondary500,
  paddingHorizontal: spacing.xs,
  paddingVertical: 4,
  borderRadius: 6,
})

const $cardTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  lineHeight: 28,
  fontSize: 22,
})

const $cardBody: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  lineHeight: 22,
})

const $mainStatsRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $priceContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "flex-end",
  backgroundColor: colors.palette.primary100,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderRadius: spacing.sm,
})

const $priceLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontSize: 8,
})

const $metaItem: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
})

const $metaText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $ratingText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary400,
})

const $budgetHighlight: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})

const $posterInfo: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
})

const $posterNameRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
})

const $avatarPlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: colors.palette.neutral300,
  alignItems: "center",
  justifyContent: "center",
})

const $avatarImage: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: "100%",
  borderRadius: 18,
})

const $verifiedBadge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  bottom: -2,
  right: -2,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 6,
})

const $avatarText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $footerRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginTop: "auto",
})

const $mapContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  width: "100%",
  borderRadius: spacing.sm,
  overflow: "hidden",
  marginVertical: spacing.xs,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  backgroundColor: colors.palette.neutral200,
})

const $mapView: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFillObject,
})

const $mapOverlay: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  bottom: spacing.xs,
  left: spacing.xs,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.6)",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 12,
  gap: 6,
})

const $fauxMap: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
})

const $fauxPin: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  top: "50%",
  marginTop: -24,
})

const $fauxPinShadow: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 12,
  height: 4,
  borderRadius: 6,
  backgroundColor: colors.palette.neutral400,
  marginTop: -4,
  opacity: 0.6,

})

const $mapOverlayText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $xxxs: ThemedStyle<TextStyle> = () => ({
  fontSize: 10,
})

const $accent: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})
