import { describe, expect, it, vi } from "vitest";
import { isTransientDbError, withTransientRetry } from "@/lib/db-retry";

describe("isTransientDbError", () => {
  it("treats Neon/Prisma wake failures as retryable", () => {
    expect(isTransientDbError({ code: "P1001" })).toBe(true);
    expect(isTransientDbError({ code: "P1017" })).toBe(true);
    expect(
      isTransientDbError(new Error("Can't reach database server")),
    ).toBe(true);
  });

  it("does not retry application errors", () => {
    expect(isTransientDbError({ code: "P2002" })).toBe(false);
    expect(isTransientDbError(new Error("Unique constraint failed"))).toBe(
      false,
    );
  });
});

describe("withTransientRetry", () => {
  it("returns the first success after transient failures", async () => {
    vi.useFakeTimers();
    const run = vi
      .fn()
      .mockRejectedValueOnce({ code: "P1001" })
      .mockResolvedValueOnce("ok");

    try {
      const pending = withTransientRetry(run);
      await vi.runAllTimersAsync();
      await expect(pending).resolves.toBe("ok");
      expect(run).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
