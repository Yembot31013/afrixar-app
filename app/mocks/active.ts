export type ActiveRole = "worker" | "client"

export interface ActiveTask {
  id: string
  role: ActiveRole
  title: string
  counterpart: string
  statusLabel: string
  payoutOrBudget: string
  etaLabel: string
}

export interface CompletedTask {
  id: string
  role: ActiveRole
  title: string
  counterpart: string
  payoutOrBudget: string
  completedLabel: string
}

/** Exactly one active task per mode (worker/client). */
export const MOCK_ACTIVE_CURRENT: ActiveTask[] = [
  {
    id: "ac-1",
    role: "worker",
    title: "Deep clean · 2BR apartment",
    counterpart: "Client · Wanjiku N.",
    statusLabel: "En route",
    payoutOrBudget: "KES 3,600",
    etaLabel: "Arrive by 11:20",
  },
  {
    id: "ac-2",
    role: "client",
    title: "Logo polish · export pack",
    counterpart: "Provider · Njeri L.",
    statusLabel: "In progress",
    payoutOrBudget: "KES 13,500 held",
    etaLabel: "Deliver by Fri",
  },
]

export const MOCK_COMPLETED: CompletedTask[] = [
  {
    id: "cp-1",
    role: "worker",
    title: "TV mount · bracket kit",
    counterpart: "Client · Eric O.",
    payoutOrBudget: "KES 2,400",
    completedLabel: "Completed yesterday",
  },
  {
    id: "cp-2",
    role: "worker",
    title: "Laundry + folding · family load",
    counterpart: "Client · Mercy K.",
    payoutOrBudget: "KES 1,800",
    completedLabel: "Completed 3 days ago",
  },
  {
    id: "cp-3",
    role: "worker",
    title: "Office dusting + wipe-down",
    counterpart: "Client · Orbit Hub",
    payoutOrBudget: "KES 3,200",
    completedLabel: "Completed last week",
  },
  {
    id: "cp-4",
    role: "client",
    title: "Landing page copy cleanup",
    counterpart: "Provider · Joel M.",
    payoutOrBudget: "KES 9,000 paid",
    completedLabel: "Completed yesterday",
  },
  {
    id: "cp-5",
    role: "client",
    title: "Kitchen sink leak fix",
    counterpart: "Provider · HomeFix KE",
    payoutOrBudget: "KES 4,600 paid",
    completedLabel: "Completed 2 days ago",
  },
  {
    id: "cp-6",
    role: "client",
    title: "Promo reel edit · 45s",
    counterpart: "Provider · A. Studio",
    payoutOrBudget: "KES 11,200 paid",
    completedLabel: "Completed last week",
  },
]
