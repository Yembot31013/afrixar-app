import { ReactNode, useCallback, useEffect } from "react"
import { Dimensions, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import {
  IllustratedEmptyState,
  type IllustratedEmptyStateProps,
} from "@/components/IllustratedEmptyState"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const { width: SCREEN_W } = Dimensions.get("window")
const SWIPE_THRESHOLD = SCREEN_W * 0.28

export type SwipeDirection = "left" | "right"

export interface SwipeDeckProps<T extends { id: string }> {
  items: T[]
  onSwipe: (direction: SwipeDirection, item: T) => void
  renderCard: (item: T, stackIndex: number) => ReactNode
  emptyHint?: string
  emptyTitle?: string
  emptyIcon?: IllustratedEmptyStateProps["icon"]
  /** Large center stamp when swiping right (e.g. interest sent, awaiting match). */
  rightStampLabel?: string
  /** Large center stamp when swiping left. */
  leftStampLabel?: string
}

export function SwipeDeck<T extends { id: string }>(props: SwipeDeckProps<T>) {
  const {
    items,
    onSwipe,
    renderCard,
    emptyHint,
    emptyTitle,
    emptyIcon,
    rightStampLabel = "INTEREST",
    leftStampLabel = "SKIP",
  } = props
  const { themed } = useAppTheme()

  const top = items[0]
  const second = items[1]
  const third = items[2]

  const translateX = useSharedValue(0)
  const rotate = useSharedValue(0)

  useEffect(() => {
    translateX.value = 0
    rotate.value = 0
  }, [rotate, top?.id, translateX])

  const dismiss = useCallback(
    (direction: SwipeDirection) => {
      const current = items[0]
      if (!current) return
      const targetX = direction === "right" ? SCREEN_W * 1.35 : -SCREEN_W * 1.35
      translateX.value = withTiming(targetX, { duration: 220 }, (finished) => {
        if (finished) {
          runOnJS(onSwipe)(direction, current)
          translateX.value = 0
          rotate.value = 0
        }
      })
    },
    [items, onSwipe, rotate, translateX],
  )

  const pan = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-18, 18])
    .onUpdate((e) => {
      translateX.value = e.translationX
      rotate.value = interpolate(
        e.translationX,
        [-SCREEN_W / 2, SCREEN_W / 2],
        [-14, 14],
        Extrapolation.CLAMP,
      )
    })
    .onEnd((e) => {
      const vx = e.velocityX
      if (translateX.value > SWIPE_THRESHOLD || vx > 900) {
        runOnJS(dismiss)("right")
      } else if (translateX.value < -SWIPE_THRESHOLD || vx < -900) {
        runOnJS(dismiss)("left")
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 240 })
        rotate.value = withSpring(0, { damping: 20, stiffness: 240 })
      }
    })

  const topStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotate: `${rotate.value}deg` }],
    zIndex: 10,
  }))

  const stampRightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD * 0.35, SWIPE_THRESHOLD],
      [0, 0.55, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0.88, 1], Extrapolation.CLAMP),
      },
    ],
  }))

  const stampLeftStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.35, 0],
      [1, 0.55, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0.88], Extrapolation.CLAMP),
      },
    ],
  }))

  if (!top) {
    return (
      <IllustratedEmptyState
        icon={emptyIcon ?? "compass-outline"}
        title={emptyTitle ?? "You're all caught up"}
        subtitle={
          emptyHint ?? "Open filters to widen your match, or check back later for new posts."
        }
      />
    )
  }

  return (
    <View style={themed($wrap)}>
      <View style={themed($cardStage)}>
        {third ? (
          <View style={[themed($cardShell), themed($stackBack2)]} pointerEvents="none">
            {renderCard(third, 2)}
          </View>
        ) : null}
        {second ? (
          <View style={[themed($cardShell), themed($stackBack1)]} pointerEvents="none">
            {renderCard(second, 1)}
          </View>
        ) : null}

        <GestureDetector gesture={pan}>
          <Animated.View style={[themed($cardShell), topStyle]}>
            {renderCard(top, 0)}
            <View style={themed($stampLayer)} pointerEvents="none">
              <Animated.View style={[themed($stampAnchorRight), stampRightStyle]}>
                <View style={themed($stampTiltRight)}>
                  <View style={themed($stampBoxInterest)}>
                    <Text text={rightStampLabel} style={themed($stampTextInterest)} />
                  </View>
                </View>
              </Animated.View>
              <Animated.View style={[themed($stampAnchorLeft), stampLeftStyle]}>
                <View style={themed($stampTiltLeft)}>
                  <View style={themed($stampBoxSkip)}>
                    <Text text={leftStampLabel} style={themed($stampTextSkip)} />
                  </View>
                </View>
              </Animated.View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={themed($actions)}>
        <Pressable
          style={themed($circleBtn)}
          onPress={() => dismiss("left")}
          accessibilityRole="button"
          accessibilityLabel={leftStampLabel}
        >
          <Text text="✕" style={themed($circleGlyph)} />
        </Pressable>
        <Pressable
          style={themed($circleBtnPrimary)}
          onPress={() => dismiss("right")}
          accessibilityRole="button"
          accessibilityLabel={rightStampLabel}
        >
          <Text text="✓" style={themed($circleGlyphLight)} />
        </Pressable>
      </View>
    </View>
  )
}

