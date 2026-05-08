import { FC, useMemo, useState } from "react"
import {
  Image,
  ImageStyle,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { useAppMode, type AppMode } from "@/context/AppModeContext"
import { useAuth } from "@/context/AuthContext"
import { MOCK_ACCOUNT, MOCK_WORKER_PROFILE } from "@/mocks/profile"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ProfileScreenProps extends MainTabScreenProps<"Profile"> {}

type QuickStat = { key: string; icon: keyof typeof Ionicons.glyphMap; value: string; label: string }
type ActionItem = {
  key: string
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
  emphasis?: "default" | "accent" | "danger"
  onPress: () => void
}

export const ProfileScreen: FC<ProfileScreenProps> = function ProfileScreen({ navigation }) {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const { authEmail, logout } = useAuth()
  const { mode, setMode } = useAppMode()
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "switch" | "logout"
    title: string
    message: string
    confirmLabel: string
    targetMode?: AppMode
  } | null>(null)

  const xpPct = Math.round((MOCK_WORKER_PROFILE.xpCurrent / MOCK_WORKER_PROFILE.xpToNext) * 100)
  const xpRemaining = MOCK_WORKER_PROFILE.xpToNext - MOCK_WORKER_PROFILE.xpCurrent

  const progressMeta = useMemo(() => {
    const ms = MOCK_WORKER_PROFILE.milestones
    const done = ms.filter((m) => m.complete).length
    const next = ms.find((m) => !m.complete)
    return { done, total: ms.length, next }
  }, [])

  const stats: QuickStat[] = useMemo(
    () => [
      { key: "rating", icon: "star", value: "4.92", label: "Rating" },
      { key: "reply", icon: "flash", value: "12m", label: "Reply" },
      { key: "disputes", icon: "shield-checkmark", value: "0", label: "Disputes" },
    ],
    [],
  )

  const verificationActions: ActionItem[] = useMemo(
    () => [
      {
        key: "kyc",
        icon: "shield-checkmark-outline",
        title: "KYC verification",
        subtitle: MOCK_ACCOUNT.kycDetail,
        emphasis: "accent",
        onPress: () => navigation.navigate("KycVerification"),
      },
      {
        key: "id",
        icon: "card-outline",
        title: "ID documents",
        subtitle: MOCK_ACCOUNT.idDocumentDetail,
        onPress: () => navigation.navigate("IdVerification"),
      },
      {
        key: "phone",
        icon: "call-outline",
        title: "Phone verification",
        subtitle: MOCK_ACCOUNT.phoneDetail,
        onPress: () => navigation.navigate("PhoneVerification"),
      },
    ],
    [navigation],
  )

  const preferenceActions: ActionItem[] = useMemo(
    () => [
      {
        key: "edit",
        icon: "create-outline",
        title: "Edit profile",
        subtitle: "Photo, bio, and service details",
        onPress: () => navigation.navigate("EditProfile"),
      },
      {
        key: "language",
        icon: "language-outline",
        title: "Language",
        subtitle: "English (Kenya)",
        onPress: () => navigation.navigate("LanguageSettings"),
      },
      {
        key: "theme",
        icon: "contrast-outline",
        title: "Theme",
        subtitle: "Auto (system)",
        onPress: () => navigation.navigate("ThemeSettings"),
      },
      {
        key: "notifications",
        icon: "notifications-outline",
        title: "Notification settings",
        subtitle: "Jobs, chats, reminders, and trust alerts",
        onPress: () => navigation.navigate("NotificationSettings"),
      },
    ],
    [navigation],
  )

  const systemActions: ActionItem[] = useMemo(
    () => [
      {
        key: "switch",
        icon: "swap-horizontal-outline",
        title: "Switch experience",
        subtitle: mode === "worker" ? "Move to hiring mode" : "Move to finding work mode",
        onPress: () =>
          setConfirmDialog({
            type: "switch",
            title: "Switch experience?",
            message:
              mode === "worker"
                ? "Your feed will focus on hiring providers and posting tasks."
                : "Your feed will focus on finding paid work.",
            confirmLabel: "Switch",
            targetMode: mode === "worker" ? "client" : "worker",
          }),
      },
      {
        key: "logout",
        icon: "log-out-outline",
        title: "Log out",
        subtitle: "Sign out from this device",
        emphasis: "danger",
        onPress: () =>
          setConfirmDialog({
            type: "logout",
            title: "Log out of Konnect?",
            message: "You’ll need to sign in again to continue.",
            confirmLabel: "Log out",
          }),
      },
    ],
    [mode],
  )

  return (
    <SafeAreaView style={themed($root)} edges={["top"]}>
      <ScrollView contentContainerStyle={themed($content)} showsVerticalScrollIndicator={false}>
        <View style={themed($hero)}>
          <View style={themed($identityRow)}>
            <View style={themed($avatar)}>
              <Image source={MOCK_WORKER_PROFILE.avatar} style={themed($avatarImg)} />
            </View>
            <View style={themed($identityText)}>
              <Text text={MOCK_WORKER_PROFILE.workerName} preset="heading" style={themed($title)} />
              <Text
                text={authEmail ?? `amina@${MOCK_WORKER_PROFILE.appName.toLowerCase()}.mock`}
                size="xs"
                style={themed($muted)}
              />
              <View style={themed($modeChip)}>
                <Ionicons name="sparkles-outline" size={12} color={colors.palette.primary600} />
                <Text
                  text={MOCK_WORKER_PROFILE.tierLabel}
                  size="xxs"
                  weight="semiBold"
                  style={themed($modeChipText)}
                />
              </View>
            </View>
          </View>

          <View style={themed($statsRow)}>
            {stats.map((s) => (
              <View key={s.key} style={themed($statItem)}>
                <Ionicons name={s.icon} size={14} color={colors.textDim} />
                <Text text={s.value} size="xs" weight="semiBold" style={themed($statValue)} />
                <Text text={s.label} size="xxs" style={themed($muted)} />
              </View>
            ))}
          </View>
        </View>

        <Pressable style={themed($walletCard)} onPress={() => navigation.navigate("Wallet")}>
          <View style={themed($walletTop)}>
            <View style={themed($walletTitleRow)}>
              <Ionicons name="wallet-outline" size={16} color={colors.palette.primary600} />
              <Text text="Wallet" size="xs" weight="semiBold" style={themed($title)} />
            </View>
            <Ionicons name="add-circle-outline" size={18} color={colors.palette.primary500} />
          </View>
          <Text text={MOCK_WORKER_PROFILE.walletBalance} preset="heading" style={themed($title)} />
          <Text text={MOCK_WORKER_PROFILE.walletPending} size="xs" style={themed($muted)} />
        </Pressable>

        <View style={themed($levelCard)}>
          <View style={themed($levelTop)}>
            <View style={themed($tierBadge)}>
              <Ionicons name="trophy" size={13} color={colors.palette.primary600} />
              <Text
                text={`Level ${MOCK_WORKER_PROFILE.level}`}
                size="xxs"
                weight="bold"
                style={themed($tierBadgeText)}
              />
            </View>
            <Text
              text={MOCK_WORKER_PROFILE.title}
              size="sm"
              weight="semiBold"
              style={themed($title)}
            />
          </View>
          <View style={themed($starRow)}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Ionicons
                key={`tier-star-${idx}`}
                name={idx < MOCK_WORKER_PROFILE.level ? "star" : "star-outline"}
                size={14}
                color={idx < MOCK_WORKER_PROFILE.level ? colors.palette.primary500 : colors.textDim}
              />
            ))}
            <Text text="Elite Circle at Level 5" size="xxs" style={themed($muted)} />
          </View>
          <View style={themed($xpTrack)}>
            <View style={[themed($xpFill), { width: `${xpPct}%` }]} />
          </View>
          <Text
            text={`${xpRemaining} XP remaining · ${MOCK_WORKER_PROFILE.xpCurrent}/${MOCK_WORKER_PROFILE.xpToNext}`}
            size="xxs"
            style={themed($muted)}
          />
        </View>

        <Pressable style={themed($goalTrigger)} onPress={() => setGoalsOpen(true)}>
          <View style={themed($goalTriggerLeft)}>
            <Ionicons name="flag-outline" size={18} color={colors.palette.primary500} />
            <View style={themed($goalTriggerText)}>
              <Text text="Milestones & goals" size="sm" weight="semiBold" />
              <Text
                text={`${progressMeta.done}/${progressMeta.total} complete${progressMeta.next ? ` · Next: ${progressMeta.next.label}` : ""}`}
                size="xs"
                style={themed($muted)}
                numberOfLines={1}
              />
            </View>
          </View>
          <Ionicons name="chevron-up-outline" size={18} color={colors.textDim} />
        </Pressable>

        <Section title="Verification">
          {verificationActions.map((item) => (
            <ActionRow key={item.key} item={item} />
          ))}
        </Section>

        <Section title="Preferences">
          {preferenceActions.map((item) => (
            <ActionRow key={item.key} item={item} />
          ))}
        </Section>

        <Section title="Account">
          {systemActions.map((item) => (
            <ActionRow key={item.key} item={item} />
          ))}
        </Section>
      </ScrollView>

      <Modal
        visible={goalsOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setGoalsOpen(false)}
      >
        <Pressable style={themed($sheetBackdrop)} onPress={() => setGoalsOpen(false)}>
          <Pressable style={themed($sheet)} onPress={() => {}}>
            <View style={themed($sheetHandle)} />
            <View style={themed($sheetHeader)}>
              <Text text="Milestones & goals" preset="subheading" />
              <Pressable onPress={() => setGoalsOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.textDim} />
              </Pressable>
            </View>
            <Text
              text={`${progressMeta.done} of ${progressMeta.total} complete`}
              size="xs"
              style={themed($muted)}
            />

            <ScrollView contentContainerStyle={themed($goalList)}>
              {MOCK_WORKER_PROFILE.milestones.map((m) => (
                <View key={m.id} style={themed($goalRow)}>
                  <Ionicons
                    name={m.complete ? "checkmark-circle" : "ellipse-outline"}
                    size={18}
                    color={m.complete ? colors.palette.success500 : colors.textDim}
                  />
                  <View style={themed($goalBody)}>
                    <Text text={m.label} size="sm" weight="semiBold" />
                    <Text text={m.detail} size="xs" style={themed($muted)} />
                  </View>
                </View>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={!!confirmDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDialog(null)}
      >
        <Pressable style={themed($confirmBackdrop)} onPress={() => setConfirmDialog(null)}>
          <Pressable style={themed($confirmCard)} onPress={() => {}}>
            <Text text={confirmDialog?.title ?? ""} preset="subheading" />
            <Text text={confirmDialog?.message ?? ""} size="xs" style={themed($muted)} />

            <View style={themed($confirmActions)}>
              <Pressable style={themed($confirmBtnGhost)} onPress={() => setConfirmDialog(null)}>
                <Text text="Cancel" size="sm" weight="semiBold" style={themed($muted)} />
              </Pressable>
              <Pressable
                style={themed($confirmBtnPrimary)}
                onPress={() => {
                  if (!confirmDialog) return
                  if (confirmDialog.type === "switch" && confirmDialog.targetMode) {
                    setMode(confirmDialog.targetMode)
                  }
                  if (confirmDialog.type === "logout") {
                    logout()
                  }
                  setConfirmDialog(null)
                }}
              >
                <Text text={confirmDialog?.confirmLabel ?? "Continue"} size="sm" weight="semiBold" style={themed($confirmBtnPrimaryText)} />
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

type SectionProps = {
  title: string
  children: React.ReactNode
}

const Section: FC<SectionProps> = function Section({ title, children }) {
  const { themed } = useAppTheme()
  return (
    <View style={themed($section)}>
      <Text text={title} preset="subheading" style={themed($sectionTitle)} />
      <View style={themed($sectionBody)}>{children}</View>
    </View>
  )
}

type ActionRowProps = { item: ActionItem }

const ActionRow: FC<ActionRowProps> = function ActionRow({ item }) {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const iconColor =
    item.emphasis === "danger"
      ? colors.error
      : item.emphasis === "accent"
        ? colors.palette.primary500
        : colors.textDim

  const titleStyle = item.emphasis === "danger" ? $dangerText : $title

  return (
    <Pressable style={themed($actionRow)} onPress={item.onPress}>
      <View style={themed($actionLeft)}>
        <Ionicons name={item.icon} size={18} color={iconColor} />
        <View style={themed($actionText)}>
          <Text text={item.title} size="sm" weight="semiBold" style={themed(titleStyle)} />
          <Text text={item.subtitle} size="xs" style={themed($muted)} numberOfLines={2} />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
    </Pressable>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.sm,
  paddingBottom: spacing.xxl,
  gap: spacing.md,
})

const $hero: ThemedStyle<ViewStyle> = ({ spacing }) => ({ gap: spacing.sm })

const $identityRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: spacing.sm,
})

const $avatar: ThemedStyle<ViewStyle> = ({ colors, isDark }) => ({
  width: 62,
  height: 62,
  borderRadius: 999,
  backgroundColor: isDark ? colors.palette.primary400 : colors.palette.primary300,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
})

const $avatarImg: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: "100%",
})

