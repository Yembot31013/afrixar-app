import { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface WalletScreenProps extends AppStackScreenProps<"Wallet"> {}

type WalletTxn = {
  id: string
  label: string
  typeIcon: keyof typeof Ionicons.glyphMap
  direction: "in" | "out"
  grossAmount: number
  commissionFee: number
  meta: string
  settled: boolean
}

const STARTING_BALANCE = 22_100

const TRANSACTIONS: WalletTxn[] = [
  {
    id: "w1",
    label: "Task payout · Deep clean",
    typeIcon: "sparkles-outline",
    direction: "in",
    grossAmount: 5_000,
    commissionFee: 500,
    meta: "Today 10:24",
    settled: true,
  },
  {
    id: "w2",
    label: "Wallet withdrawal",
    typeIcon: "arrow-up-circle-outline",
    direction: "out",
    grossAmount: 2_000,
    commissionFee: 0,
    meta: "Yesterday 19:12",
    settled: true,
  },
  {
    id: "w3",
    label: "Task payout · TV mount",
    typeIcon: "hammer-outline",
    direction: "in",
    grossAmount: 3_200,
    commissionFee: 320,
    meta: "Mon 14:50",
    settled: false,
  },
]

const formatKes = (amount: number) => `KES ${amount.toLocaleString()}`

export const WalletScreen: FC<WalletScreenProps> = function WalletScreen() {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const settledCredits = TRANSACTIONS.filter((t) => t.direction === "in" && t.settled).reduce(
    (acc, t) => acc + (t.grossAmount - t.commissionFee),
    0,
  )
  const settledDebits = TRANSACTIONS.filter((t) => t.direction === "out" && t.settled).reduce(
    (acc, t) => acc + t.grossAmount + t.commissionFee,
    0,
  )
  const pendingTotal = TRANSACTIONS.filter((t) => !t.settled && t.direction === "in").reduce(
    (acc, t) => acc + (t.grossAmount - t.commissionFee),
    0,
  )
  const availableBalance = STARTING_BALANCE + settledCredits - settledDebits

  return (
    <SafeAreaView style={themed($root)} edges={["bottom"]}>
      <ScrollView contentContainerStyle={themed($content)} showsVerticalScrollIndicator={false}>
        <View style={themed($summaryCard)}>
          <View style={themed($balanceHead)}>
            <Text text="Available balance" size="xs" style={themed($muted)} />
            <Ionicons name="wallet-outline" size={17} color={colors.palette.primary600} />
          </View>
          <Text text={formatKes(availableBalance)} preset="heading" style={themed($title)} />
          <Text text={`${formatKes(pendingTotal)} pending`} size="xs" style={themed($muted)} />
          <View style={themed($summarySplit)}>
            <View style={themed($summaryItem)}>
              <Text text="Withdrawable" size="xxs" style={themed($muted)} />
              <Text
                text={formatKes(availableBalance)}
                size="sm"
                weight="semiBold"
                style={themed($title)}
              />
            </View>
            <View style={themed($summaryItem)}>
              <Text text="On hold" size="xxs" style={themed($muted)} />
              <Text
                text={formatKes(pendingTotal)}
                size="sm"
                weight="semiBold"
                style={themed($title)}
              />
            </View>
          </View>
        </View>

        <View style={themed($section)}>
          <Text text="Transaction history" preset="subheading" />
          <View style={themed($historyList)}>
            {TRANSACTIONS.map((entry) => {
              const net =
                entry.direction === "in"
                  ? entry.grossAmount - entry.commissionFee
                  : entry.grossAmount
              return (
                <View key={entry.id} style={themed($historyRow)}>
                  <View style={themed($rowLeft)}>
                    <View style={themed($txnIconWrap)}>
                      <Ionicons
                        name={entry.typeIcon}
                        size={15}
                        color={entry.direction === "in" ? colors.palette.success500 : colors.error}
                      />
                    </View>
                    <View style={themed($rowText)}>
                      <Text text={entry.label} size="sm" weight="semiBold" />
                      <Text text={entry.meta} size="xxs" style={themed($muted)} />
                      <Text
                        text={`Commission fee: ${formatKes(entry.commissionFee)}`}
                        size="xxs"
                        style={themed($muted)}
                      />
                    </View>
                  </View>
                  <View style={themed($amountCol)}>
                    <Text
                      text={`${entry.direction === "in" ? "+" : "-"}${formatKes(net)}`}
                      size="xs"
                      weight="semiBold"
                      style={themed(entry.direction === "in" ? $plus : $minus)}
                    />
                    <Text
                      text={entry.settled ? "Settled" : "Pending"}
                      size="xxs"
                      style={themed($muted)}
                    />
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  gap: spacing.md,
  paddingBottom: spacing.xxl,
})

const $summaryCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.md,
  gap: spacing.xs,
})

const $balanceHead: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $summarySplit: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.md,
})

const $summaryItem: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  gap: 2,
})

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $historyList: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 14,
  overflow: "hidden",
})

const $historyRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  gap: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $rowLeft: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: spacing.sm,
  flex: 1,
})

const $txnIconWrap: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 28,
  height: 28,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.neutral200,
})

const $rowText: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minWidth: 0,
  gap: 2,
})

const $amountCol: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
  gap: 2,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $muted: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $plus: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.success500,
})

const $minus: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})
