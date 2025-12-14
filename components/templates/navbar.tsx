"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signout } from "@/app/auth/actions";
import { Button } from "../ui/button";
import { User } from "@supabase/supabase-js";
import { SettingsDialog } from "./settings-dialog";

interface NavItem {
  href: string;
  label: string;
}

interface NavbarProps {
  user?: User | null;
}

export function Navbar({ user }: NavbarProps): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");

  const navItems: NavItem[] = [
    { href: "#about", label: "About" },
    { href: "#connect", label: "Connect" },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      let current = "";
      navItems.forEach((item) => {
        const section = document.querySelector(item.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom >= 80) current = item.href;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="
        fixed top-0 left-0 z-50 w-full backdrop-blur-xl
        
        bg-white/80 dark:bg-black/50
        shadow-sm dark:shadow-none
      "
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative h-13 w-13">
            <Image
              src="/logo.png"
              alt="Reacts Logo"
              fill
              className="rounded-full object-contain"
            />
          </div>
          <span className="text-lg font-sans tracking-widest text-gray-900 dark:text-gray-100">
            Reacts
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <a
                    href={item.href}
                    className={`
                      ${navigationMenuTriggerStyle()}
                      ${
                        activeSection === item.href
                          ? "font-medium"
                          : "text-gray-700 hover:text-gray-900 dark:text-gray-200"
                      }
                    `}
                  >
                    {item.label}
                  </a>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar
                className="
        cursor-pointer
        h-11 w-11
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
         
        
      "
              >
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-gray-400 text-xl font-sans dark:text-gray-300">
                  {user?.email?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="
                bg-white mt-3 p-2 dark:bg-black
              
                
              "
            >
              <DropdownMenuItem
                className="font-sans justify-center items-center"
                onSelect={() => setShowSettings(true)}
              >
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-sans justify-center items-center"
                asChild
              >
                <form action={signout} className="w-full">
                  <button className="justify-center items-center font-sans">
                    Sign Out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setIsOpen((p) => !p)}
          className="md:hidden p-2 text-gray-700 dark:text-gray-200"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="
              md:hidden border-t border-gray-200 dark:border-gray-800
              bg-white dark:bg-black px-4 pb-4
            "
          >
            <ul className="space-y-2 text-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block py-2
                      ${
                        activeSection === item.href
                          ? "font-medium"
                          : "text-gray-800 dark:text-gray-200"
                      }
                    `}
                  >
                    {item.label}
                  </a>
                </li>
              ))}

              <form action={signout}>
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Out
                </Button>
              </form>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {user && (
        <SettingsDialog
          user={user}
          open={showSettings}
          onOpenChange={setShowSettings}
        />
      )}
    </nav>
  );
}
