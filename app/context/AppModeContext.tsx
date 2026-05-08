import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

export type AppMode = "worker" | "client"

type AppModeContextType = {
  mode: AppMode
  setMode: (mode: AppMode) => void
  /** Immediate toggle — prefer `confirmModeChange` in UI. */
  toggleMode: () => void
  confirmModeChange: (target: AppMode) => void
}

const AppModeContext = createContext<AppModeContextType | null>(null)

export const AppModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>("worker")

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "worker" ? "client" : "worker"))
  }, [])

  const confirmModeChange = useCallback(
    (target: AppMode) => {
      if (target === mode) return
      setMode(target)
    },
    [mode],
  )

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
      confirmModeChange,
    }),
    [mode, toggleMode, confirmModeChange],
  )

  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
}

export function useAppMode() {
  const ctx = useContext(AppModeContext)
  if (!ctx) throw new Error("useAppMode must be used within AppModeProvider")
  return ctx
}
