import { FC } from "react"
import {
  Dimensions,
  Image,
  ImageStyle,
  ImageSourcePropType,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const MAX_TITLE_WIDTH = Math.min(Dimensions.get("window").width * 0.62, 260)

export type ChatConversationHeaderProps = {
  title?: string
  subtitle?: string
  avatar?: ImageSourcePropType
}

/** Conventional chat header: avatar + title/subtitle block. */
export const ChatConversationHeader: FC<ChatConversationHeaderProps> =
  function ChatConversationHeader(props) {
    const { title, subtitle, avatar } = props
    const { themed } = useAppTheme()
    const primary = title?.trim() || "Chat"

    return (
      <View style={themed($wrap)} pointerEvents="none">
        {avatar ? (
          <Image source={avatar} style={themed($avatar)} />
        ) : (
          <View style={themed($avatarStub)} />
        )}
        <View style={themed($titleBlock)}>
          <Text
            text={primary}
            weight="semiBold"
            size="sm"
            numberOfLines={1}
            style={themed($primary)}
          />
          {subtitle ? (
            <Text text={subtitle} size="xxs" numberOfLines={1} style={themed($secondary)} />
          ) : null}
        </View>
      </View>
    )
  }

const $wrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  width: MAX_TITLE_WIDTH,
})

const $avatar: ThemedStyle<ImageStyle> = () => ({
  width: 28,
  height: 28,
  borderRadius: 999,
})

const $avatarStub: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 28,
  height: 28,
  borderRadius: 999,
  backgroundColor: colors.separator,
})

const $titleBlock: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minWidth: 0,
})

const $primary: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "left",
})

const $secondary: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "left",
})
