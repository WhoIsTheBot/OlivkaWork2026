"use client";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import UserCard from "@/Components/JobItem/UserCard";
import { useGlobalContext } from "@/context/globalContext";
import React, { useEffect, useMemo } from "react";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string; 
  profilePicture?: string;
  createdAt: string;
}

function Page() {
  const {loading, getUsers, users = [], changeUserRole } = useGlobalContext();
  const [activeTab, setActiveTab] = React.useState<"jobseeker" | "recruiter">("jobseeker");
 
  useEffect(() => {
    if (typeof getUsers === "function") {
      getUsers(activeTab);
    }
  }, [activeTab, getUsers]);

  const currentUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((u: UserType) => u.role?.toLowerCase() === activeTab.toLowerCase());
  }, [users, activeTab]);

  // Функція обробник зміни ролі
  const handleRoleToggle = async (id: string, currentRole: string) => {
    const newRole = currentRole === "jobseeker" ? "recruiter" : "jobseeker";
    if (confirm(`Змінити роль користувача на ${newRole}?`)) {
      await changeUserRole(id, newRole);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#166434]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 pb-12">
        <div className="mt-8 w-[90%] mx-auto flex flex-col">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Керування користувачами</h2>
          
          {/* Таби */}
          <div className="self-center flex items-center gap-4 bg-white p-1 rounded-full shadow-sm border">
            <button
              className={`px-8 py-2 rounded-full font-medium transition-all ${
                activeTab === "jobseeker" ? "bg-[#166434] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("jobseeker")}
            >
              Шукачі
            </button>
            <button
              className={`px-8 py-2 rounded-full font-medium transition-all ${
                activeTab === "recruiter" ? "bg-[#166434] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("recruiter")}
            >
              Рекрутери
            </button>
          </div>

          {/* Список */}
          <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentUsers.length > 0 ? (
              currentUsers.map((user: UserType) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onEdit={(id) => console.log("Edit:", id)}
                  onDelete={(id) => console.log("Delete:", id)}
                  onChangeRole={handleRoleToggle} // Передаємо функцію
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed">
                <p className="text-xl text-gray-400 italic">
                  У цій категорії поки немає користувачів
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Page;