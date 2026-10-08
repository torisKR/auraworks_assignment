import { getSupabaseClient } from "@/lib/supabase";
import type { Textbook } from "@/types/database";

/** Fetch only public catalog fields; ordering follows the supplied design. */
export async function fetchTextbooks(signal: AbortSignal): Promise<Textbook[]> {
  const { data, error } = await getSupabaseClient()
    .from("textbooks")
    .select("id,title,category,subject,description,image_path,price,original_price,discount_percent,display_order")
    .order("display_order", { ascending: true })
    .abortSignal(signal);

  if (error) throw new Error("교재 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");

  return data ?? [];
}
