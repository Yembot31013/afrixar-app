/**
 * Dark Konnect — premium emerald accents and deep forest surfaces for OLED-friendly contrast.
 */
const palette = {
  neutral900: "#F8FAF9",
  neutral800: "#D1D9D6",
  neutral700: "#A8B5AF",
  neutral600: "#7A8A83",
  neutral500: "#5C6B64",
  neutral400: "#3D4D45",
  neutral300: "#2F3D35",
  neutral200: "#0A1F16",
  neutral100: "#050D0A",

  primary600: "#E1F5EC",
  primary500: "#A2D9C3",
  primary400: "#50C878",
  primary300: "#008751",
  primary200: "#005C38",
  primary100: "#004D30",

  secondary500: "#F0FFF4",
  secondary400: "#C6F6D5",
  secondary300: "#9AE6B4",
  secondary200: "#68D391",
  secondary100: "#48BB78",

  accent500: "#E6FFFA",
  accent400: "#B2F5EA",
  accent300: "#81E6D9",
  accent200: "#4FD1C5",
  accent100: "#38B2AC",

  angry100: "#3D2220",
  angry500: "#FF8A7A",

  success100: "#1A2E24",
  success500: "#50C878",

  overlay20: "rgba(248, 250, 249, 0.08)",
  overlay50: "rgba(248, 250, 249, 0.16)",
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
