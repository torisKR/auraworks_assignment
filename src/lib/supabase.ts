import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let browserClient: SupabaseClient<Database> | undefined;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("교재 스토어 연결 설정이 필요합니다. 관리자에게 문의해 주세요.");
  }

  browserClient = createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  return browserClient;
}