const $wrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $cardStage: ThemedStyle<ViewStyle> = () => ({
  minHeight: 420,
  justifyContent: "center",
})

const $cardShell: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  borderRadius: spacing.lg,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  overflow: "hidden",
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 18 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 8,
})

const $stackBack1: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  top: spacing.sm,
  transform: [{ scale: 0.96 }],
  opacity: 0.92,
  zIndex: 2,
})

const $stackBack2: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  top: spacing.md,
  transform: [{ scale: 0.92 }],
  opacity: 0.78,
  zIndex: 1,
})

const $stampLayer: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
})

/** Top-right — diagonal across the card when swiping right */
const $stampAnchorRight: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  top: spacing.md,
  right: spacing.sm,
  zIndex: 20,
})

/** Top-left — diagonal across the card when swiping left */
const $stampAnchorLeft: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  top: spacing.md,
  left: spacing.sm,
  zIndex: 20,
})

const $stampTiltRight: ThemedStyle<ViewStyle> = () => ({
  transform: [{ rotate: "18deg" }],
})

const $stampTiltLeft: ThemedStyle<ViewStyle> = () => ({
  transform: [{ rotate: "-18deg" }],
})

const $stampBoxInterest: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.sm + 2,
  paddingHorizontal: spacing.md,
  borderWidth: 3,
  borderStyle: "solid",
  borderColor: colors.palette.success500,
  backgroundColor: colors.palette.success100,
  borderRadius: spacing.xs,
})

const $stampBoxSkip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.sm + 2,
  paddingHorizontal: spacing.md,
  borderWidth: 4,
  borderStyle: "solid",
  borderColor: colors.palette.neutral800,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.xs,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 4,
  elevation: 3,
})

const $stampTextInterest: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.success500,
  fontSize: 22,
  fontWeight: "900",
  letterSpacing: 1.5,
  textAlign: "center",
})

const $stampTextSkip: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral900,
  fontSize: 22,
  fontWeight: "900",
  letterSpacing: 2,
  textAlign: "center",
})

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  gap: spacing.xl,
  marginTop: spacing.sm,
})

const $circleBtn: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 64,
  height: 64,
  borderRadius: 999,
  borderWidth: 2,
  borderColor: colors.palette.neutral400,
  backgroundColor: colors.palette.neutral100,
  alignItems: "center",
  justifyContent: "center",
})

const $circleBtnPrimary: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 64,
  height: 64,
  borderRadius: 999,
  backgroundColor: colors.tint,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: colors.palette.primary400,
})

const $circleGlyph: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 26,
  color: colors.text,
})

const $circleGlyphLight: ThemedStyle<TextStyle> = ({ colors, isDark }) => ({
  fontSize: 26,
  color: isDark ? colors.palette.neutral900 : colors.palette.neutral100,
})
