"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { LogOut, BookmarkCheck, Plus, User, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";

function Profile() {
  const { userProfile } = useGlobalContext();
  const { profilePicture, name, profession, email } = userProfile || {};
  const pathname = usePathname();

  const handleLogout = () => {
    // Редирект на бекенд /logout
    window.location.href = "http://localhost:8000/logout";
  };

  const getRoleButton = () => {
    switch (userProfile?.role) {
      case "jobseeker":
        return (
          <>

            <DropdownMenuItem>
              <BookmarkCheck className="mr-2 h-4 w-4" />
              <Link href="/myjobs" className={pathname === "/myjobs" ? "font-bold" : ""}>
                Мої вподобання
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Вийти
            </DropdownMenuItem></>
        );

      case "recruiter":
        return (
          <>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <Link href="/myProfile" className={pathname === "/settings" ? "font-bold" : ""}>
                Мій профіль
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="mr-2 h-4 w-4" />
              <Link href="/reviews" className={pathname === "/reviews" ? "font-bold" : ""}>
                Відгуки
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookmarkCheck className="mr-2 h-4 w-4" />
              <Link href="/myjobs" className={pathname === "/myjobs" ? "font-bold" : ""}>
                Мої вакансії
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Вийти
            </DropdownMenuItem></>
        );

      case "admin":
        return (
          <>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <Link href="/myProfile" className={pathname === "/settings" ? "font-bold" : ""}>
                Мій профіль
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="mr-2 h-4 w-4" />
              <Link href="/reviews" className={pathname === "/reviews" ? "font-bold" : ""}>
                Відгуки
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookmarkCheck className="mr-2 h-4 w-4" />
              <Link href="/myjobs" className={pathname === "/myjobs" ? "font-bold" : ""}>
                Мої вакансії
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              <Link href="/createJob" className={pathname === "/createJob" ? "font-bold" : ""}>
                
                Додати вакансію
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Вийти
            </DropdownMenuItem></>
        );

      default:
        return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 group focus:outline-none">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-gray-900 group-hover:text-[#166434] transition-colors">
              {name || "Користувач"}
            </p>
            <p className="text-xs text-[#166434]">{profession || "Професія"}</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden ring-2 ring-transparent group-hover:ring-green-200 transition-all">
            <Image
              src={profilePicture || "/user.png"}
              alt="avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{name || "Користувач"}</p>
            <p className="text-xs text-muted-foreground">{email || "-"}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        {getRoleButton()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;
