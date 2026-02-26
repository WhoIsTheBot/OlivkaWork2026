/* eslint-disable @next/next/no-img-element */
"use client";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Briefcase, Building, Users, Search,
  ArrowUpRight, Zap, Globe, ShieldCheck,
  MousePointer2, TrendingUp,
  Sparkles,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion"; // Один чистий імпорт із типами
import React, { useState } from "react"; // Додаємо useState
import { useRouter } from "next/navigation"; // Додаємо useRouter

// Явна типізація варіантів для усунення помилок TS
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" // Тепер TS розпізнає це як валідне значення
    },
  },
};

export default function Home() {

  const [searchQuery, setSearchQuery] = useState(""); // Стан для тексту пошуку
  const router = useRouter();

  // Функція для виконання пошуку
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Перенаправляємо на сторінку пошуку, додаючи запит у URL
      router.push(`/findwork?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // Якщо порожньо — просто на сторінку вакансій
      router.push("/findwork");
    }
  };

  // Пошук при натисканні Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };



  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden">
      <Header />

      {/* Hero Bento Section */}
      <section className="container mx-auto px-4 pt-12 pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:grid-rows-6 lg:h-200"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* 1. ГЛАВНИЙ БЛОК */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-12 lg:col-span-8 lg:row-span-4 bg-white rounded-[2.5rem] p-8 md:p-14 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden group"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [12, 15, 12]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 p-8 opacity-10"
            >
              <MousePointer2 size={120} className="text-[#166434]" />
            </motion.div>

            <Badge className="w-fit mb-6 bg-emerald-100 text-[#166434] hover:bg-emerald-100 border-none px-4 py-1">
              <Zap size={12} className="mr-2 fill-[#166434]" />
              AI-Powered Job Search
            </Badge>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight text-slate-900">
              Майбутнє вашої <br />
              <span className="text-[#166434] italic">кар&apos;єри</span> вже тут.
            </h1>

            <p className="text-lg text-slate-500 mb-10 max-w-xl">
              OliveWork — це не просто сайт з вакансіями. Це інтелектуальний місток між вашим талантом та амбіціями найкращих компаній світу.
            </p>

            {/* ФОРМА ПОШУКУ */}
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <div className="grow flex items-center px-4">
                <Search className="text-slate-400 mr-3" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Яку роботу шукаємо?"
                  className="bg-transparent border-none focus:ring-0 w-full py-3 outline-none text-slate-700"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-[#166434] hover:bg-[#114d28] text-white rounded-xl px-8 py-6 h-auto font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
              >
                Знайти зараз
              </Button>
            </div>
          </motion.div>

          {/* 2. СТАТИСТИКА */}
          <motion.div
            variants={itemVariants}
            // Замість shadow використовуємо boxShadow
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px rgba(16, 100, 52, 0.2)"
            }}
            className="md:col-span-6 lg:col-span-4 lg:row-span-2 bg-[#166434] rounded-[2.5rem] p-8 text-white flex flex-col justify-between group cursor-default relative overflow-hidden"
          >
            {/* Декоративний графік на фоні (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              viewBox="0 0 400 200"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M0 150 Q 100 130 150 160 T 300 120 T 450 140"
                fill="none"
                stroke="white"
                strokeWidth="4"
              />
              <circle cx="300" cy="120" r="4" fill="white" className="animate-ping" />
            </svg>

            {/* Блік світла, що рухається */}
            <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col gap-1">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 w-fit">
                  <TrendingUp size={24} className="text-emerald-300" />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-300/80">Live Data</span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-[#166434] transition-all duration-300">
                <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-baseline gap-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="text-6xl font-black tracking-tighter"
                >
                  98%
                </motion.div>
                <Zap size={20} className="text-emerald-400 fill-emerald-400 animate-pulse" />
              </div>
              <p className="text-emerald-100/80 text-sm font-medium leading-tight mt-2 max-w-50">
                Кандидатів отримують фідбек протягом <span className="text-white font-bold">48 годин</span>
              </p>
            </div>
          </motion.div>

          {/* 3. КАТЕГОРІЇ / СПІЛЬНОТА */}
          <motion.div
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.03)",
              borderColor: "rgba(16, 100, 52, 0.2)"
            }}
            className="md:col-span-6 lg:col-span-4 lg:row-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between transition-all cursor-default relative overflow-hidden group"
          >
            {/* Декоративні кільця на фоні */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-slate-50 rounded-full" />
            <div className="absolute -top-5 -right-5 w-40 h-40 border-2 border-slate-50 rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{
                        y: -8,
                        scale: 1.1,
                        zIndex: 50
                      }}
                      className="relative w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm cursor-pointer transition-transform"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                      {/* Індикатор онлайн для деяких користувачів */}
                      {i % 2 === 0 && (
                        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full border-4 border-white bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-md relative z-10"
                  >
                    +1k
                  </motion.div>
                </div>

                <div className="bg-emerald-50 text-[#166434] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={12} className="fill-[#166434]/20" />
                  Active
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-2xl text-slate-900 tracking-tight">Спільнота Oliva</h3>
                  <motion.div
                    animate={{ rotate: [0, 14, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="text-amber-400" size={20} />
                  </motion.div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Приєднуйся до <span className="text-[#166434] font-bold">12,400+</span> професіоналів, які вже будують кар&apos;єру з нами.
                </p>
              </div>
            </div>

            {/* Прогрес-бар довіри внизу */}
            <div className="mt-6 pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Рейтинг довіри</span>
                <span className="text-[10px] font-black text-[#166434]">4.9/5.0</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "94%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-emerald-500 to-[#166434] rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* 4. ГЛОБАЛЬНІСТЬ */}
          <motion.div
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px rgba(16, 100, 52, 0.05)"
            }}
            className="md:col-span-4 lg:col-span-3 lg:row-span-2 bg-linear-to-b from-emerald-50 to-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-emerald-100 group"
          >
            {/* Анімовані орбіти на фоні */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-emerald-200/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-emerald-200/50 border-dashed rounded-full"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#166434] shadow-sm mb-6 border border-emerald-50 group-hover:border-emerald-200 group-hover:shadow-lg group-hover:shadow-emerald-900/5 transition-all"
              >
                <Globe size={32} className="group-hover:text-emerald-500 transition-colors" />
              </motion.div>

              <div className="space-y-1">
                <div className="font-black text-slate-900 text-lg tracking-tight uppercase">Remote Only</div>
                <div className="flex items-center justify-center gap-1.5 py-1 px-3 bg-[#166434]/5 rounded-full">
                  <div className="w-1 h-1 rounded-full bg-[#166434]" />
                  <span className="text-[10px] font-black text-[#166434] uppercase tracking-wider">Без кордонів</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-3 leading-tight px-4">
                  Працюй з дому, кав&apos;ярні чи острова.
                </p>
              </div>
            </div>

            {/* Маленька мітка в кутку */}
            <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <MapPin size={14} className="text-[#166434]" />
            </div>
          </motion.div>

          {/* 5. БЕЗПЕКА */}
          <motion.div
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px rgba(37, 99, 235, 0.05)",
              borderColor: "rgba(37, 99, 235, 0.2)"
            }}
            className="md:col-span-4 lg:col-span-3 lg:row-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden group transition-all duration-500"
          >
            {/* Фонова анімація "сканування" */}
            <motion.div
              animate={{
                top: ["-100%", "200%"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-x-0 h-20 bg-linear-to-b from-blue-400/0 via-blue-400/5 to-blue-400/0 pointer-events-none"
            />

            {/* Декоративні кутові елементи (як у сертифіката) */}
            <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-slate-100 group-hover:border-blue-200 transition-colors" />
            <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-slate-100 group-hover:border-blue-200 transition-colors" />

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mb-6 relative"
              >
                <ShieldCheck size={32} />
                {/* Маленька іконка "чекбокс" */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center text-white"
                >
                  <Zap size={10} className="fill-white" />
                </motion.div>
              </motion.div>

              <div className="space-y-2">
                <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase">Verified</h4>
                <div className="flex items-center gap-1.5 py-1 px-3 bg-blue-50 rounded-full w-fit mx-auto">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">100% Secure</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed px-2">
                  Кожна компанія проходить <span className="text-blue-600 font-bold">ручну модерацію</span> нашою командою.
                </p>
              </div>
            </div>

            {/* Нижній декоративний елемент (водяний знак) */}
            <div className="absolute -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={100} className="text-blue-900" />
            </div>
          </motion.div>

          {/* 6. ВАКАНСІЇ */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-4 lg:col-span-6 lg:row-span-2 bg-[#F1F5F9] rounded-[2.5rem] p-2 flex items-center group/parent"
          >
            <Link
              href="/findwork"
              className="w-full h-full bg-white rounded-[2.2rem] flex items-center justify-between px-8 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 group"
            >
              {/* Декоративні "хмаринки" категорій на фоні, що з'являються при ховері */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute top-4 right-24 bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 shadow-sm"
                >
                  Development
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute bottom-4 right-32 bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full border border-blue-100 shadow-sm"
                >
                  Design
                </motion.div>
              </div>

              <div className="flex items-center gap-6 relative z-10">
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: [-10, 10, -10] }}
                    className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20 group-hover:bg-[#166434] transition-colors duration-500"
                  >
                    <Briefcase size={24} />
                  </motion.div>
                  {/* Пульсуюча крапка сповіщення */}
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-black text-2xl text-slate-900 tracking-tight group-hover:text-[#166434] transition-colors">
                    Всі вакансії
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium italic">Переглянути актуальні пропозиції</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Zap size={12} className="text-amber-400 fill-amber-400" />
                    </motion.span>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center group-hover:bg-[#166434] group-hover:text-white group-hover:border-transparent transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-emerald-900/20"
              >
                <ArrowUpRight size={28} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.div>

              {/* Фоновий градієнт при наведенні */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#166434]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Текстовий блок акценту */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-slate-900">
              Більше ніж <br />
              <span className="text-[#166434] relative">
                просто робота.
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  className="absolute bottom-2 left-0 h-3 bg-emerald-100 -z-10"
                />
              </span>
            </h2>
            <div className="space-y-6">
              {[
                { t: "Для розробників", d: "Прямі контакти з техлідами без зайвих посередників." },
                { t: "Для дизайнерів", d: "Можливість публікації портфоліо безпосередньо у профілі." },
                { t: "Для бізнесу", d: "Розумна система фільтрації кандидатів за навичками." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex gap-4"
                >
                  <div className="mt-1 w-2 h-2 rounded-full bg-[#166434] shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{item.t}</h4>
                    <p className="text-slate-500">{item.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 grid grid-cols-2 gap-4 relative"
          >
            {/* БЛОК КОМПАНІЙ */}
            <motion.div
              whileHover={{ scale: 1.02, rotate: -1 }}
              className="bg-slate-100 aspect-square rounded-[2rem] p-8 flex flex-col justify-end relative overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              {/* Декоративні іконки на фоні */}
              <Building className="absolute -top-4 -right-4 w-32 h-32 text-slate-200/50 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <Briefcase className="absolute top-1/4 left-1/4 w-8 h-8 text-slate-300/30 animate-pulse" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Building size={24} className="text-[#166434]" />
                </div>
                <div className="font-black text-4xl text-slate-900 leading-none">500+</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Компаній</div>
              </div>
            </motion.div>

            {/* БЛОК ФАХІВЦІВ */}
            <motion.div
              whileHover={{ scale: 1.02, rotate: 1 }}
              className="bg-[#166434] aspect-square rounded-[2rem] p-8 flex flex-col justify-end text-white relative overflow-hidden group shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/30 transition-all duration-500"
            >
              {/* Декоративні іконки на фоні */}
              <Users className="absolute -top-6 -left-6 w-36 h-36 text-emerald-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-10"
              >
                <Zap size={20} className="text-emerald-400/30" />
              </motion.div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                  <Users size={24} className="text-emerald-300" />
                </div>
                <div className="font-black text-4xl text-white leading-none">12k+</div>
                <div className="text-[10px] text-emerald-200/50 font-black uppercase tracking-[0.2em] mt-2">Фахівців</div>
              </div>
            </motion.div>

            {/* Додаткова "плаваюча" іконка між блоками для заповнення простору */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-6 -left-6 hidden lg:block"
            >
              <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50">
                <TrendingUp size={24} className="text-emerald-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer Mini CTA */}
      {/* Modern AI CTA Section */}
      <section className="pb-24 px-4 relative">
        {/* Декоративні "світлячки" навколо секції */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full" />

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto bg-[#020617] rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden border border-white/5 shadow-2xl shadow-emerald-900/20"
        >
          {/* Анімований фон з ефектом AI */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl"
            />
          </div>

          {/* Основний контент */}
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">AI Assistant Online</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
              Знайдіть вакансію мрії за допомогою <br />
              <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent italic">
                Штучного Інтелекту
              </span>
            </h2>

            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Наш AI-асистент проаналізує ваш досвід та підбере ідеальні ролі за лічені секунди. Більше ніякого нудного пошуку.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/ai-assistant" className="group relative">
                <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <Button className="relative w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-50 rounded-2xl px-10 h-16 text-lg font-black transition-all active:scale-95 flex items-center gap-3">
                  <Zap className="fill-[#166434] text-[#166434]" size={20} />
                  Спробувати AI Асистента
                </Button>
              </Link>

              <Link href="/findwork">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white/5 border-white/20 hover:border-white/40 hover:bg-white text-white rounded-2xl px-10 h-16 text-lg font-bold backdrop-blur-xl transition-all shadow-lg group/btn"
                >
                  <span className="flex items-center gap-2">
                    Всі вакансії
                    <ArrowUpRight
                      size={18}
                      className="text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all"
                    />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Маленька підказка внизу */}
            <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">Powered by Oliva-Intelligence v2.0</span>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}