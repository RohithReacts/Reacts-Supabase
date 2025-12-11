"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "./darkmode";
import { signout } from "@/app/auth/actions";
import { Button } from "../ui/button";

interface NavDropdownItem {
  href: string;
  label: string;
}

interface NavItem {
  href: string;
  label: string;
  dropdown?: NavDropdownItem[];
}

export function Navbar(): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");

  const navItems = React.useMemo<NavItem[]>(
    () => [
      { href: "#about", label: "About" },
      { href: "#connect", label: "Connect" },
    ],
    []
  );

  React.useEffect(() => {
    const handleScroll = (): void => {
      const sections = navItems.filter((i) => i.href.startsWith("#"));
      let current = "";
      for (const item of sections) {
        const section = document.querySelector<HTMLElement>(item.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom >= 80) {
            current = item.href;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <div className="relative w-20 h-20"></div>
          <span className="text-xl font-sans text-gray-900 dark:text-gray-100 transition-colors">
            Reacts
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {navItems.map((item) =>
                item.dropdown ? (
                  <NavigationMenuItem key={item.href}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={`${navigationMenuTriggerStyle()} cursor-pointer flex items-center gap-1`}
                      >
                        {item.label} <ChevronDown className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white cursor-pointer dark:bg-gray-900 rounded-md shadow-lg">
                        {item.dropdown.map((drop) => (
                          <DropdownMenuItem key={drop.href} asChild>
                            <Link
                              href={drop.href}
                              className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                            >
                              {drop.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    {item.href.startsWith("#") ? (
                      <a
                        href={item.href}
                        className={`${navigationMenuTriggerStyle()} ${
                          activeSection === item.href
                            ? ""
                            : "text-gray-800 dark:text-gray-200 cursor-pointer"
                        }`}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="text-gray-800 dark:text-gray-200"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <form action={signout}>
            <Button variant="outline" className="cursor-pointer">
              Sign Out
            </Button>
          </form>

          <ModeToggle />
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-4 pb-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800"
          >
            <ul className="flex flex-col justify-center items-center space-y-2">
              {navItems.map((item) => (
                <li key={item.href} className="w-full text-center m-2">
                  {item.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full py-2 font-semibold text-gray-800 dark:text-gray-200 flex justify-center items-center gap-1">
                        {item.label} <ChevronDown className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-gray-900 rounded-md shadow-lg w-full">
                        {item.dropdown.map((drop) => (
                          <DropdownMenuItem key={drop.href} asChild>
                            <Link
                              href={drop.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                            >
                              {drop.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : item.href.startsWith("#") ? (
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-2 ${
                        activeSection === item.href
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-gray-800 dark:text-gray-200"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}

              {/* ⭐ MOBILE SIGN OUT BUTTON */}
              <li className="w-full flex justify-center pt-2">
                <form action={signout} className="w-full flex justify-center">
                  <Button
                    variant="outline"
                    className="w-40 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Out
                  </Button>
                </form>
              </li>

              <li>
                <ModeToggle />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
