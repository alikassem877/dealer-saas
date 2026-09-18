"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiClientError } from "./client";

export function useApiData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFetch<T>(path);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}