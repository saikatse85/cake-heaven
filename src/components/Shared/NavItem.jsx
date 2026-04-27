"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function NavItem({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative">
      <span
        className={isActive ? "text-pink-600 font-semibold" : "dark:text-white"}
      >
        {children}
      </span>

      {isActive && (
        <motion.div
          layoutId="underline"
          className="absolute left-0 right-0 -bottom-1 h-[2px] bg-pink-600"
        />
      )}
    </Link>
  );
}
