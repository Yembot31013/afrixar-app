import { FC, useEffect, useMemo, useState } from "react"
/* eslint-disable no-restricted-imports -- chat composer uses native TextInput for multiline IME behavior */
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useHeaderHeight } from "@react-navigation/elements"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import type { ChatMessage } from "@/mocks/chat"
import { MOCK_MESSAGES_BY_CHAT } from "@/mocks/chat"
import type { ChatStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ChatRoomScreenProps extends ChatStackScreenProps<"ChatRoom"> {}

export const ChatRoomScreen: FC<ChatRoomScreenProps> = function ChatRoomScreen({ route }) {
  const { conversationId } = route.params
  const {
    themed,
    theme: { colors, spacing, isDark },
  } = useAppTheme()
  const headerHeight = useHeaderHeight()
  const insets = useSafeAreaInsets()

  const seed = useMemo(() => MOCK_MESSAGES_BY_CHAT[conversationId] ?? [], [conversationId])

  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(seed)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const show =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow"
    const hide =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide"
    const s = Keyboard.addListener(show, () => setKeyboardOpen(true))
    const h = Keyboard.addListener(hide, () => setKeyboardOpen(false))
    return () => {
      s.remove()
      h.remove()
    }
  }, [])

  const canSend = draft.trim().length > 0

  const send = () => {
    const t = draft.trim()
    if (!t) return
    const next: ChatMessage = {
      id: `local-${Date.now()}`,
      body: t,
      sentAtLabel: "Now",
      fromMe: true,
    }
    setMessages((m) => [...m, next])
    setDraft("")
  }

  /** Avoid stacking safe-area inset with keyboard padding — removes the extra gap above the keyboard. */
  const composerBottomPad = keyboardOpen
    ? spacing.xs
    : Math.max(insets.bottom, spacing.xs)

  const sendIconColor = canSend
    ? colors.palette.neutral100
    : isDark
      ? colors.palette.neutral600
      : colors.palette.neutral700

  return (
    <KeyboardAvoidingView
      style={themed($root)}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={themed($bubbleList)}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={themed(item.fromMe ? $bubbleMe : $bubbleThem)}>
            <Text
              text={item.body}
              size="sm"
              style={themed(item.fromMe ? $bubbleMeText : $bubbleThemText)}
            />
            <Text
              text={item.sentAtLabel}
              size="xxs"
              style={themed(item.fromMe ? $timeOnAccent : $time)}
            />
          </View>
        )}
      />
      <View style={[themed($composer), { paddingBottom: composerBottomPad }]}>
        <View style={themed($composerIsland)}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message…"
            placeholderTextColor={colors.textDim}
            style={themed($input)}
            multiline
            maxLength={4000}
          />
          <Pressable
            onPress={send}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            accessibilityState={{ disabled: !canSend }}
            style={(state) =>
              themed(
                !canSend
                  ? [$sendFab, $sendFabMuted]
                  : state.pressed
                    ? [$sendFab, $sendFabPressed]
                    : $sendFab,
              )
            }
          >
            <Ionicons name="send" size={18} color={sendIconColor} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $bubbleList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
  gap: spacing.xs,
  flexGrow: 1,
})

const $bubbleMe: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-end",
  maxWidth: "82%",
  backgroundColor: colors.palette.primary300,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderRadius: 18,
  borderBottomRightRadius: 4,
  marginBottom: spacing.xxs,
})

const $bubbleThem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  maxWidth: "82%",
  backgroundColor: colors.palette.neutral300,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderRadius: 18,
  borderBottomLeftRadius: 4,
  marginBottom: spacing.xxs,
})

const $bubbleMeText: ThemedStyle<TextStyle> = ({ colors, isDark }) => ({
  color: isDark ? colors.palette.neutral100 : colors.palette.neutral900,
})

const $bubbleThemText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $time: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginTop: 4,
})

const $timeOnAccent: ThemedStyle<TextStyle> = ({ colors, isDark }) => ({
  marginTop: 4,
  opacity: 0.72,
  color: isDark ? colors.palette.neutral100 : colors.palette.neutral900,
})

const $composer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.sm,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: colors.separator,
  backgroundColor: colors.background,
})

const $composerIsland: ThemedStyle<ViewStyle> = ({ colors, spacing, isDark }) => ({
  flexDirection: "row",
  alignItems: "flex-end",
  gap: spacing.xs,
  backgroundColor: isDark ? colors.palette.neutral300 : colors.palette.neutral100,
  borderRadius: 26,
  paddingLeft: spacing.md,
  paddingRight: spacing.xxs,
  paddingVertical: spacing.xxs,
  minHeight: 48,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.separator,
})

const $input: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  flex: 1,
  minHeight: 40,
  maxHeight: 120,
  paddingVertical: spacing.sm,
  paddingHorizontal: 0,
  fontSize: 16,
  lineHeight: 22,
  color: colors.text,
  backgroundColor: colors.transparent,
})

const $sendFab: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.primary500,
})

const $sendFabMuted: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral400,
})

const $sendFabPressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  opacity: 0.88,
  backgroundColor: colors.palette.primary600,
})
