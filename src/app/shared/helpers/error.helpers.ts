export function getErrorMessage(err: unknown, fallback = "Ocurrió un error") {
  if (err instanceof Error) return err.message;

  if (typeof err === "string") return err;

  if (typeof err === "object" && err !== null) {
    const maybeMsg = (err as { message?: unknown }).message;
    if (typeof maybeMsg === "string") return maybeMsg;
  }

  return fallback;
}
