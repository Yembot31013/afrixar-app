import { ReactNode, useCallback, useEffect } from "react"
import { Dimensions, Pressable, TextStyle, View, ViewStyle } from "react-native"
import * as Haptics from "expo-haptics"
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
  const { themed, theme: { spacing } } = useAppTheme()

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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { })
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

  const secondStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0.94, 1],
      Extrapolation.CLAMP,
    )
    const rotateValue = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [2, 0],
      Extrapolation.CLAMP,
    )
    const translateYOffset = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [64, 0],
      Extrapolation.CLAMP,
    )
    return {
      transform: [{ scale }, { rotate: `${rotateValue}deg` }, { translateY: translateYOffset }],
      opacity: interpolate(Math.abs(translateX.value), [0, SWIPE_THRESHOLD], [0.88, 1], Extrapolation.CLAMP),
    }
  })

  const thirdStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0.88, 0.94],
      Extrapolation.CLAMP,
    )
    const rotateValue = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [-2, -1],
      Extrapolation.CLAMP,
    )
    const translateYOffset = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [-48, -24],
      Extrapolation.CLAMP,
    )
    return {
      transform: [{ scale }, { rotate: `${rotateValue}deg` }, { translateY: translateYOffset }],
      opacity: interpolate(Math.abs(translateX.value), [0, SWIPE_THRESHOLD], [0.65, 0.88], Extrapolation.CLAMP),
    }
  })

  const leftGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SCREEN_W * 0.4, 0], [0.8, 0], Extrapolation.CLAMP),
  }))

  const rightGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SCREEN_W * 0.4], [0, 0.8], Extrapolation.CLAMP),
  }))

  const dismissBtnScale = useSharedValue(1)
  const interestBtnScale = useSharedValue(1)

  const btnDismissStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dismissBtnScale.value }],
  }))

  const btnInterestStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interestBtnScale.value }],
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
          <Animated.View style={[themed($cardShell), thirdStyle]} pointerEvents="none">
            {renderCard(third, 2)}
          </Animated.View>
        ) : null}
        {second ? (
          <Animated.View style={[themed($cardShell), secondStyle]} pointerEvents="none">
            {renderCard(second, 1)}
          </Animated.View>
        ) : null}

        <GestureDetector gesture={pan}>
          <Animated.View style={[themed($cardShell), topStyle]}>
            {renderCard(top, 0)}
            <Animated.View style={[themed($edgeGlowLeft), leftGlowStyle]} pointerEvents="none" />
            <Animated.View style={[themed($edgeGlowRight), rightGlowStyle]} pointerEvents="none" />
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
        <Animated.View style={btnDismissStyle}>
          <Pressable
            style={themed($circleBtn)}
            onPressIn={() => (dismissBtnScale.value = withSpring(0.9))}
            onPressOut={() => (dismissBtnScale.value = withSpring(1))}
            onPress={() => dismiss("left")}
            accessibilityRole="button"
            accessibilityLabel={leftStampLabel}
          >
            <Text text="✕" style={themed($circleGlyph)} />
          </Pressable>
        </Animated.View>
        <Animated.View style={btnInterestStyle}>
          <Pressable
            style={themed($circleBtnPrimary)}
            onPressIn={() => (interestBtnScale.value = withSpring(0.9))}
            onPressOut={() => (interestBtnScale.value = withSpring(1))}
            onPress={() => dismiss("right")}
            accessibilityRole="button"
            accessibilityLabel={rightStampLabel}
          >
            <Text text="✓" style={themed($circleGlyphLight)} />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  )
}

const $wrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
  flex: 1,
  justifyContent: "space-between",
})

const $cardStage: ThemedStyle<ViewStyle> = () => ({
  minHeight: 400,
  justifyContent: "flex-end",
  flex: 1,
})

const $cardShell: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
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

const $edgeGlowLeft: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: "20%",
  backgroundColor: "#EAB308",
  shadowColor: "#EAB308",
  shadowOffset: { width: 20, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 50,
  zIndex: 1,
})

const $edgeGlowRight: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  width: "20%",
  backgroundColor: colors.palette.primary500,
  shadowColor: colors.palette.primary500,
  shadowOffset: { width: -20, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 50,
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
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderWidth: 6,
  borderStyle: "solid",
  borderColor: colors.palette.primary500,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: spacing.sm,
  shadowColor: colors.palette.primary500,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 8,
})

const $stampBoxSkip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderWidth: 6,
  borderStyle: "solid",
  borderColor: "#EAB308",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: spacing.sm,
  shadowColor: "#EAB308",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 8,
})

const $stampTextInterest: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontSize: 36,
  fontWeight: "900",
  letterSpacing: 4,
  textAlign: "center",
})

const $stampTextSkip: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: "#EAB308",
  fontSize: 36,
  fontWeight: "900",
  letterSpacing: 4,
  textAlign: "center",
})

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  gap: spacing.xl,
  marginTop: 0,
  paddingBottom: spacing.sm,
})

const $circleBtn: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 68,
  height: 68,
  borderRadius: 34,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  backgroundColor: colors.palette.neutral100,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
})

const $circleBtnPrimary: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 68,
  height: 68,
  borderRadius: 34,
  backgroundColor: colors.palette.primary500,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: colors.palette.primary500,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 15,
  elevation: 8,
})

const $circleGlyph: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 28,
  color: colors.text,
})

const $circleGlyphLight: ThemedStyle<TextStyle> = ({ colors, isDark }) => ({
  fontSize: 28,
  color: isDark ? colors.palette.neutral900 : colors.palette.neutral100,
})
