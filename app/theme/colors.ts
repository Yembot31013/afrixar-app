/**
 * Afrixar brand tokens — aligned with `afrixar-interview/app/globals.css`
 * Background #FAF7EE · Surface #FFFEFB · Foreground #020103 · Accent #EB9A4B
 */
const palette = {
  neutral100: "#FFFEFB",
  neutral200: "#FAF7EE",
  neutral300: "#F0E9DC",
  neutral400: "#E8E1D4",
  neutral500: "#C9C2B6",
  neutral600: "#8A847A",
  neutral700: "#6B6560",
  neutral800: "#4A4540",
  neutral900: "#020103",

  primary100: "#FCEBD9",
  primary200: "#F5D4B8",
  primary300: "#EB9A4B",
  primary400: "#D4823A",
  primary500: "#B56514",
  primary600: "#8A4E10",

  secondary100: "#EEF6F5",
  secondary200: "#D5EBE8",
  secondary300: "#9CC9C4",
  secondary400: "#5FA89F",
  secondary500: "#2F7D73",

  accent100: "#FFF4E8",
  accent200: "#FFE8CC",
  accent300: "#FFD699",
  accent400: "#FFC266",
  accent500: "#EB9A4B",

  angry100: "#FFE8E5",
  angry500: "#C03403",

  success100: "#E8F6EE",
  success500: "#1D7A4C",

  overlay20: "rgba(2, 1, 3, 0.06)",
  overlay50: "rgba(2, 1, 3, 0.12)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral900,
  textDim: palette.neutral800,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary300,
  tintInactive: palette.neutral500,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
