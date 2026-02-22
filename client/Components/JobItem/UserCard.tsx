"use client";
import React from "react";
import Image from "next/image";
import { CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil, Trash, ArrowLeftRight } from "lucide-react"; // Додав іконку
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { formatDates } from "@/utils/fotmatDates";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    createdAt: string;
  };
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onChangeRole?: (id: string, currentRole: string) => void; // Новий проп
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete, onEdit, onChangeRole }) => {
  const { userProfile, isAuthenticated } = useGlobalContext();
  const router = useRouter();

  const isOwnerOrAdmin =
    isAuthenticated && (user._id === userProfile?._id || userProfile?.role === "admin");
  
  const isAdmin = isAuthenticated && userProfile?.role === "admin";

  return (
    <div className="p-6 bg-white rounded-xl flex flex-col gap-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => router.push(`/profile/${user._id}`)}>
          <Image
            alt={`${user.name} profile`}
            src={user.profilePicture || "/user.png"}
            width={48}
            height={48}
            className="rounded-full shadow-sm object-cover"
          />
          <div>
            <CardTitle className="text-lg font-bold truncate max-w-37.5">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground truncate max-w-37.5">{user.email}</p>
            <Badge variant="secondary" className="mt-1 capitalize">
              {user.role}
            </Badge>
          </div>
        </div>

        <div className="flex gap-1">
          {/* Кнопка зміни ролі (Тільки для адміна) */}
          {isAdmin && onChangeRole && user._id !== userProfile?._id && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-blue-500 hover:bg-blue-50" 
              onClick={() => onChangeRole(user._id, user.role)}
              title="Змінити роль"
            >
              <ArrowLeftRight size={16} />
            </Button>
          )}

          {isOwnerOrAdmin && (
            <>
              {onEdit && (
                <Button variant="ghost" size="icon" className="text-gray-500" onClick={() => onEdit(user._id)}>
                  <Pencil size={14} />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                  onClick={() => onDelete(user._id)}
                >
                  <Trash size={14} />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t border-gray-50">
        Зареєстровано: {formatDates(user.createdAt)}
      </div>
    </div>
  );
};

export default UserCard;