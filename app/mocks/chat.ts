import type { ImageSourcePropType } from "react-native"

export interface ChatMessage {
  id: string
  body: string
  sentAtLabel: string
  fromMe: boolean
}

export interface ChatPreview {
  id: string
  title: string
  subtitle: string
  lastMessage: string
  unread: boolean
  updatedLabel: string
  avatar?: ImageSourcePropType
}

export const MOCK_CHATS: ChatPreview[] = [
  {
    id: "c1",
    title: "Wanjiku · Cleaning task",
    subtitle: "Active · awaiting arrival window",
    lastMessage: "I'm 10 mins away — parking slot B2.",
    unread: true,
    updatedLabel: "2m",
    avatar: { uri: "https://randomuser.me/api/portraits/women/44.jpg" },
  },
  {
    id: "c2",
    title: "Eric · TV mount",
    subtitle: "Scheduled · tomorrow 10:30",
    lastMessage: "Bracket photo uploaded.",
    unread: false,
    updatedLabel: "1h",
    avatar: { uri: "https://randomuser.me/api/portraits/men/46.jpg" },
  },
  {
    id: "c3",
    title: "Konnect Support",
    subtitle: "Trust & safety",
    lastMessage: "Your dispute ticket was closed — no breach found.",
    unread: false,
    updatedLabel: "Yesterday",
    avatar: { uri: "https://randomuser.me/api/portraits/women/68.jpg" },
  },
]

export const MOCK_MESSAGES_BY_CHAT: Record<string, ChatMessage[]> = {
  c1: [
    {
      id: "m1",
      body: "Hi Wanjiku — confirming eco supplies preference?",
      sentAtLabel: "10:02",
      fromMe: false,
    },
    { id: "m2", body: "Yes please. No bleach.", sentAtLabel: "10:04", fromMe: true },
    { id: "m3", body: "I'm 10 mins away — parking slot B2.", sentAtLabel: "10:18", fromMe: false },
  ],
  c2: [
    {
      id: "m1",
      body: "Got the bracket SKU — fits your panel.",
      sentAtLabel: "Yesterday",
      fromMe: false,
    },
    { id: "m2", body: "Bracket photo uploaded.", sentAtLabel: "Yesterday", fromMe: true },
  ],
  c3: [
    { id: "m1", body: "Thanks for the evidence pack.", sentAtLabel: "Mon", fromMe: false },
    {
      id: "m2",
      body: "Your dispute ticket was closed — no breach found.",
      sentAtLabel: "Mon",
      fromMe: false,
    },
  ],
}
