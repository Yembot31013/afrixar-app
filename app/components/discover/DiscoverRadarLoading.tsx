import { FC, useEffect, useRef } from "react"
import { Animated, Easing, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

type Props = {
  message: string
  hint?: string
}

const RING_COUNT = 3
const RING_STAGGER_MS = 520
const RING_DURATION_MS = 2100

/**
 * Borderless “radar ping” loading — expanding rings from a center hub (no card chrome).
 */
export const DiscoverRadarLoading: FC<Props> = ({ message, hint }) => {
  const { themed } = useAppTheme()
  const progress = useRef(
    Array.from({ length: RING_COUNT }, () => new Animated.Value(0)),
  ).current

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const loops = progress.map((anim) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: RING_DURATION_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    )

    loops.forEach((loop, i) => {
      timeouts.push(setTimeout(() => loop.start(), i * RING_STAGGER_MS))
    })

    return () => {
      timeouts.forEach(clearTimeout)
      loops.forEach((l) => l.stop())
    }
  }, [progress])

  return (
    <View style={themed($wrap)}>
      <View style={themed($radarStage)}>
        {progress.map((anim, i) => {
          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.28, 1.72],
          })
          const opacity = anim.interpolate({
            inputRange: [0, 0.08, 1],
            outputRange: [0, 0.42, 0],
          })
          return (
            <Animated.View
              key={i}
              style={[
                themed($ring),
                {
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          )
        })}
        <View style={themed($hub)} />
      </View>
      <Text text={message} size="sm" weight="semiBold" style={themed($msg)} />
      {hint ? <Text text={hint} size="xxs" style={themed($hint)} /> : null}
    </View>
  )
}

const $wrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minHeight: 440,
  marginTop: spacing.sm,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.xl,
  gap: spacing.lg,
})

const $radarStage: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 200,
  height: 200,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.transparent,
})

const $ring: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  width: 112,
  height: 112,
  borderRadius: 56,
  borderWidth: 2,
  borderColor: colors.tint,
})

const $hub: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: colors.tint,
  opacity: 0.95,
})

const $msg: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "center",
  paddingHorizontal: 24,
})

const $hint: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
  maxWidth: 280,
})