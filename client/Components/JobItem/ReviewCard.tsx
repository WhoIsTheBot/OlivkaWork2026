"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EnrichedJob } from "@/types/types";

// --- Інтерфейси ---
interface Applicant {
  _id: string;
  auth0Id?: string;
  name?: string;
  profilePicture?: string;
}

interface ReviewCardProps {
  job: EnrichedJob;
}

export default function ReviewCard({ job }: ReviewCardProps) {
  const [open, setOpen] = useState(false);

  // 1. ВИПРАВЛЕННЯ: Безпечне отримання jobType (уникаємо 'unknown')
  // Кастимо до string[], якщо TypeScript не бачить тип з EnrichedJob
  const jobTypes = (job.jobType as string[]) || [];

  // 2. ВИПРАВЛЕННЯ: Типізація аплікантів без any
  const candidateList = (job.applicantsDetails || job.applicants || []) as Applicant[];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 transition-all hover:shadow-lg hover:border-emerald-100 group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-[#166434] transition-colors">
              {job.title}
            </h3>
            
            {/* Рендеримо бейдж лише якщо є хоча б один тип роботи */}
            {jobTypes.length > 0 && (
              <span className="bg-emerald-50 text-[#166434] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {jobTypes[0]}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Опубліковано: {new Date(job.createdAt).toLocaleDateString()} • {job.location}
          </p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
            open
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-[#166434] text-white hover:bg-[#114d28] shadow-md shadow-emerald-900/10"
          }`}
        >
          {open ? "Сховати список" : `Кандидати (${candidateList.length})`}
        </button>
      </div>

      {open && (
        <div className="mt-8 border-t border-slate-50 pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Список аплікантів
            </h4>
            <div className="h-px flex-1 bg-slate-50 ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {candidateList.length === 0 ? (
              <div className="col-span-full py-10 flex flex-col items-center opacity-40">
                <p className="text-slate-500 italic font-medium">На цю вакансію ще немає відгуків</p>
              </div>
            ) : (
              candidateList.map((user) => (
                <Link
                  key={user._id}
                  href={`/user/${user.auth0Id || user._id}`}
                  className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-slate-50/50 hover:bg-white transition-all border border-transparent hover:border-emerald-100 hover:shadow-sm group/item"
                >
                  <div className="relative w-12 h-12 shrink-0">
                    <div className="absolute inset-0 bg-emerald-200 rounded-full blur-md opacity-0 group-hover/item:opacity-20 transition-opacity"></div>
                    <Image
                      src={user.profilePicture || "/user.png"}
                      fill
                      sizes="48px"
                      alt={user.name || "User"}
                      className="rounded-full object-cover border-2 border-white shadow-sm relative z-10"
                    />
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-slate-700 truncate group-hover/item:text-[#166434] transition-colors">
                      {user.name || "Анонімний користувач"}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Переглянути профіль
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}