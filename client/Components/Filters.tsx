"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useJobsContext } from "@/context/jobsContext";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import formatMoney from "@/utils/formatMoney";
import { Separator } from "./ui/separator";
import { 
  X, Filter, RotateCcw, SlidersHorizontal, 
  Briefcase, GraduationCap, Wallet 
} from "lucide-react";
import { motion } from "framer-motion";

// 1. Визначаємо чіткий інтерфейс для фільтрів
interface FilterState {
  fullTime: boolean;
  partTime: boolean;
  contract: boolean;
  internship: boolean;
  fullStack: boolean;
  backend: boolean;
  devOps: boolean;
  uiUx: boolean;
}

function Filters() {
  const [isOpen, setIsOpen] = useState(true);
  
  const {
    filters,
    setFilters,
    minSalary,
    maxSalary,
    setMinSalary,
    setMaxSalary,
    searchJobs,
    setSearchQuery,
  } = useJobsContext();

  // 2. Типізуємо локальні стани
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [localMinSalary, setLocalMinSalary] = useState<number>(minSalary);
  const [localMaxSalary, setLocalMaxSalary] = useState<number>(maxSalary);

  // 3. Функція зміни фільтрів з використанням keyof FilterState
  const handleLocalFilterChange = (id: keyof FilterState) => {
    setLocalFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 4. Додаємо пропущену функцію applyFilters
  const applyFilters = () => {
    setFilters(localFilters);
    setMinSalary(localMinSalary);
    setMaxSalary(localMaxSalary);
    searchJobs(); 
  };

  const clearAllFilters = () => {
    const cleared: FilterState = {
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false,
      fullStack: false,
      backend: false,
      devOps: false,
      uiUx: false,
    };
    setLocalFilters(cleared);
    setLocalMinSalary(0);
    setLocalMaxSalary(200000);
    
    setFilters(cleared);
    setMinSalary(0);
    setMaxSalary(200000);
    setSearchQuery({ tags: "", location: "", title: "" });
    searchJobs();
  };

  if (!isOpen) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-24 self-start">
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-[#166434] hover:bg-[#0d3d1f] text-white shadow-xl rounded-2xl h-16 w-16 flex items-center justify-center transition-all group"
        >
          <SlidersHorizontal size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </motion.div>
    );
  }

  // 5. Типізуємо масиви для рендеру, щоб id відповідали keyof FilterState
  const jobTypes: { id: keyof FilterState; label: string }[] = [
    { id: "fullTime", label: "Повний день" },
    { id: "partTime", label: "Стажування" },
    { id: "contract", label: "Контракт" },
    { id: "internship", label: "Часткова" },
  ];

  const specializations: { id: keyof FilterState; label: string }[] = [
    { id: "fullStack", label: "FullStack" },
    { id: "backend", label: "Backend" },
    { id: "devOps", label: "DevOps" },
    { id: "uiUx", label: "UI/UX" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-[320px] bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] sticky top-24 self-start flex flex-col max-h-[calc(100vh-140px)]"
    >
      <div className="p-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#166434]">
            <Filter size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Параметри</h2>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors">
          <X size={20} />
        </button>
      </div>

      <Separator className="mx-7 w-auto bg-slate-50" />

      <div className="flex-1 overflow-y-auto px-7 py-6 custom-scrollbar space-y-10">
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-[#166434]">
            <Briefcase size={16} strokeWidth={2.5} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Тип зайнятості</h3>
          </div>
          <div className="space-y-3">
            {jobTypes.map((item) => (
              <div key={item.id} className="flex items-center justify-between group cursor-pointer p-1">
                <Label htmlFor={item.id} className="text-sm font-bold text-slate-600 group-hover:text-slate-900 cursor-pointer transition-colors">
                  {item.label}
                </Label>
                <Checkbox
                  id={item.id}
                  checked={localFilters[item.id]}
                  onCheckedChange={() => handleLocalFilterChange(item.id)}
                  className="w-5 h-5 border-slate-200 data-[state=checked]:bg-[#166434] data-[state=checked]:border-[#166434]"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-2 text-[#166434]">
            <GraduationCap size={16} strokeWidth={2.5} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Рівень досвіду</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Junior', 'Middle', 'Senior', 'Lead'].map((level) => (
              <div 
                key={level}
                className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-all"
              >
                {level}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#166434]">Спеціалізація</h3>
          <div className="flex flex-wrap gap-2">
            {specializations.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLocalFilterChange(item.id)}
                className={`px-4 py-2 rounded-3xl text-[11px] font-black uppercase tracking-tight transition-all border ${
                  localFilters[item.id] 
                  ? "bg-[#166434] border-[#166434] text-white shadow-lg shadow-emerald-100 scale-105" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-emerald-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6 pb-4">
          <div className="flex items-center gap-2 text-[#166434]">
            <Wallet size={16} strokeWidth={2.5} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Бюджет (рік)</h3>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase">Мін. поріг</span>
                <span className="text-sm font-black text-slate-900 bg-emerald-50 px-3 py-1 rounded-lg">
                  {formatMoney(localMinSalary, "GBP")}
                </span>
              </div>
              <Slider
                min={0} max={200000} step={5000}
                value={[localMinSalary]}
                onValueChange={(v) => setLocalMinSalary(v[0])}
                className="py-2 cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase">Макс. поріг</span>
                <span className="text-sm font-black text-slate-900 bg-emerald-50 px-3 py-1 rounded-lg">
                  {formatMoney(localMaxSalary, "GBP")}
                </span>
              </div>
              <Slider
                min={0} max={200000} step={5000}
                value={[localMaxSalary]}
                onValueChange={(v) => setLocalMaxSalary(v[0])}
                className="py-2 cursor-pointer"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="p-7 bg-slate-50/30 rounded-b-[2.5rem] border-t border-slate-50">
        <Button
          onClick={applyFilters}
          className="w-full bg-[#166434] hover:bg-[#0d3d1f] text-white h-14 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100/50 transition-all active:scale-95"
        >
          Застосувати фільтри
        </Button>
        <button
          onClick={clearAllFilters}
          className="w-full mt-4 flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-xs font-bold"
        >
          <RotateCcw size={14} />
          Скинути параметри
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </motion.div>
  );
}

export default Filters;