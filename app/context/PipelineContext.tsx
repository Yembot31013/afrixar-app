import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { AppMode } from "@/context/AppModeContext"
import type { DiscoverCard } from "@/mocks/discover"

/** How long the other party has to accept before interest auto-expires (demo: 24h). */
const PENDING_TTL_MS = 24 * 60 * 60 * 1000

export type PendingInterest = {
  id: string
  mode: AppMode
  sourceCardId: string
  title: string
  subtitle: string
  appliedAt: number
  expiresAt: number
}

type PipelineContextType = {
  pendingInterests: PendingInterest[]
  recordInterest: (card: DiscoverCard, mode: AppMode) => void
  dismissPending: (id: string) => void
}

const PipelineContext = createContext<PipelineContextType | null>(null)

function buildSubtitle(card: DiscoverCard): string {
  if (card.kind === "task") {
    return `${card.budgetLabel} · ${card.location}`
  }
  return `${card.headline} · ${card.neighborhood}`
}

export const PipelineProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pendingInterests, setPendingInterests] = useState<PendingInterest[]>([])

  const recordInterest = useCallback((card: DiscoverCard, mode: AppMode) => {
    const now = Date.now()
    const item: PendingInterest = {
      id: `pi-${now}-${card.id}`,
      mode,
      sourceCardId: card.id,
      title: card.kind === "task" ? card.title : card.name,
      subtitle: buildSubtitle(card),
      appliedAt: now,
      expiresAt: now + PENDING_TTL_MS,
    }
    setPendingInterests((prev) => {
      const next = prev.filter((p) => p.sourceCardId !== card.id)
      return [item, ...next]
    })
  }, [])

  const dismissPending = useCallback((id: string) => {
    setPendingInterests((prev) => prev.filter((p) => p.id !== id))
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now()
      setPendingInterests((prev) => prev.filter((p) => p.expiresAt > now))
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  const value = useMemo(
    () => ({
      pendingInterests,
      recordInterest,
      dismissPending,
    }),
    [pendingInterests, recordInterest, dismissPending],
  )

  return <PipelineContext.Provider value={value}>{children}</PipelineContext.Provider>
}

export function usePipeline() {
  const ctx = useContext(PipelineContext)
  if (!ctx) throw new Error("usePipeline must be used within PipelineProvider")
  return ctx
}

export function filterActivePending(items: PendingInterest[]): PendingInterest[] {
  const now = Date.now()
  return items.filter((p) => p.expiresAt > now)
}

/** Human-readable time left until expiry. */
export function formatTimeRemaining(expiresAt: number, now: number): string {
  const ms = Math.max(0, expiresAt - now)
  const m = Math.floor(ms / 60000)
  if (m < 60) return `${m}m left to respond`
  const h = Math.floor(m / 60)
  const rem = m % 60
  if (h < 48) return `${h}h ${rem}m left`
  const d = Math.floor(h / 24)
  return `${d}d left`
}

/** Shorter copy for tight UI rows (cards, chips). */
export function formatTimeRemainingCompact(expiresAt: number, now: number): string {
  const ms = Math.max(0, expiresAt - now)
  const m = Math.floor(ms / 60000)
  if (m < 60) return `${m}m left`
  const h = Math.floor(m / 60)
  const rem = m % 60
  if (h < 48) return rem > 0 ? `${h}h ${rem}m left` : `${h}h left`
  const d = Math.floor(h / 24)
  return `${d}d left`
}

/** When interest was sent (relative past). */
export function formatSentAgo(appliedAt: number, now: number): string {
  const ms = Math.max(0, now - appliedAt)
  const m = Math.floor(ms / 60000)
  if (m < 1) return "Sent just now"
  if (m < 60) return `Sent ${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 48) return `Sent ${h}h ago`
  const d = Math.floor(h / 24)
  return `Sent ${d}d ago`
}
