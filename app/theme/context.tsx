import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { StyleSheet, useColorScheme } from "react-native"
import { DarkTheme, DefaultTheme, Theme as NavigationTheme } from "@react-navigation/native"

import { colors as colorsLight } from "./colors"
import { colors as colorsDark } from "./colorsDark"
import { spacing as spacingLight } from "./spacing"
import { spacing as spacingDark } from "./spacingDark"
import { timing } from "./timing"
import type { AllowedStylesT, Theme, ThemeContextModeT, ThemedFnT } from "./types"
import { typography } from "./typography"

export type ThemeContextType = {
  theme: Theme
  themed: ThemedFnT
  navigationTheme: NavigationTheme
  themeContext: ThemeContextModeT
  setThemeContextOverride: (themeContext?: ThemeContextModeT) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export interface ThemeProviderProps extends PropsWithChildren {
  initialContext?: ThemeContextModeT
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, initialContext }) => {
  const systemThemeScheme = useColorScheme()
  const [override, setOverride] = useState<ThemeContextModeT>(initialContext)

  const themeScheme =
    override ??
    (systemThemeScheme === "dark" ? "dark" : systemThemeScheme === "light" ? "light" : "light")
  const isDark = themeScheme === "dark"

  const theme = useMemo(
    (): Theme => ({
      colors: isDark ? colorsDark : colorsLight,
      spacing: isDark ? spacingDark : spacingLight,
      typography,
      timing,
      isDark,
    }),
    [isDark],
  )

  const navigationTheme = useMemo((): NavigationTheme => {
    const base = isDark ? DarkTheme : DefaultTheme
    const { colors: c } = theme
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: c.palette.primary500,
        background: c.background,
        card: c.palette.neutral100,
        text: c.text,
        border: c.border,
        notification: c.palette.primary300,
      },
    }
  }, [isDark, theme])

  const themed = useCallback(
    <T,>(styleOrStyleFn: AllowedStylesT<T>): T =>
      StyleSheet.flatten(
        [styleOrStyleFn].flat(5).map((style) => {
          if (typeof style === "function") {
            return style(theme)
          }
          return style
        }),
      ) as T,
    [theme],
  ) as ThemedFnT

  const setThemeContextOverride = useCallback((themeContext?: ThemeContextModeT) => {
    setOverride(themeContext)
  }, [])

  const value = useMemo(
    (): ThemeContextType => ({
      theme,
      themed,
      navigationTheme,
      themeContext: override,
      setThemeContextOverride,
    }),
    [theme, themed, navigationTheme, override, setThemeContextOverride],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useAppTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useAppTheme must be used within ThemeProvider")
  }
  return ctx
}