const $identityText: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  minWidth: 0,
  gap: spacing.xxxs,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.text })

const $modeChip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxxs,
  backgroundColor: colors.palette.primary100,
  borderRadius: 999,
  paddingHorizontal: spacing.xs,
  paddingVertical: 4,
})

const $modeChipText: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.palette.primary600 })

const $statsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: spacing.sm,
})

const $walletCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.md,
  gap: spacing.xxs,
})

const $walletTop: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $walletTitleRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxs,
})

const $statItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxs,
})

const $statValue: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.text })

const $levelCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.md,
  gap: spacing.xs,
  ...Platform.select({
    ios: {
      shadowColor: colors.palette.neutral900,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
    default: {},
  }),
})

const $levelTop: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: spacing.sm,
})

const $tierBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxxs,
  backgroundColor: colors.palette.primary100,
  borderRadius: 999,
  paddingHorizontal: spacing.xs,
  paddingVertical: 4,
})

const $tierBadgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary600,
})

const $starRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxs,
})

const $xpTrack: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 8,
  borderRadius: 999,
  overflow: "hidden",
  backgroundColor: colors.palette.neutral300,
})

const $xpFill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: "100%",
  borderRadius: 999,
  backgroundColor: colors.palette.primary400,
})

const $goalTrigger: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.palette.neutral100,
  borderRadius: 14,
  padding: spacing.md,
})

