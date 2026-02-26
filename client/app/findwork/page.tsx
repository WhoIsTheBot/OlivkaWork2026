"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  Columns,
  Search,
} from "lucide-react";

import Filters from "@/Components/Filters";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import SearchForm from "@/Components/SearchForm";
import { useJobsContext } from "@/context/jobsContext";

export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: string[];
  skills: string[];
  tags: string[];
  salaryType: string;
  negotiable: boolean;
  createdBy: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  likes: string[]; // Тут залишаються string[], як на бекенді
  applicants: string[];
  createdAt: string;
  updatedAt?: string;
}

// Компонент контенту сторінки
function FindWorkContent() {
  const { jobs, filters, minSalary, maxSalary } = useJobsContext();
  const searchParams = useSearchParams();
  const [columns, setColumns] = useState(3);

  // Отримуємо значення ?search= з URL
  const searchQuery = searchParams.get("search") || "";


  // Головна логіка фільтрації
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Фільтрація за текстовим пошуком
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((job: Job) => {
        // Перевіряємо поля, які точно є в типі Job
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesTags = job.tags.some(tag => tag.toLowerCase().includes(query));

        // Безпечно перевіряємо властивість, якої може не бути в типі, але вона може бути в об'єкті
        const companyName = (job as unknown as Record<string, unknown>).companyName;
        const matchesCompany = typeof companyName === "string"
          ? companyName.toLowerCase().includes(query)
          : false;

        return matchesTitle || matchesTags || matchesCompany;
      });
    }

    // 2. Фільтр за зарплатою
    result = result.filter((job: Job) => {
      return job.salary >= minSalary && job.salary <= maxSalary;
    });

    // 3. Фільтрація за типом роботи
    const activeJobTypes = ["fullTime", "partTime", "contract", "internship"].filter(
      (key) => filters[key as keyof typeof filters]
    );

    if (activeJobTypes.length > 0) {
      result = result.filter((job: Job) => {
        const mapping: Record<string, string> = {
          fullTime: "Full-time",
          partTime: "Part-time",
          contract: "Contract",
          internship: "Internship",
        };
        return activeJobTypes.some((type) => job.jobType.includes(mapping[type]));
      });
    }

    // 4. Фільтрація за тегами
    const activeTags = ["fullStack", "backend", "devOps", "uiUx"].filter(
      (key) => filters[key as keyof typeof filters]
    );

    if (activeTags.length > 0) {
      result = result.filter((job: Job) => {
        const mapping: Record<string, string> = {
          fullStack: "Full Stack",
          backend: "Backend",
          devOps: "DevOps",
          uiUx: "UI/UX",
        };
        return activeTags.some((tag) => job.tags.includes(mapping[tag]));
      });
    }

    return result;
  }, [jobs, filters, minSalary, maxSalary, searchQuery]);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 px-6 md:px-16 bg-linear-to-b from-slate-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Знайдіть роботу своєї <span className="text-[#166434] italic">мрії</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-10 text-lg max-w-2xl mx-auto"
          >
            Сотні перевірених вакансій у найкращих компаніях країни чекають на вас
          </motion.p>

          <div className="relative z-20 max-w-4xl mx-auto">
            <SearchForm />
          </div>

          {/* Відображення активного пошукового запиту */}
          {searchQuery && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-[#166434] px-4 py-2 rounded-full border border-emerald-100 text-sm font-bold"
            >
              <Search size={14} />
              Результати для: &quot;{searchQuery}&quot;
            </motion.div>
          )}
        </div>

        <div className="absolute top-0 right-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              Актуальні вакансії
              {filteredJobs.length > 0 && (
                <span className="bg-[#166434] text-white text-[10px] px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500 font-medium">Знайдено {filteredJobs.length} результатів</p>
          </div>

          {/* View Toggle */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
            {[
              { icon: LayoutGrid, val: 3 },
              { icon: Columns, val: 2 },
              { icon: List, val: 1 }
            ].map((btn) => (
              <button
                key={btn.val}
                onClick={() => setColumns(btn.val)}
                className={`p-2 rounded-xl transition-all ${columns === btn.val ? "bg-white shadow-sm text-[#166434]" : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <btn.icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-100 p-2">
              <Filters />
            </div>
          </aside>

          {/* Jobs Grid */}
          <div className="flex-1">
            <motion.div
              layout
              className={`grid gap-6 items-start ${columns === 3 ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" :
                  columns === 2 ? "grid-cols-1 md:grid-cols-2" :
                    "max-w-3xl grid-cols-1"
                }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job: Job) => (
                    <motion.div
                      layout
                      key={job._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
                  >
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                      <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Нічого не знайдено</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                      Ми не знайшли вакансій за запитом &quot;{searchQuery}&quot;. Спробуйте використати інші ключові слова.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// Головний компонент з Suspense для Next.js App Router
export default function FindWorkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Шукаємо вакансії...</p>
        </div>
      </div>
    }>
      <FindWorkContent />
    </Suspense>
  );
}