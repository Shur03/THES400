"use client";
import { useTheme } from "next-themes";
import React from "react";

import { Check, SunMoon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <SunMoon className="w-6 mr-2" />
          <span className="hidden md:block capitalize">{theme} Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {["system", "light", "dark"].map((mode) => (
          <DropdownMenuItem
            key={mode}
            onClick={() => setTheme(mode)}
            className="flex justify-between"
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
            {theme === mode && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