const $goalTriggerLeft: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  flex: 1,
})

const $goalTriggerText: ThemedStyle<ViewStyle> = () => ({ flex: 1, minWidth: 0, gap: 2 })

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({ gap: spacing.xs })

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({ marginBottom: spacing.xxxs })

const $sectionBody: ThemedStyle<ViewStyle> = () => ({
  borderRadius: 14,
  overflow: "hidden",
})

const $actionRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  gap: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $actionLeft: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  flex: 1,
})

const $actionText: ThemedStyle<ViewStyle> = () => ({ flex: 1, minWidth: 0, gap: 2 })

const $dangerText: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.error })

const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textDim })

const $sheetBackdrop: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.overlay50,
  justifyContent: "flex-end",
})

const $sheet: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  maxHeight: "78%",
  backgroundColor: colors.background,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
  gap: spacing.sm,
})

const $sheetHandle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignSelf: "center",
  width: 46,
  height: 5,
  borderRadius: 999,
  backgroundColor: colors.separator,
})

const $sheetHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: spacing.xs,
})

const $goalList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
  paddingBottom: spacing.xl,
})

const $goalRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  alignItems: "flex-start",
  backgroundColor: colors.palette.neutral100,
  borderRadius: 14,
  padding: spacing.sm,
})

const $goalBody: ThemedStyle<ViewStyle> = () => ({ flex: 1, gap: 3 })

const $confirmBackdrop: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.overlay50,
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
})

const $confirmCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: "100%",
  maxWidth: 360,
  backgroundColor: colors.background,
  borderRadius: 16,
  padding: spacing.md,
  gap: spacing.sm,
})

const $confirmActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "flex-end",
  gap: spacing.xs,
})

const $confirmBtnGhost: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderRadius: 10,
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
})

const $confirmBtnPrimary: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderRadius: 10,
  backgroundColor: colors.palette.primary500,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
})

const $confirmBtnPrimaryText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})
