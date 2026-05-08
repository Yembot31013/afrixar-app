import {
  formatSentAgo,
  formatTimeRemainingCompact,
} from "@/context/PipelineContext"

describe("Pipeline formatters", () => {
  const now = 1_700_000_000_000

  describe("formatTimeRemainingCompact", () => {
    it("shows minutes when under one hour", () => {
      expect(formatTimeRemainingCompact(now + 45 * 60_000, now)).toBe("45m left")
    })

    it("shows hours and minutes when under 48h", () => {
      expect(formatTimeRemainingCompact(now + (5 * 60 + 30) * 60_000, now)).toBe("5h 30m left")
    })

    it("shows whole hours when minutes are zero", () => {
      expect(formatTimeRemainingCompact(now + 3 * 60 * 60_000, now)).toBe("3h left")
    })

    it("shows days when 48h or more", () => {
      expect(formatTimeRemainingCompact(now + 50 * 60 * 60_000, now)).toBe("2d left")
    })
  })

  describe("formatSentAgo", () => {
    it("shows just now under one minute", () => {
      expect(formatSentAgo(now - 30_000, now)).toBe("Sent just now")
    })

    it("shows minutes under one hour", () => {
      expect(formatSentAgo(now - 12 * 60_000, now)).toBe("Sent 12m ago")
    })

    it("shows hours under 48h", () => {
      expect(formatSentAgo(now - 6 * 60 * 60_000, now)).toBe("Sent 6h ago")
    })

    it("shows days when 48h or more", () => {
      expect(formatSentAgo(now - 72 * 60 * 60_000, now)).toBe("Sent 3d ago")
    })
  })
})
