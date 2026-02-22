"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJobsContext } from "@/context/jobsContext";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Badge } from "@/Components/ui/badge";

interface IJobFormData {
  title: string;
  location: string;
  salary: number | string;
  salaryType: "Year" | "Month" | "Hour";
  negotiable: boolean;
  jobType: string[];
  description: string;
  tags: string[];
  skills: string[];
}

export default function EditJobPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const context = useJobsContext();
  const { getJobById, updateJob, loading: contextLoading, jobs = [] } = context || {};

  const [formData, setFormData] = useState<IJobFormData>({
    title: "",
    location: "",
    salary: 0,
    salaryType: "Year",
    negotiable: false,
    jobType: [],
    description: "",
    tags: [],
    skills: [],
  });

  // Локальні стани для контролю UI
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Швидке отримання з кешу (без очікування API)
  useEffect(() => {
    if (id && jobs.length > 0 && !formData.title) {
      const cached = jobs.find((j: any) => j._id === id);
      if (cached) {
        setFormData({
          title: cached.title || "",
          location: cached.location || "",
          salary: cached.salary || 0,
          salaryType: cached.salaryType || "Year",
          negotiable: cached.negotiable || false,
          jobType: cached.jobType || [],
          description: cached.description || "",
          tags: cached.tags || [],
          skills: cached.skills || [],
        });
        setIsFetching(false);
      }
    }
  }, [id, jobs, formData.title]);

  // 2. Завантаження актуальних даних (виконується ОДИН раз при завантаженні сторінки)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!id || !getJobById) return;
      
      try {
        const job = await getJobById(id);
        if (job && isMounted) {
          setFormData({
            title: job.title || "",
            location: job.location || "",
            salary: job.salary || 0,
            salaryType: job.salaryType || "Year",
            negotiable: job.negotiable || false,
            jobType: Array.isArray(job.jobType) ? job.jobType : [],
            description: job.description || "",
            tags: Array.isArray(job.tags) ? job.tags : [],
            skills: Array.isArray(job.skills) ? job.skills : [],
          });
        }
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [id]); // Залежність тільки від ID, щоб уникнути циклів

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleJobTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter(t => t !== type)
        : [...prev.jobType, type],
    }));
  };

  const handleArrayInput = (e: React.KeyboardEvent<HTMLInputElement>, field: "skills" | "tags") => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !formData[field].includes(value)) {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
        e.currentTarget.value = "";
      }
    }
  };

  const removeArrayItem = (field: "skills" | "tags", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateJob || !id) return;
    
    setIsSubmitting(true);
    try {
      await updateJob(id, { ...formData, salary: Number(formData.salary) });
      router.push(`/job/${id}`); // Перенаправлення після успіху
      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Екран завантаження (тільки якщо даних ще взагалі немає)
  if (isFetching && !formData.title) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="text-gray-500">Отримання даних вакансії...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900">Редагувати вакансію</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Назва та Локація */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Назва посади</label>
                <input name="title" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                  value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Локація</label>
                <input name="location" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                  value={formData.location} onChange={handleChange} />
              </div>
            </div>

            {/* Зарплата */}
            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Зарплата</label>
                <input name="salary" type="number" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                  value={formData.salary} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Період виплати</label>
                <select name="salaryType" className="w-full border border-gray-200 p-3 rounded-xl bg-white focus:ring-2 focus:ring-green-500 outline-none transition" 
                  value={formData.salaryType} onChange={handleChange}>
                  <option value="Year">На рік</option>
                  <option value="Month">На місяць</option>
                  <option value="Hour">За годину</option>
                </select>
              </div>
              <div className="flex items-center gap-3 md:pt-8">
                <input name="negotiable" type="checkbox" id="neg" className="w-5 h-5 accent-green-600 rounded cursor-pointer" 
                  checked={formData.negotiable} onChange={handleChange} />
                <label htmlFor="neg" className="text-sm font-bold text-gray-700 cursor-pointer">Торг можливий</label>
              </div>
            </div>

            {/* Тип зайнятості */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">Тип зайнятості</label>
              <div className="flex flex-wrap gap-2">
                {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
                  <button key={type} type="button" onClick={() => handleJobTypeToggle(type)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      formData.jobType.includes(type) ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Опис */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Опис вакансії</label>
              <textarea name="description" className="w-full border border-gray-200 p-4 rounded-2xl h-48 focus:ring-2 focus:ring-green-500 outline-none resize-none transition" 
                value={formData.description} onChange={handleChange} required />
            </div>

            {/* Навички та Теги */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700">Навички (Enter)</label>
                <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                  placeholder="Додати навичку..." onKeyDown={(e) => handleArrayInput(e, "skills")} />
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((s, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800 border-none px-3 py-1">
                      {s} <button type="button" onClick={() => removeArrayItem("skills", i)} className="ml-1 font-bold">✕</button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700">Теги (Enter)</label>
                <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                  placeholder="Додати тег..." onKeyDown={(e) => handleArrayInput(e, "tags")} />
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((t, i) => (
                    <Badge key={i} variant="outline" className="border-gray-300 text-gray-500 px-3 py-1">
                      #{t} <button type="button" onClick={() => removeArrayItem("tags", i)} className="ml-1 text-red-400">✕</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Кнопки дії */}
            <div className="pt-6 flex flex-col md:flex-row gap-4">
              <button 
                type="submit" 
                disabled={isSubmitting || contextLoading} 
                className="flex-1 bg-[#166434] text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Збереження..." : "Зберегти зміни"}
              </button>
              <button 
                type="button" 
                onClick={() => router.back()} 
                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}