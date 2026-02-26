"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  MapPin, Calendar, Users,
  Wallet, ChevronLeft, Share2,
  CheckCircle2, Globe, Clock, Sparkles
} from "lucide-react";

import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/fotmatDates";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";
import ReactMarkdown from "react-markdown";

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}

interface LikedUser {
  _id: string;
  name?: string;
  profilePicture?: string;
}

function Page() {
  const { jobs, likeJob, applyToJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const job = jobs.find((j: Job) => j._id === id);

  // 1. Схожі вакансії (memoized)
  const otherJobs = useMemo(() => {
    if (!job) return [];
    return jobs
      .filter((item: Job) => item._id !== id)
      .sort((a: Job, b: Job) => {
        const commonTagsA = a.tags.filter(t => job.tags.includes(t)).length;
        const commonTagsB = b.tags.filter(t => job.tags.includes(t)).length;
        return commonTagsB - commonTagsA;
      })
      .slice(0, 2);
  }, [jobs, id, job]);

  // 2. Похідні стани (Derived State) - обчислюються під час рендеру
  const isCurrentlyLiked = useMemo(() => {
    if (!job || !userProfile) return false;
    return job.likes.some((u: string | LikedUser) =>
      typeof u === 'string' ? u === userProfile._id : u._id === userProfile._id
    );
  }, [job, userProfile]);

  const isCurrentlyApplied = useMemo(() => {
    if (!job || !userProfile) return false;
    return job.applicants.includes(userProfile._id);
  }, [job, userProfile]);

  // Локальні стани для миттєвого відгуку інтерфейсу (Optimistic UI)
  const [localLiked, setLocalLiked] = useState<boolean | null>(null);
  const [localApplied, setLocalApplied] = useState<boolean | null>(null);

  // Пріоритет: локальна зміна -> дані з контексту
  const isLiked = localLiked !== null ? localLiked : isCurrentlyLiked;
  const isApplied = localApplied !== null ? localApplied : isCurrentlyApplied;

  if (!job) return null;

  const {
    title, location, description, salary,
    createdBy, applicants, jobType,
    createdAt, salaryType, negotiable, tags, skills
  } = job;

  // 3. Обробники подій
  const handleLike = () => {
    if (!isAuthenticated) return router.push("/login");
    setLocalLiked(!isLiked);
    likeJob(job._id);
  };

  const handleApply = () => {
    if (!isAuthenticated) return router.push("/login");
    if (isApplied) return toast.error("Ви вже подали заявку");

    setLocalApplied(true);
    applyToJob(job._id);
    toast.success("Заявку надіслано!");
  };

  const handleShare = async () => {
    const shareData = {
      title: job.title,
      text: `Переглянь цю вакансію: ${job.title} у ${job.location}`,
      url: window.location.href, // Бере поточне посилання на сторінку
    };

    try {
      // Перевіряємо, чи підтримує браузер Web Share API
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Якщо не підтримує (наприклад, старі ПК), копіюємо в буфер обміну
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Посилання скопійовано в буфер обміну!");
      }
    } catch (err) {
      console.error("Помилка поширення:", err);
    }
  };

  

  return (
    <main className="bg-[#F8FAFC] min-h-screen pb-20">
      <Header />

      <div className="max-w-350 mx-auto px-6 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-[#166434] transition-colors font-medium group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Назад до списку
        </button>
      </div>

      <div className="max-w-350 mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Side Suggestions */}
        <aside className="lg:col-span-3 hidden lg:flex flex-col gap-6">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-widest font-black text-slate-400 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-500" />
                Схожі пропозиції
              </h3>
              <div className="flex flex-col gap-4">
                {otherJobs.map((item: Job) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ x: 5 }}
                    className="transition-transform"
                  >
                    <JobCard job={item} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-linear-to-br from-[#166434] to-[#0d3d1f] p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden group">
              {/* Декоративний елемент на фоні */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold">Шукаєте більше?</h4>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-black uppercase tracking-wider">
                    Скоро
                  </span>
                </div>

                <p className="text-xs text-emerald-100/70 leading-relaxed mb-4">
                  Ми працюємо над системою сповіщень, щоб ви першими дізнавалися про нові вакансії.
                </p>

                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-200/50 bg-white/5 p-3 rounded-xl border border-white/5">
                  <Clock size={14} className="animate-pulse" />
                  Функція у розробці...
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Column: Main Content */}
        <section className="lg:col-span-6 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12 relative"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-[10rem] z-0 opacity-40" />

            <div className="relative z-10">
              <header className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-emerald-200 rounded-2xl blur group-hover:blur-md transition-all opacity-20"></div>
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-slate-50 shadow-sm flex items-center justify-center">
                      <Image
                        src={createdBy.profilePicture || "/user.png"}
                        alt={createdBy.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-3">
                      {title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                      <span className="text-[#166434] bg-emerald-50 px-3 py-1 rounded-lg text-sm">{createdBy.name}</span>
                      <span className="flex items-center gap-1 text-sm"><MapPin size={16} /> {location}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLike}
                  className={`p-4 rounded-2xl transition-all border ${isLiked
                    ? "bg-emerald-50 border-emerald-100 text-[#166434]"
                    : "bg-white border-slate-100 text-slate-300 hover:text-slate-400"
                    }`}
                >
                  {isLiked ? bookmark : bookmarkEmpty}
                </button>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatBox icon={<Wallet size={18} />} label="Дохід" value={formatMoney(salary, "GBP")} sub={salaryType} color="bg-emerald-50/50 text-emerald-700" />
                <StatBox icon={<Calendar size={18} />} label="Створено" value={formatDates(createdAt)} color="bg-slate-50 text-slate-600" />
                <StatBox icon={<Users size={18} />} label="Заявки" value={applicants.length} color="bg-blue-50/50 text-blue-700" />
                <StatBox icon={<Clock size={18} />} label="Тип" value={jobType[0]} color="bg-orange-50/50 text-orange-700" />
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black text-slate-900">Деталі вакансії</h2>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>

                <div
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg 
               prose-headings:text-slate-900 prose-headings:font-black 
               prose-li:list-disc 
               wrap-break-word overflow-hidden
               [&_span]:bg-transparent! [&_span]:color-inherit!"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right Column: CTA */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="sticky top-24 space-y-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <button
                onClick={handleApply}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3
                  ${isApplied
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[#166434] text-white hover:bg-[#114d28] hover:shadow-lg hover:shadow-emerald-900/20 active:scale-95"}`}
              >
                {isApplied ? <CheckCircle2 size={22} /> : null}
                {isApplied ? "Ви відгукнулися" : "Подати заявку"}
              </button>

              <div className="mt-8 pt-6 border-t border-slate-50 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-tighter">Договірна</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black ${negotiable ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {negotiable ? "ТАК" : "НІ"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-tighter">Категорія</span>
                  <span className="text-sm font-black text-slate-800 uppercase">{jobType[0]}</span>
                </div>
              </div>
            </motion.div>

            {/* БЛОК НАВИЧОК (Skills) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Необхідні навички
              </h3>
              <div className="flex flex-col gap-3">
                {skills && skills.length > 0 ? (
                  skills.map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 group hover:border-amber-200 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                      <span className="text-sm font-bold text-slate-700">{skill}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Навички не вказані</p>
                )}
              </div>
            </div>

            {/* БЛОК ТЕГІВ (Tags) - якщо хочете залишити їх і справа теж */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <Globe size={18} className="text-[#166434]" />
                Категорії (Tags)
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight border border-slate-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleShare} // Додаємо обробник події
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-sm"
            >
              <Share2 size={16} /> Поділитися з друзями
            </button>
          </div>
        </aside>
      </div>

      <Footer />
    </main>
  );
}

function StatBox({ icon, label, value, sub, color }: StatBoxProps) {
  return (
    <div className={`${color} p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-1.5 border border-white/50`}>
      <div className="opacity-70 mb-1">{icon}</div>
      <p className="text-[9px] uppercase tracking-widest font-black opacity-50">{label}</p>
      <p className="font-black text-sm md:text-base tracking-tight leading-none">
        {value}
      </p>
      {sub && <span className="text-[10px] opacity-40 font-bold">{sub}</span>}
    </div>
  );
}

export default Page;