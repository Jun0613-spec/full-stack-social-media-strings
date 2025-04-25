"use client";

import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useState, useEffect, useRef } from "react";

import { useTheme } from "../providers/theme-provider";

import Button from "./Button";

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-sm">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleDropdown}
        className="p-1.5"
      >
        <HiOutlineSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <HiOutlineMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute bg-white dark:bg-black right-0 mt-2 w-32  shadow-lg rounded-md z-10 border border-neutral-200 dark:border-neutral-800"
        >
          <div
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
            className="hover:bg-neutral-100 dark:hover:bg-neutral-900 px-4 py-2 rounded-t-md"
          >
            Light
          </div>

          <div className="h-px w-full bg-neutral-300 dark:bg-neutral-600" />

          <div
            onClick={() => {
              setTheme("dark");
              setOpen(false);
            }}
            className="hover:bg-neutral-100 dark:hover:bg-neutral-900 px-4 py-2"
          >
            Dark
          </div>

          <div className="h-px w-full bg-neutral-300 dark:bg-neutral-600" />

          <div
            onClick={() => {
              setTheme("system");
              setOpen(false);
            }}
            className="hover:bg-neutral-100 dark:hover:bg-neutral-900 px-4 py-2 rounded-b-md"
          >
            System
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
