"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Heart, Plus, Search, 
  Pencil, Trash2, Eye, LayoutGrid 
} from "lucide-react";

import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { formatDates } from "@/utils/fotmatDates";

// --- Інтерфейси для типізації ---
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

interface ActionBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface EmptyStateProps {
  tab: "posts" | "likes";
}

function Page() {
  const { userJobs, jobs, deleteJob } = useJobsContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext();
  const router = useRouter();

  const [tabState, setTabState] = useState<"posts" | "likes">("likes");
  const [searchQuery, setSearchQuery] = useState("");

  const userId = userProfile?._id;
  const isPrivileged = userProfile?.role === "recruiter" || userProfile?.role === "admin";

  // ВИПРАВЛЕННЯ КАСКАДУ: Обчислюємо реальну активну вкладку під час рендеру
  // Якщо користувач не адмін/рекрутер, він ЗАВЖДИ бачить "likes", незалежно від tabState
  const activeTab = isPrivileged ? tabState : "likes";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("http://localhost:8000/login");
    }
  }, [isAuthenticated, loading, router]);

  const displayedJobs = useMemo(() => {
    let filtered: Job[] = [];
    
    if (activeTab === "posts") {
      filtered = userJobs || [];
    } else {
      filtered = jobs.filter((job: Job) => userId && job.likes?.includes(userId));
    }

    if (searchQuery) {
      filtered = filtered.filter((j: Job) => 
        j.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [activeTab, userJobs, jobs, userId, searchQuery]);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Badge className="mb-4 bg-emerald-100 text-[#166434] border-none px-4 py-1">
              {(userProfile?.role || "USER").toUpperCase()} PORTAL
            </Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {activeTab === "posts" ? "Мої публікації" : "Мої вподобання"}
            </h1>
            <p className="text-slate-500 mt-2">Керуйте вашим контентом та відстежуйте збережені вакансії.</p>
          </div>

          {isPrivileged && (
            <Button 
              onClick={() => router.push("/post-job")}
              className="bg-[#166434] hover:bg-[#114d28] text-white rounded-2xl px-6 py-6 h-auto font-bold shadow-lg flex gap-2"
            >
              <Plus size={20} /> Створити вакансію
            </Button>
          )}
        </header>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-1 w-full md:w-auto">
            <TabButton 
              active={activeTab === "likes"} 
              onClick={() => setTabState("likes")}
              icon={<Heart size={18} />}
              label="Вподобання" 
            />
            {isPrivileged && (
              <TabButton 
                active={activeTab === "posts"} 
                onClick={() => setTabState("posts")}
                icon={<LayoutGrid size={18} />}
                label="Мої пости" 
              />
            )}
          </div>
          
          <div className="relative w-full md:w-80 mr-2">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
              type="text" 
              placeholder="Пошук у списку..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job: Job) => (
                <motion.div 
                  key={job._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.location} • {formatDates(job.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ActionBtn 
                      icon={<Eye size={16} />} 
                      label="Перегляд" 
                      onClick={() => router.push(`/job/${job._id}`)} 
                    />
                    
                    {activeTab === "posts" && (
                      <>
                        <ActionBtn 
                          icon={<Pencil size={16} />} 
                          label="Редагувати" 
                          color="text-blue-600"
                          onClick={() => router.push(`/edit-job/${job._id}`)} 
                        />
                        <ActionBtn 
                          icon={<Trash2 size={16} />} 
                          label="Видалити" 
                          color="text-red-600"
                          onClick={() => {
                            if(window.confirm("Видалити цю вакансію?")) deleteJob(job._id);
                          }} 
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState tab={activeTab} />
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  );
}

// --- Допоміжні компоненти без any ---

function TabButton({ active, onClick, label, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all
      ${active ? "text-white" : "text-slate-500 hover:bg-slate-50"}`}
    >
      {active && (
        <motion.div 
          layoutId="activeTab" 
          className="absolute inset-0 bg-[#166434] rounded-2xl z-0"
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function ActionBtn({ icon, label, onClick, color = "text-slate-600" }: ActionBtnProps) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick}
      className={`${color} hover:bg-slate-50 rounded-xl flex gap-2 px-3`}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

function EmptyState({ tab }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
        <Briefcase size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">Нічого не знайдено</h3>
      <p className="text-slate-500 text-sm mt-1">
        {tab === "likes" ? "Ви ще не зберегли жодної вакансії." : "Ви ще не опублікували жодної вакансії."}
      </p>
    </div>
  );
}

export default Page;