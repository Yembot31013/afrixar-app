/**
 * Konnect brand tokens — aligned with `afrixar-interview/app/globals.css`
 * Background #F8FAF9 · Surface #FFFFFF · Foreground #0A1F16 · Accent #008751
 */
const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F8FAF9",
  neutral300: "#E8EDEB",
  neutral400: "#D1D9D6",
  neutral500: "#A8B5AF",
  neutral600: "#7A8A83",
  neutral700: "#5C6B64",
  neutral800: "#3D4D45",
  neutral900: "#111111",

  primary100: "#FFE6E6",
  primary200: "#FFB3B3",
  primary300: "#FF8080",
  primary400: "#FF4D4D",
  primary500: "#E52026",
  primary600: "#B3171D",

  secondary100: "#E6F4EA",
  secondary200: "#B3DFBD",
  secondary300: "#80C991",
  secondary400: "#4DB464",
  secondary500: "#008C3A",

  accent100: "#E6FFFA",
  accent200: "#B2F5EA",
  accent300: "#81E6D9",
  accent400: "#4FD1C5",
  accent500: "#38B2AC",

  angry100: "#FFE8E5",
  angry500: "#C03403",

  success100: "#E1F5EC",
  success500: "#008751",

  overlay20: "rgba(10, 31, 22, 0.06)",
  overlay50: "rgba(10, 31, 22, 0.12)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral900,
  textDim: palette.neutral800,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral500,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
