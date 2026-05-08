/**
 * Dark Afrixar — same accent orange, deep surfaces for OLED-friendly contrast.
 */
const palette = {
  neutral900: "#FAF7EE",
  neutral800: "#E8E1D4",
  neutral700: "#C9C2B6",
  neutral600: "#9A948A",
  neutral500: "#6B6560",
  neutral400: "#4A4540",
  neutral300: "#2E2C28",
  neutral200: "#1A1917",
  neutral100: "#0E0D0C",

  primary600: "#FCEBD9",
  primary500: "#F5D4B8",
  primary400: "#F0C090",
  primary300: "#EB9A4B",
  primary200: "#D4823A",
  primary100: "#B56514",

  secondary500: "#EEF6F5",
  secondary400: "#D5EBE8",
  secondary300: "#9CC9C4",
  secondary200: "#5FA89F",
  secondary100: "#2F7D73",

  accent500: "#FFF4E8",
  accent400: "#FFE8CC",
  accent300: "#FFD699",
  accent200: "#FFC266",
  accent100: "#EB9A4B",

  angry100: "#3D2220",
  angry500: "#FF8A7A",

  success100: "#1A2E24",
  success500: "#5CD488",

  overlay20: "rgba(250, 247, 238, 0.08)",
  overlay50: "rgba(250, 247, 238, 0.16)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral900,
  textDim: palette.neutral700,
  background: palette.neutral200,
  border: palette.neutral300,
  tint: palette.primary300,
  tintInactive: palette.neutral600,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
