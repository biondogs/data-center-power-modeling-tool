"use client";

import { useCallback, useRef, useState } from "react";

/** Standard result shape every server action should return. */
export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; errors?: string[] };

/** Options for the hook's behavior. */
export interface UseServerActionOptions<TData> {
  /** Fire-and-forget: don't wait for result before resetting `pending`. */
  fireAndForget?: boolean;

  /** Callback when the action succeeds. */
  onSuccess?: (data: TData) => void;

  /** Callback when the action fails. */
  onError?: (error: string) => void;
}

/**
 * React hook that wraps a server action with pending/error state management.
 *
 * Handles both ActionResult-returning actions and raw-returning actions.
 */
export function useServerAction<
  TArgs extends unknown[],
  TRawResult,
  TData = TRawResult
>(
  serverAction: (...args: TArgs) => Promise<TRawResult>,
  options: UseServerActionOptions<TData> = {}
) {
  const { onSuccess, onError, fireAndForget } = options;

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TData | null>(null);
  const abortRef = useRef(false);

  const execute = useCallback(
    async (...args: TArgs) => {
      abortRef.current = false;
      setPending(true);
      setError(null);
      setData(null);

      try {
        const result = await serverAction(...args);

        if (abortRef.current) return result;

        // Handle ActionResult shape
        if (
          result !== null &&
          result !== undefined &&
          typeof result === "object"
        ) {
          const r = result as Record<string, unknown>;
          if (typeof r.success === "boolean") {
            const actionResult = r as ActionResult<TData>;
            if (actionResult.success) {
              const resultData = actionResult.data;
              setData(resultData as TData);
              onSuccess?.(resultData as TData);
            } else {
              const errMsg = actionResult.error || "Action failed";
              setError(errMsg);
              onError?.(errMsg);
            }
            return actionResult;
          }
        }

        // Non-ActionResult result
        setData(result as TData);
        onSuccess?.(result as TData);
        return result;
      } catch (err: unknown) {
        if (abortRef.current) return undefined as never;

        const errMsg =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errMsg);
        onError?.(errMsg);
        throw err;
      } finally {
        if (!fireAndForget) {
          setPending(false);
        }
      }
    },
    [serverAction, onSuccess, onError, fireAndForget]
  );

  const reset = useCallback(() => {
    setPending(false);
    setError(null);
    setData(null);
  }, []);

  return {
    /** Execute the server action with loading/error state management. */
    execute,
    /** Whether the action is pending. */
    pending,
    /** Error message if the action failed. */
    error,
    /** Data from the successful action. */
    data,
    /** Reset the hook's state. */
    reset,
  };
}
