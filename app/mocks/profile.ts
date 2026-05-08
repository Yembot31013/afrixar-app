import type { ImageSourcePropType } from "react-native"

export interface MilestoneGoal {
  id: string
  label: string
  detail: string
  complete: boolean
}

export interface WorkerTier {
  workerName: string
  appName: string
  avatar: ImageSourcePropType
  walletBalance: string
  walletPending: string
  level: number
  title: string
  xpCurrent: number
  xpToNext: number
  tierLabel: string
}

export interface AccountVerification {
  kycLabel: string
  kycDetail: string
  idDocumentLabel: string
  idDocumentDetail: string
  phoneLabel: string
  phoneDetail: string
  approvedWorkerBadge: boolean
}

/** Demo state: mid-tier trusted worker for prototype storytelling */
export const MOCK_WORKER_PROFILE: WorkerTier & { milestones: MilestoneGoal[] } = {
  workerName: "Amina",
  appName: "Konnect",
  avatar: { uri: "https://randomuser.me/api/portraits/women/32.jpg" },
  walletBalance: "KES 24,600",
  walletPending: "KES 2,880 pending",
  level: 4,
  title: "Trusted Pro",
  xpCurrent: 820,
  xpToNext: 1000,
  tierLabel: "Level 4 · Trusted Pro",
  milestones: [
    {
      id: "g1",
      label: "Reviews",
      detail: "Maintain 4.8+ average (last 30 jobs)",
      complete: true,
    },
    {
      id: "g2",
      label: "Response time",
      detail: "Median reply under 15 minutes",
      complete: true,
    },
    {
      id: "g3",
      label: "Zero disputes",
      detail: "No open disputes for 90 days",
      complete: true,
    },
    {
      id: "g4",
      label: "Jobs completed",
      detail: "Complete 50 verified jobs (lifetime)",
      complete: true,
    },
    {
      id: "g5",
      label: "Next tier",
      detail: "Reach Level 5 — Elite Circle (180 XP left)",
      complete: false,
    },
  ],
}

export const MOCK_ACCOUNT: AccountVerification = {
  kycLabel: "KYC",
  kycDetail: "Government ID verified · selfie match passed",
  idDocumentLabel: "ID on file",
  idDocumentDetail: "National ID · renewed 2026",
  phoneLabel: "Phone",
  phoneDetail: "Verified · +254 ·••• ••89",
  approvedWorkerBadge: true,
}
