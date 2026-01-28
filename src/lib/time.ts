export function getNowMs(req: Request): number {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");
    if (header) {
      const value = Number(header);
      if (!Number.isNaN(value)) return value;
    }
  }
  return Date.now();
}
