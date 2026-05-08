import {
  Image,
  type ImageProps,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native"

import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button, type ButtonProps } from "./Button"
import { Text, type TextProps } from "./Text"

const sadFace = require("@assets/images/sad-face.png")

/** Ignite boilerplate empty state — demos & podcast list. Use `IllustratedEmptyState` for product UI. */
export interface EmptyStateProps {
  preset?: "generic"
  style?: StyleProp<ViewStyle>
  imageSource?: ImageProps["source"]
  imageStyle?: StyleProp<ImageStyle>
  ImageProps?: Omit<ImageProps, "source"> & { style?: StyleProp<ImageStyle> }
  heading?: TextProps["text"]
  headingTx?: TextProps["tx"]
  headingTxOptions?: TextProps["txOptions"]
  headingStyle?: StyleProp<TextStyle>
  HeadingTextProps?: TextProps
  content?: TextProps["text"]
  contentTx?: TextProps["tx"]
  contentTxOptions?: TextProps["txOptions"]
  contentStyle?: StyleProp<TextStyle>
  ContentTextProps?: TextProps
  button?: TextProps["text"]
  buttonTx?: TextProps["tx"]
  buttonTxOptions?: TextProps["txOptions"]
  buttonStyle?: ButtonProps["style"]
  buttonTextStyle?: ButtonProps["textStyle"]
  buttonOnPress?: ButtonProps["onPress"]
  ButtonProps?: ButtonProps
}

interface EmptyStatePresetItem {
  imageSource: ImageProps["source"]
  heading: NonNullable<TextProps["text"]>
  content: NonNullable<TextProps["text"]>
  button: NonNullable<TextProps["text"]>
}

export function EmptyState(props: EmptyStateProps) {
  const {
    themed,
    theme: { spacing },
  } = useAppTheme()

  const presets: Record<"generic", EmptyStatePresetItem> = {
    generic: {
      imageSource: sadFace,
      heading: translate("emptyStateComponent:generic.heading"),
      content: translate("emptyStateComponent:generic.content"),
      button: translate("emptyStateComponent:generic.button"),
    },
  }

  const preset = presets[props.preset ?? "generic"]

  const {
    button = preset.button,
    buttonTx,
    buttonOnPress,
    buttonTxOptions,
    content = preset.content,
    contentTx,
    contentTxOptions,
    heading = preset.heading,
    headingTx,
    headingTxOptions,
    imageSource = preset.imageSource,
    style: $containerStyleOverride,
    buttonStyle: $buttonStyleOverride,
    buttonTextStyle: $buttonTextStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    imageStyle: $imageStyleOverride,
    ButtonProps,
    ContentTextProps,
    HeadingTextProps,
    ImageProps,
  } = props

  const isImagePresent = !!imageSource
  const isHeadingPresent = !!(heading || headingTx)
  const isContentPresent = !!(content || contentTx)
  const isButtonPresent = !!(button || buttonTx)

  const $containerStyles = [$containerStyleOverride]
  const $imageStyles: StyleProp<ImageStyle> = [
    $image,
    (isHeadingPresent || isContentPresent || isButtonPresent) && { marginBottom: spacing.xxxs },
    $imageStyleOverride,
    ImageProps?.style,
  ]
  const $headingStyles: StyleProp<TextStyle> = [
    themed($heading),
    isImagePresent && { marginTop: spacing.xxxs },
    (isContentPresent || isButtonPresent) && { marginBottom: spacing.xxxs },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ]
  const $contentStyles: StyleProp<TextStyle> = [
    themed($contentStyleBase),
    (isImagePresent || isHeadingPresent) && { marginTop: spacing.xxxs },
    isButtonPresent && { marginBottom: spacing.xxxs },
    $contentStyleOverride,
    ContentTextProps?.style,
  ]
  const $buttonStyles: StyleProp<ViewStyle> = [
    (isImagePresent || isHeadingPresent || isContentPresent) && { marginTop: spacing.xl },
    $buttonStyleOverride,
    ButtonProps?.style,
  ]

  return (
    <View style={$containerStyles}>
      {isImagePresent ? <Image source={imageSource} {...ImageProps} style={$imageStyles} /> : null}

      {isHeadingPresent ? (
        <Text
          preset="subheading"
          text={heading}
          tx={headingTx}
          txOptions={headingTxOptions}
          style={$headingStyles}
          {...HeadingTextProps}
        />
      ) : null}

      {isContentPresent ? (
        <Text
          text={content}
          tx={contentTx}
          txOptions={contentTxOptions}
          style={$contentStyles}
          {...ContentTextProps}
        />
      ) : null}

      {isButtonPresent ? (
        <Button
          preset="reversed"
          text={button}
          tx={buttonTx}
          txOptions={buttonTxOptions}
          onPress={buttonOnPress}
          style={$buttonStyles}
          textStyle={$buttonTextStyleOverride}
          {...ButtonProps}
        />
      ) : null}
    </View>
  )
}

const $image: ImageStyle = { alignSelf: "center" }

const $heading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  paddingHorizontal: spacing.lg,
})

const $contentStyleBase: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  paddingHorizontal: spacing.lg,
})
