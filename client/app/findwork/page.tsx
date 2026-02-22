"use client";
import React, { useMemo, useState } from "react";
import Filters from "@/Components/Filters";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import SearchForm from "@/Components/SearchForm";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { LayoutGrid, List, Columns, Search } from "lucide-react"; // Сучасні іконки

function Page() {
  // Додайте minSalary та maxSalary сюди
  const { jobs, filters, minSalary, maxSalary } = useJobsContext();
  const [columns, setColumns] = useState(3);

  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  // Використовуємо useMemo для оптимізації фільтрації
  const filteredJobs = useMemo(() => {
    // 1. Починаємо з усіх вакансій
    let result = jobs;

    // 2. Фільтр за зарплатою (працює завжди)
    result = result.filter((job: Job) => {
      return job.salary >= minSalary && job.salary <= maxSalary;
    });

    // 3. Перевіряємо, чи вибрано хоча б один категорійний фільтр
    const activeJobTypes = ["fullTime", "partTime", "contract", "internship"].filter(
      (key) => filters[key as keyof typeof filters]
    );

    const activeTags = ["fullStack", "backend", "devOps", "uiUx"].filter(
      (key) => filters[key as keyof typeof filters]
    );

    // 4. Фільтрація за типом роботи (якщо вибрано)
    if (activeJobTypes.length > 0) {
      result = result.filter((job: Job) => {
        // Мапимо ключі фільтрів на реальні значення в БД
        const mapping: Record<string, string> = {
          fullTime: "Full-time",
          partTime: "Part-time",
          contract: "Contract",
          internship: "Internship",
        };

        return activeJobTypes.some((type) =>
          job.jobType.includes(mapping[type])
        );
      });
    }

    // 5. Фільтрація за тегами (якщо вибрано)
    if (activeTags.length > 0) {
      result = result.filter((job: Job) => {
        const mapping: Record<string, string> = {
          fullStack: "Full Stack",
          backend: "Backend",
          devOps: "DevOps",
          uiUx: "UI/UX",
        };

        return activeTags.some((tag) =>
          job.tags.includes(mapping[tag])
        );
      });
    }

    return result;
  }, [jobs, filters, minSalary, maxSalary]); // Додаємо зарплату в залежності

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 px-6 md:px-16 bg-linear-to-b from-[#f0f4f2] to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Знайдіть роботу своєї <span className="text-[#166434]">мрії</span>
          </h1>
          <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
            Сотні перевірених вакансій у найкращих компаніях країни чекають на вас
          </p>

          <div className="relative z-20 max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>

        {/* Декоративний елемент фону */}
        <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-[#166434]/5 rounded-full blur-3xl"></div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Актуальні вакансії</h2>
            <p className="text-sm text-gray-500">Знайдено {filteredJobs.length} результатів</p>
          </div>

          {/* View Toggle */}
          <button
            onClick={toggleGridColumns}
            className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className={`p-2 rounded-lg transition-all ${columns === 3 ? "bg-white shadow-sm text-[#166434]" : "text-gray-400"}`}>
              <LayoutGrid size={18} />
            </div>
            <div className={`p-2 rounded-lg transition-all ${columns === 2 ? "bg-white shadow-sm text-[#166434]" : "text-gray-400"}`}>
              <Columns size={18} />
            </div>
            <div className={`p-2 rounded-lg transition-all ${columns === 1 ? "bg-white shadow-sm text-[#166434]" : "text-gray-400"}`}>
              <List size={18} />
            </div>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24">
              <Filters />
            </div>
          </aside>

          {/* Jobs Grid */}
          <div
            className={`h-full flex-1 grid gap-6 items-start ${ // Додано items-start
              columns === 3 ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" :
                columns === 2 ? "grid-cols-1 md:grid-cols-2" :
                  "max-w-2xl grid-cols-1" // Додано max-w-2xl для однієї колонки, щоб не було на весь екран
              }`}
          >
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job: Job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                <div className="text-gray-400 mb-4 flex justify-center">
                  <Search size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Вакансій не знайдено</h3>
                <p className="text-gray-500">Спробуйте змінити параметри пошуку або фільтри</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default Page;