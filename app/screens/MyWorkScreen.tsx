import { FC, useEffect, useMemo, useState } from "react"
import { Pressable, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { IllustratedEmptyState } from "@/components/IllustratedEmptyState"
import {
  ActiveNowCard,
  CompletedJobCard,
  InterestSentCard,
} from "@/components/pipeline/PipelineCards"
import { Text } from "@/components/Text"
import { useAppMode } from "@/context/AppModeContext"
import type { PendingInterest } from "@/context/PipelineContext"
import { filterActivePending, usePipeline } from "@/context/PipelineContext"
import { MOCK_ACTIVE_CURRENT, MOCK_COMPLETED } from "@/mocks/active"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

type PipelineTab = "interest" | "completed"

interface MyWorkScreenProps extends MainTabScreenProps<"MyWork"> {}

export const MyWorkScreen: FC<MyWorkScreenProps> = function MyWorkScreen() {
  const { themed } = useAppTheme()
  const { mode } = useAppMode()
  const { pendingInterests, dismissPending } = usePipeline()
  const [tab, setTab] = useState<PipelineTab>("interest")
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  const pending = useMemo(
    () => filterActivePending(pendingInterests).filter((item) => item.mode === mode),
    [pendingInterests, mode],
  )

  const activeNow = useMemo(() => MOCK_ACTIVE_CURRENT.find((j) => j.role === mode) ?? null, [mode])
  const completed = useMemo(() => MOCK_COMPLETED.filter((j) => j.role === mode), [mode])
  const pendingMock = useMemo(() => buildMockPending(mode), [mode])
  const pendingList = pending.length > 0 ? pending : pendingMock

  const pendingWaitingCopy =
    mode === "worker" ? "Awaiting the poster’s response" : "Awaiting the provider’s response"

  return (
    <SafeAreaView style={themed($root)} edges={["top"]}>
      <ScrollView contentContainerStyle={themed($content)} showsVerticalScrollIndicator={false}>
        <Text text="Pipeline" preset="heading" />
        <Text
          text="Track interest you’ve sent and work that’s live."
          size="xs"
          style={themed($muted)}
        />

        {activeNow ? (
          <ActiveNowCard task={activeNow} />
        ) : (
          <View style={themed($activeEmptyWrap)}>
            <IllustratedEmptyState
              icon="flash-off-outline"
              title="No active task right now"
              subtitle="You can only run one active task at a time. Completed work appears below."
            />
          </View>
        )}

        <View style={themed($tabShell)}>
          <View style={themed($tabRow)}>
            <Pressable
              style={themed($tabHit)}
              onPress={() => setTab("interest")}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === "interest" }}
            >
              <Text
                text="Interest sent"
                size="sm"
                weight={tab === "interest" ? "semiBold" : "normal"}
                style={themed(tab === "interest" ? $tabLabelOn : $tabLabelOff)}
              />
            </Pressable>
            <Pressable
              style={themed($tabHit)}
              onPress={() => setTab("completed")}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === "completed" }}
            >
              <Text
                text="Completed"
                size="sm"
                weight={tab === "completed" ? "semiBold" : "normal"}
                style={themed(tab === "completed" ? $tabLabelOn : $tabLabelOff)}
              />
            </Pressable>
          </View>
          <View style={themed($tabBaseline)} />
          <View style={themed($tabIndicators)}>
            <View style={themed($tabIndicatorSlot)}>
              {tab === "interest" ? <View style={themed($tabInk)} /> : null}
            </View>
            <View style={themed($tabIndicatorSlot)}>
              {tab === "completed" ? <View style={themed($tabInk)} /> : null}
            </View>
          </View>
        </View>

        {tab === "interest" ? (
          pendingList.length === 0 ? (
            <View style={themed($emptyFill)}>
              <IllustratedEmptyState
                icon="heart-outline"
                title="No interest in your pipeline"
                subtitle="Swipe right on Discover to send interest. Pending replies land here."
              />
            </View>
          ) : (
            pendingList.map((p) => (
              <InterestSentCard
                key={p.id}
                item={p}
                now={now}
                waitingCopy={pendingWaitingCopy}
                onWithdraw={() => {
                  if (p.id.startsWith("mock-")) return
                  dismissPending(p.id)
                }}
              />
            ))
          )
        ) : completed.length === 0 ? (
          <View style={themed($emptyFill)}>
            <IllustratedEmptyState
              icon="checkmark-done-outline"
              title="No completed work yet"
              subtitle="Completed tasks and hires will appear here once your active task is done."
            />
          </View>
        ) : (
          completed.map((item) => <CompletedJobCard key={item.id} item={item} />)
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function buildMockPending(mode: "worker" | "client"): PendingInterest[] {
  const now = Date.now()
  if (mode === "worker") {
    return [
      {
        id: "mock-pi-1",
        mode,
        sourceCardId: "mock-source-1",
        title: "Move-out clean · studio",
        subtitle: "KES 2,900 · Kilimani",
        appliedAt: now - 42 * 60 * 1000,
        expiresAt: now + 5 * 60 * 60 * 1000,
      },
      {
        id: "mock-pi-2",
        mode,
        sourceCardId: "mock-source-2",
        title: "Window tint touch-up",
        subtitle: "KES 3,400 · Westlands",
        appliedAt: now - 2 * 60 * 60 * 1000,
        expiresAt: now + 16 * 60 * 60 * 1000,
      },
      {
        id: "mock-pi-3",
        mode,
        sourceCardId: "mock-source-3",
        title: "Sofa deep steam clean",
        subtitle: "KES 2,100 · Kileleshwa",
        appliedAt: now - 7 * 60 * 60 * 1000,
        expiresAt: now + 10 * 60 * 60 * 1000,
      },
    ]
  }

  return [
    {
      id: "mock-pi-4",
      mode,
      sourceCardId: "mock-source-4",
      title: "Kitchen plumbing repair",
      subtitle: "Verified provider · Valley Arc",
      appliedAt: now - 55 * 60 * 1000,
      expiresAt: now + 7 * 60 * 60 * 1000,
    },
    {
      id: "mock-pi-5",
      mode,
      sourceCardId: "mock-source-5",
      title: "Product photo retouching",
      subtitle: "Top rated · Nairobi CBD",
      appliedAt: now - 3 * 60 * 60 * 1000,
      expiresAt: now + 20 * 60 * 60 * 1000,
    },
    {
      id: "mock-pi-6",
      mode,
      sourceCardId: "mock-source-6",
      title: "Brand slide deck refresh",
      subtitle: "Studio team · Lavington",
      appliedAt: now - 9 * 60 * 60 * 1000,
      expiresAt: now + 12 * 60 * 60 * 1000,
    },
  ]
}

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 1,
  padding: spacing.lg,
  gap: spacing.md,
  paddingBottom: spacing.xxl,
})

const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  lineHeight: 20,
})

const $tabShell: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
  gap: 0,
})

const $tabRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
})

const $tabHit: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  paddingVertical: spacing.sm,
})

const $tabLabelOn: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $tabLabelOff: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $tabBaseline: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.separator,
  opacity: 0.85,
})

const $tabIndicators: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  marginTop: -2,
})

const $tabIndicatorSlot: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "center",
})

const $tabInk: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignSelf: "center",
  width: "70%",
  maxWidth: 104,
  height: 3,
  borderRadius: 2,
  backgroundColor: colors.tint,
})

const $emptyFill: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  minHeight: 300,
  justifyContent: "center",
})

const $activeEmptyWrap: ThemedStyle<ViewStyle> = () => ({
  minHeight: 220,
  justifyContent: "center",
})
