"use client";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { Clock, MapPin, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Separator } from "../ui/separator";
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/fotmatDates";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";

interface JobProps {
  job: Job;
  activeJob?: boolean;
}

function JobCard({ job, activeJob }: JobProps) {
  const { likeJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const [isLiked, setIsLiked] = React.useState(
    job.likes.includes(userProfile?._id ?? "")
  );

  const {
    title,
    salaryType,
    salary,
    createdBy,
    jobType,
    createdAt,
    description,
    location,
  } = job;

  const { name, profilePicture } = createdBy;
  const router = useRouter();

  // Очищення HTML для прев'ю
  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const cleanDescription = React.useMemo(() => stripHtml(description), [description]);

  const handleLike = (id: string) => {
    setIsLiked((prev) => !prev);
    likeJob(id);
  };

  const jobTypeBg = (type: string) => {
    switch (type) {
      case "Full-time": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Part-time": return "bg-amber-50 text-amber-600 border-amber-100";
      case "Contract": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div
      onClick={() => router.push(`/job/${job._id}`)}
      className={`group p-6 rounded-3xl flex flex-col h-80 transition-all duration-300 cursor-pointer border-2 bg-white ${
        activeJob
          ? "border-[#166434] shadow-lg scale-[1.02]"
          : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl"
      }`}
    >
      {/* Головний контейнер контенту */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Шапка картки */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 items-center overflow-hidden">
            <div className="w-12 h-12 relative bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0">
              <Image
                src={profilePicture || "/user.png"}
                alt={name || "User"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              {/* Фіксуємо висоту заголовка (2 рядки) */}
              <h4 className="font-bold text-[15px] text-gray-900 leading-tight group-hover:text-[#166434] transition-colors line-clamp-2 h-[40px]">
                {title}
              </h4>
              <span className="text-xs text-gray-500 font-medium truncate">{name}</span>
            </div>
          </div>

          <button
            className={`p-2 rounded-full transition-all hover:bg-gray-100 shrink-0 ${isLiked ? "text-[#166434]" : "text-gray-300"}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isAuthenticated) handleLike(job._id);
              else router.push("/login");
            }}
          >
            <span className="text-xl leading-none">
              {isLiked ? bookmark : bookmarkEmpty}
            </span>
          </button>
        </div>

        {/* Теги типу роботи */}
        <div className="flex flex-wrap gap-1.5 mb-4 h-[26px] overflow-hidden">
          {jobType.slice(0, 2).map((type, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${jobTypeBg(type)}`}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Опис з фіксованою висотою (3 рядки) */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 break-words h-[54px]">
            {cleanDescription}
          </p>
        </div>

        {/* Мета-дані (дата, локація) */}
        <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium mt-auto mb-4">
          <div className="flex items-center gap-1 shrink-0">
            <Clock size={13} />
            {formatDates(createdAt)}
          </div>
          {location && (
            <div className="flex items-center gap-1 overflow-hidden">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      <Separator className="opacity-60 mb-4" />

      {/* Футер картки */}
      <div className="flex justify-between items-center h-[40px] shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Зарплата</span>
          <p className="text-sm font-black text-gray-900 leading-none mt-1">
            {formatMoney(salary, "GBP")}
            <span className="text-[11px] text-gray-500 font-normal ml-1">
              /{salaryType === "Yearly" ? "рік" : "міс"}
            </span>
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#166434] group-hover:scale-110 transition-all duration-300">
          <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}

export default JobCard;