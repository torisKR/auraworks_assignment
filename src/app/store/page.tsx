import type { Metadata } from "next";
import { Storefront } from "@/components/store/storefront";
export const metadata: Metadata = { title: "스토어 | HIDDEN KICE" };
export default function StorePage() {
  return <Storefront />;
}
