"use client";
import { useGlobalContext } from "@/context/globalContext";
import {
  Leaf,
  Plus,
  Menu,
  X,
  Settings,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Profile from "./Profile";

function Header() {
  const { isAuthenticated, userProfile } = useGlobalContext();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const getRoleButton = () => {
    switch (userProfile?.role) {
      case "jobseeker":
        return (
          <Link href="/myProfile" className="bg-[#166434] text-white px-5 py-2 rounded-full flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Мій профіль
          </Link>
        );

      case "recruiter":
        return (
          <Link href="/createJob" className="bg-[#166434] text-white px-5 py-2 rounded-full flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Додати вакансію
          </Link>
        );

      case "admin":
        return (
          <Link href="/admin" className="bg-[#166434] text-white px-5 py-2 rounded-full flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Керування
          </Link>
        );

      default:
        return null;
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* LEFT */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-[#166434] group-hover:bg-[#166434] group-hover:text-white transition-all">
                <Leaf className="w-5 h-5" />
              </div>

              <span className="text-2xl font-bold text-gray-800">
                oliva<span className="text-[#166434]">work</span>
              </span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/findwork"
                className={`font-medium ${pathname === "/findwork"
                  ? "text-[#166434]"
                  : "text-gray-600 hover:text-[#166434]"
                  }`}
              >
                Вакансії
              </Link>
              <Link
                href="/ai-assistant"
                className={`font-medium ${pathname === "/ai-assistant"
                  ? "text-[#166434]"
                  : "text-gray-600 hover:text-[#166434]"
                  }`}
              >
                AI Асистент
              </Link>
            </div>
          </div>

          {/* RIGHT DESKTOP */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Profile />
                {getRoleButton()}
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  href={"http://localhost:8000/login"}
                  className="py-2 px-6 rounded-md border flex items-center gap-4 bg-[#166434] text-white border-[#166434] hover:bg-[#166434]/90 trasition-all duration-200 ease-in-out"
                >
                  <LogIn className="w-4 h-4" />
                  Вхід
                </Link>
                <Link
                  href={"http://localhost:8000/register"}
                  className="py-2 px-6 rounded-md border flex items-center gap-4 border-[#166434] text-[#166434] hover:bg-[#166434]/10 trasition-all duration-200 ease-in-out"
                >
                  <UserPlus className="w-4 h-4" />
                  Реєстрація
                </Link>
              </div>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-4 pb-6 space-y-3">

            {isAuthenticated && (

              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-lg">

                <Profile />
                <div>
                  <p className="font-bold text-sm">{userProfile.name}</p>
                  <p className="text-xs text-[#166434]">
                    {userProfile.profession}
                  </p>
                </div>
              </div>

            )}

            <Link
              href="/findwork"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-green-50"
            >
              Вакансії
            </Link>

            <Link
              href="/companies"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-green-50"
            >
              Компанії
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/post"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md bg-[#166434] text-white text-center"
                >
                  Додати вакансію
                </Link>

                <button
                  onClick={() =>
                  (window.location.href =
                    "http://localhost:8000/logout")
                  }
                  className="block w-full text-left px-3 py-2 rounded-md text-red-600"
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="http://localhost:8000/login"
                  className="block px-3 py-2 rounded-md bg-[#166434] text-white text-center"
                >
                  Увійти
                </Link>

                <Link
                  href="http://localhost:8000/login"
                  className="block px-3 py-2 rounded-md border border-[#166434] text-[#166434] text-center"
                >
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
