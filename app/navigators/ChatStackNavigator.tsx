import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { ChatConversationHeader } from "@/components/chat/ChatConversationHeader"
import { ChatListScreen } from "@/screens/ChatListScreen"
import { ChatRoomScreen } from "@/screens/ChatRoomScreen"
import { useAppTheme } from "@/theme/context"

import type { ChatStackParamList } from "./navigationTypes"

const Stack = createNativeStackNavigator<ChatStackParamList>()

export function ChatStackNavigator() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: "Messages" }} />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <ChatConversationHeader
              title={route.params.title}
              subtitle={route.params.subtitle}
              avatar={route.params.avatar}
            />
          ),
          headerTitleAlign: "left",
        })}
      />
    </Stack.Navigator>
  )
}
