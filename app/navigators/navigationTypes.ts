import { ComponentProps } from "react"
import type { ImageSourcePropType } from "react-native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type ChatStackParamList = {
  ChatList: undefined
  ChatRoom: {
    conversationId: string
    title?: string
    subtitle?: string
    avatar?: ImageSourcePropType
  }
}

export type MainTabParamList = {
  Discover: undefined
  MyWork: undefined
  Chat: NavigatorScreenParams<ChatStackParamList>
  Profile: undefined
}

export type AppStackParamList = {
  GetStarted: undefined
  SignUp: undefined
  Login: undefined
  MainTabs: NavigatorScreenParams<MainTabParamList>
  Wallet: undefined
  KycVerification: undefined
  IdVerification: undefined
  PhoneVerification: undefined
  EditProfile: undefined
  LanguageSettings: undefined
  ThemeSettings: undefined
  NotificationSettings: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export type ChatStackScreenProps<T extends keyof ChatStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ChatStackParamList, T>,
  MainTabScreenProps<"Chat">
>

export interface NavigationProps extends Partial<
  ComponentProps<typeof NavigationContainer<AppStackParamList>>
> {}

/** Ignite boilerplate demo navigator types — demo screens remain in repo but are unused in production navigation. */
export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
}

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>
