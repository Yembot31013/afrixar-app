import { FC, useCallback } from "react"
import {
  FlatList,
  Image,
  ImageStyle,
  Platform,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { IllustratedEmptyState } from "@/components/IllustratedEmptyState"
import { Text } from "@/components/Text"
import { MOCK_CHATS } from "@/mocks/chat"
import type { ChatStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const AVATAR_SIZE = 44

interface ChatListScreenProps extends ChatStackScreenProps<"ChatList"> {}

export const ChatListScreen: FC<ChatListScreenProps> = function ChatListScreen({ navigation }) {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const ItemSeparator = useCallback(
    function ItemSeparator() {
      return <View style={themed($sepInset)} />
    },
    [themed],
  )

  const chats = MOCK_CHATS

  return (
    <FlatList
      style={themed($listFlex)}
      data={chats}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[themed($listContent), chats.length === 0 && themed($listEmptyGrow)]}
      ListEmptyComponent={
        <IllustratedEmptyState
          icon="chatbubbles-outline"
          title="No messages yet"
          subtitle="Matches and support chats will appear here when someone reaches out."
        />
      }
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <Pressable
          style={(state) => themed(state.pressed ? [$row, $rowPressed] : $row)}
          onPress={() =>
            navigation.navigate("ChatRoom", {
              conversationId: item.id,
              title: item.title,
              subtitle: item.subtitle,
              avatar: item.avatar,
            })
          }
          android_ripple={
            Platform.OS === "android" ? { color: colors.palette.overlay20 } : undefined
          }
        >
          <View style={themed($avatar)}>
            {item.avatar ? (
              <Image source={item.avatar} style={themed($avatarImg)} />
            ) : (
              <Text text={item.title.slice(0, 1)} weight="bold" style={themed($avatarText)} />
            )}
          </View>
          <View style={themed($textCol)}>
            <View style={themed($titleRow)}>
              <Text text={item.title} weight="semiBold" style={themed($title)} numberOfLines={1} />
              <Text text={item.updatedLabel} size="xxs" style={themed($meta)} />
            </View>
            <Text text={item.subtitle} size="xxs" style={themed($meta)} numberOfLines={1} />
            <Text
              text={item.lastMessage}
              size="xs"
              style={themed(item.unread ? $previewUnread : $preview)}
              numberOfLines={1}
            />
          </View>
          {item.unread ? <View style={themed($dot)} /> : null}
        </Pressable>
      )}
    />
  )
}

const $listFlex: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.sm,
  paddingBottom: spacing.xxl,
})

const $listEmptyGrow: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
})

const $sepInset: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: StyleSheet.hairlineWidth,
  marginLeft: AVATAR_SIZE + 12,
  backgroundColor: colors.separator,
})

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  paddingVertical: spacing.md,
})

const $rowPressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.overlay20,
})

const $avatar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  borderRadius: 999,
  backgroundColor: colors.palette.primary100,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
})

const $avatarImg: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: "100%",
})

const $avatarText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary600,
})

const $textCol: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  gap: 3,
  minWidth: 0,
})

const $titleRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 8,
  alignItems: "center",
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  flex: 1,
})

const $meta: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $preview: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $previewUnread: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $dot: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 9,
  height: 9,
  borderRadius: 999,
  marginTop: 2,
  backgroundColor: colors.palette.primary400,
})
