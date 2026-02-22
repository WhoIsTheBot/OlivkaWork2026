/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { 
  Briefcase, Building, Users, Search, 
  ArrowUpRight, Zap, Globe, ShieldCheck, 
  MousePointer2, TrendingUp 
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion"; // Один чистий імпорт із типами

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
              OlivaWork — це не просто сайт з вакансіями. Це інтелектуальний місток між вашим талантом та амбіціями найкращих компаній світу.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner">
              <div className="grow flex items-center px-4">
                <Search className="text-slate-400 mr-3" size={20} />
                <input 
                  type="text" 
                  placeholder="Яку роботу шукаємо?" 
                  className="bg-transparent border-none focus:ring-0 w-full py-3 outline-none text-slate-700"
                />
              </div>
              <Button className="bg-[#166434] hover:bg-[#114d28] text-white rounded-xl px-8 py-6 h-auto font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95">
                Знайти зараз
              </Button>
            </div>
          </motion.div>

          {/* 2. СТАТИСТИКА */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-6 lg:col-span-4 lg:row-span-2 bg-[#166434] rounded-[2.5rem] p-8 text-white flex flex-col justify-between group cursor-default"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                <TrendingUp size={24} />
              </div>
              <ArrowUpRight className="text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <div>
              <div className="text-4xl font-black mb-1">98%</div>
              <p className="text-emerald-100/70 text-sm font-medium">Кандидатів отримують фідбек протягом 48 годин</p>
            </div>
          </motion.div>

          {/* 3. КАТЕГОРІЇ */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-6 lg:col-span-4 lg:row-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-all cursor-default"
          >
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10, zIndex: 10 }}
                  className={`w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden cursor-pointer`}
                >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" />
                </motion.div>
              ))}
              <div className="w-10 h-10 rounded-full border-4 border-white bg-emerald-50 text-[#166434] flex items-center justify-center text-[10px] font-bold">
                +1k
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1">Спільнота Oliva</h3>
              <p className="text-slate-400 text-sm">Приєднуйся до тисяч професіоналів.</p>
            </div>
          </motion.div>

          {/* 4. ГЛОБАЛЬНІСТЬ */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-4 lg:col-span-3 lg:row-span-2 bg-emerald-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 border border-emerald-100 group"
          >
             <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#166434] shadow-sm"
              >
                <Globe size={24} />
             </motion.div>
             <div className="font-bold text-slate-800">Remote Only</div>
             <p className="text-xs text-slate-500">Працюй з будь-якої точки</p>
          </motion.div>

          {/* 5. БЕЗПЕКА */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-4 lg:col-span-3 lg:row-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md transition-all"
          >
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <ShieldCheck size={24} />
             </div>
             <div className="font-bold text-slate-800">Verified</div>
             <p className="text-xs text-slate-500">Компанії перевірені вручну</p>
          </motion.div>

          {/* 6. ВАКАНСІЇ */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 lg:col-span-6 lg:row-span-2 bg-[#F1F5F9] rounded-[2.5rem] p-2 flex items-center"
          >
             <Link href="/findwork" className="w-full h-full bg-white rounded-[2.2rem] flex items-center justify-between px-8 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                        <Briefcase size={20} />
                    </div>
                    <span className="font-bold text-lg">Всі вакансії</span>
                </div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#166434] group-hover:text-white transition-all"
                >
                    <ArrowUpRight size={20} />
                </motion.div>
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
              className="md:w-1/2 grid grid-cols-2 gap-4"
            >
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  className="bg-slate-100 aspect-square rounded-[2rem] p-8 flex flex-col justify-end"
                >
                    <Building size={32} className="mb-4 text-[#166434]" />
                    <div className="font-bold text-3xl">500+</div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-widest">Компаній</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="bg-[#166434] aspect-square rounded-[2rem] p-8 flex flex-col justify-end text-white relative overflow-hidden"
                >
                    <Users size={32} className="mb-4 text-emerald-300" />
                    <div className="font-bold text-3xl text-white">12k+</div>
                    <div className="text-xs text-emerald-200/60 font-medium uppercase tracking-widest">Фахівців</div>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* Modern Footer Mini CTA */}
      <section className="pb-24 px-4">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden"
        >
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent" 
            />
            <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">Готові змінити життя?</h2>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl px-10 h-14 font-bold active:scale-95 transition-all">
                    Створити профіль
                </Button>
                <Button size="lg" variant="outline" className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl px-10 h-14 font-bold active:scale-95 transition-all">
                    База знань
                </Button>
            </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}