const TRANSIENT_CODES = new Set([
  "P1001",
  "P1002",
  "P1008",
  "P1017",
  "P2024",
  "P2034",
]);

export function isTransientDbError(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    if (TRANSIENT_CODES.has(String((error as { code: unknown }).code))) {
      return true;
    }
  }

  const message = error instanceof Error ? error.message : String(error);
  return /can't reach database|connection (reset|refused|timed out)|server has closed|timed out fetching a new connection|connection terminated|econnrefused|enotfound|socket hang up|too many clients/i.test(
    message,
  );
}

export async function withTransientRetry<T>(run: () => Promise<T>): Promise<T> {
  const delaysMs = [400, 1000, 2000];
  let lastError: unknown;

  for (let attempt = 0; attempt <= delaysMs.length; attempt++) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (!isTransientDbError(error) || attempt === delaysMs.length) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delaysMs[attempt]));
    }
  }

  throw lastError;
}
