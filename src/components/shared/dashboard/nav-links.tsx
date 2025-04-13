import { cn } from "@/app/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  ClipboardPlus,
  HomeIcon,
  Menu,
  Syringe,
  TreeDeciduous,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
const links = [
  { name: "Нүүр", href: "/dashboard", icon: HomeIcon },
  { name: "Бүртгэл", href: "/registration", icon: ClipboardPlus },
  {
    name: "Өвс тэжээл",
    icon: TreeDeciduous,
    children: [
      { name: "Худалдан авалт", href: "/fodder/purchase" },
      { name: "Зарцуулалт", href: "/fodder/record" },
    ],
  },
  { name: "Эмчилгээ, вакцин", href: "/treatment", icon: Syringe },
  { name: "Sire", href: "/sire", icon: Syringe },
  { name: "Тооцоолуур", href: "/calculator", icon: Calculator },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.replace(href);
  };

  const renderNavItem = (link: any) => {
    const isActive = pathname === link.href;

    if (link.children) {
      const isDropdownOpen = openDropdown === link.name;

      return (
        <div key={link.name} className="space-y-1">
          <button
            onClick={() => setOpenDropdown(isDropdownOpen ? null : link.name)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full flex justify-between items-center text-left text-gray-50"
            )}
          >
            <div className="flex items-center space-x-2">
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </div>
            {isDropdownOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isDropdownOpen && (
            <div className="ml-6 space-y-1">
              {link.children.map((child: any) => {
                const childIsActive = pathname === child.href;
                return (
                  <button
                    key={child.name}
                    onClick={() => handleNavigation(child.href)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start w-full text-left text-sm",
                      childIsActive
                        ? "bg-accent text-white"
                        : "text-muted-foreground"
                    )}
                  >
                    {child.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={link.name}
        onClick={() => handleNavigation(link.href)}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start w-full text-left",
          isActive ? "bg-accent text-[#333333]" : "text-muted-foreground"
        )}
      >
        {link.icon && <link.icon className="mr-2 h-6 w-6" />}
        <span>{link.name}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
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
          "md:hidden fixed inset-0 z-40 bg-blue-200 text-gray-800 w-2/3 transition-transform duration-300 ease-in-out",
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
