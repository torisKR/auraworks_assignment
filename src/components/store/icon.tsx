import type { SVGProps } from "react";

type IconName = "cart" | "bell" | "user" | "search" | "close" | "arrow";
type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

const paths: Record<IconName, React.ReactNode> = {
  cart: <><path d="m3 3 2 2 3 12h11l3-10H6" /><circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  user: <><circle cx="12" cy="7" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
  search: <><circle cx="10.5" cy="10.5" r="7.5" /><path d="m16 16 5 5" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
};

export function Icon({ name, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
