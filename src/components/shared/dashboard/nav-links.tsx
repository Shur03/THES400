"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  Calculator,
  TreeDeciduous,
  Syringe,
  ClipboardPlus,
  Menu,
  X,
} from "lucide-react";
import { buttonVariants } from "../../ui/button";
import { cn } from "@/app/lib/utils";

const links = [
  { name: "Нүүр", href: "/dashboard", icon: HomeIcon },
  { name: "Бүртгэл", href: "/registration", icon: ClipboardPlus },
  { name: "Өвс тэжээл", href: "/fodder", icon: TreeDeciduous },
  { name: "Эмчилгээ, вакцин", href: "/treatment", icon: Syringe },
  { name: "Тооцоолуур", href: "/calculator", icon: Calculator },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.replace(href);
  };

  const renderNavItem = (link: (typeof links)[0]) => {
    const LinkIcon = link.icon;
    const isActive = pathname === link.href;

    return (
      <button
        key={link.name}
        onClick={() => handleNavigation(link.href)}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start w-full text-left",
          isActive ? "bg-accent" : "text-muted-foreground"
        )}
      >
        <LinkIcon className="mr-2 h-6 w-6" />
        <span>{link.name}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-blue-200 text-gray-800 w-1/2 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mt-20 p-4 space-y-2">{links.map(renderNavItem)}</div>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:block mt-10 space-y-2">
        {links.map(renderNavItem)}
      </div>
    </>
  );
}
