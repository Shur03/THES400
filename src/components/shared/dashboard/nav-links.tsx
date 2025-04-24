import { cn } from "@/app/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  ClipboardPlus,
  HomeIcon,
  MapPin,
  Menu,
  Syringe,
  TreeDeciduous,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { name: "Нүүр", href: "/dashboard", icon: HomeIcon },
  { name: "Өсөлт хорогдол", href: "/registration", icon: ClipboardPlus },
  {
    name: "Өвс тэжээл",
    icon: TreeDeciduous,
    children: [
      { name: "Худалдан авалт", href: "/fodder/purchase" },
      { name: "Зарцуулалт", href: "/fodder/record" },
    ],
  },
  { name: "Вакцинжуулалт", href: "/treatment", icon: Syringe },
  { name: "Sire", href: "/sire", icon: Syringe },
  { name: "Тооцоолуур", href: "/calculator", icon: Calculator },
  { name: "Байршил", href: "/geo", icon: MapPin },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    router.replace(href);
  };

  const renderNavItem = (link: any) => {
    const isActive =
      pathname === link.href ||
      (link.children &&
        link.children.some((child: any) => pathname === child.href));

    if (link.children) {
      const isDropdownOpen = openDropdown === link.name;

      return (
        <div key={link.name} className="space-y-1">
          <button
            onClick={() => setOpenDropdown(isDropdownOpen ? null : link.name)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full flex justify-between items-center text-left",
              "hover:bg-blue-700 transition-colors duration-200",
              isActive
                ? "bg-blue-800 text-white"
                : "text-gray-100 hover:text-white",
              "rounded-lg px-4 py-3"
            )}
          >
            <div className="flex items-center space-x-3">
              <link.icon className="h-5 w-5" />
              <span className="font-medium">{link.name}</span>
            </div>
            {isDropdownOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isDropdownOpen && (
            <div className="ml-4 pl-4 border-l-2 border-blue-400 space-y-1">
              {link.children.map((child: any) => {
                const childIsActive = pathname === child.href;
                return (
                  <button
                    key={child.name}
                    onClick={() => handleNavigation(child.href)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start w-full text-left text-sm",
                      "hover:bg-blue-700 transition-colors duration-200",
                      childIsActive
                        ? "bg-blue-800 text-white font-medium"
                        : "text-gray-200 hover:text-white",
                      "rounded-lg px-4 py-2"
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
          "hover:bg-blue-700 transition-colors duration-200",
          isActive
            ? "bg-blue-800 text-white font-medium"
            : "text-gray-100 hover:text-white",
          "rounded-lg px-4 py-3"
        )}
      >
        <div className="flex items-center space-x-3">
          {link.icon && <link.icon className="h-5 w-5" />}
          <span className="font-medium">{link.name}</span>
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors duration-200 shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-blue-600 text-gray-200 w-3/4 max-w-xs",
          "transition-transform duration-300 ease-in-out shadow-xl",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mt-16 p-4 space-y-2">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-bold text-white">Цэс</h2>
          </div>
          <div className="space-y-1">{links.map(renderNavItem)}</div>
        </div>
      </div>
      <div className="hidden md:flex flex-col mt-4 space-y-2 p-2">
        <div className="space-y-1">{links.map(renderNavItem)}</div>
      </div>
    </>
  );
}
