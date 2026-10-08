"use client";

import { useEffect, useState } from "react";
import { createThrottle } from "@/lib/throttle";

export function useThrottledSearch(interval = 400) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [throttle] = useState(() => createThrottle(setQuery, interval));

  useEffect(() => () => throttle.cancel(), [throttle]);

  function updateSearch(value: string) {
    setSearch(value);
    throttle.push(value.trim(), value.trim() === "");
  }

  return { search, query, updateSearch, pending: search.trim() !== query };
}
