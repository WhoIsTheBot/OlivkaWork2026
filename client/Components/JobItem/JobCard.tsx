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
import ReactMarkdown from "react-markdown";

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
      className={`group p-6 rounded-2xl flex flex-col h-full transition-all duration-300 cursor-pointer border-2 bg-white ${activeJob
        ? "border-[#166434] shadow-md"
        : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
        }`}
    >
      {/* Верхня частина контенту (завжди займає максимум місця) */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 relative bg-gray-50 border border-gray-100 rounded-xl overflow-hidden p-1 shrink-0">
              <Image
                src={profilePicture || "/user.png"}
                alt={name || "User"}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-[15px] text-gray-900 leading-tight group-hover:text-[#166434] transition-colors line-clamp-1">
                {title}
              </h4>
              <span className="text-xs text-gray-500 font-medium truncate max-w-37.5">{name}</span>
            </div>
          </div>

          <button
            className={`p-1.5 rounded-full transition-all hover:bg-gray-50 ${isLiked ? "text-[#166434]" : "text-gray-300"
              }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isAuthenticated) handleLike(job._id);
              else router.push("https://olivkawork2026.onrender.com/login");
            }}
          >
            <span className="text-xl leading-none">
              {isLiked ? bookmark : bookmarkEmpty}
            </span>
          </button>
        </div>

        {/* Типи зайнятості */}
        <div className="flex flex-wrap gap-1.5 min-h-6.5">
          {jobType.slice(0, 2).map((type, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${jobTypeBg(type)}`}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Опис - СУВОРО 2-3 РЯДКИ для стабільної висоти */}

        <div className="text-xs text-gray-600 leading-relaxed line-clamp-3 overflow-hidden min-h-[3.5em]">
          <ReactMarkdown
            components={{
              // Перетворюємо всі блочні елементи на інлайнові (span), 
              // щоб line-clamp міг коректно обрізати текст
              p: ({ ...props }) => <span {...props} />,
              h1: ({ ...props }) => <span {...props} />,
              h2: ({ ...props }) => <span {...props} />,
              h3: ({ ...props }) => <span {...props} />,
              li: ({ ...props }) => <span {...props} className="ml-1" />,
              ul: ({ ...props }) => <span {...props} />,
            }}
          >
            {description}
          </ReactMarkdown>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium mt-auto pb-2">
          <div className="flex items-center gap-1">
            <Clock size={13} />
            {formatDates(createdAt)}
          </div>
          {location && (
            <div className="flex items-center gap-1">
              <MapPin size={13} />
              <span className="truncate max-w-25">{location}</span>
            </div>
          )}
        </div>
      </div>

      <Separator className="opacity-60 mb-4" />

      {/* Футер - ЗАВЖДИ ПРИТИСНУТИЙ ДО НИЗУ */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Зарплата</span>
          <p className="text-sm font-black text-gray-900 leading-none mt-1">
            {formatMoney(salary, "GBP")}
            <span className="text-[11px] text-gray-500 font-normal ml-0.5">
              /{salaryType === "Yearly" ? "рік" : "міс"}
            </span>
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#166434] transition-all duration-300">
          <ChevronRight size={18} className="text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}

export default JobCard;