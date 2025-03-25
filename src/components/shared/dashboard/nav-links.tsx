"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Files,
  HomeIcon,
  UsersIcon,
  Calculator,
  TreeDeciduous,
  Syringe,
  ClipboardPlus,
  ChartPie,
} from "lucide-react";
import { buttonVariants } from "../../ui/button";
import { cn } from "@/app/lib/utils";

const links = [
  { name: "Нүүр", href: "", icon: HomeIcon },
  { name: "Дашбоард", href: "/dashboard", icon: ChartPie },
  { name: "Бүртгэл", href: "registrations", icon: ClipboardPlus },
  {
    name: "Өвс тэжээл",
    href: "/fodder",
    icon: TreeDeciduous,
  },
  { name: "Эмчилгээ, вакцин", href: "/treatments", icon: Syringe },
  { name: "Тооцоолуур", href: "/calculator", icon: Calculator },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "justify-start",
              pathname === link.href ? "" : "text-muted-foreground"
            )}
          >
            <LinkIcon className="mr-2 h-6 w-6" />
            <span className="hidden md:block">{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
