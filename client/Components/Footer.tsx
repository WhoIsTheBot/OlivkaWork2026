"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Leaf, Instagram, Twitter, 
  Linkedin, Github, 
  ShieldCheck, Globe2, Zap
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    seeker: [
      { name: "Всі вакансії", href: "/findwork" },
      { name: "Компанії", href: "/companies" },
      { name: "Поради з кар'єри", href: "/blog" },
    ],
    employer: [
      { name: "Додати вакансію", href: "/createJob" },
      { name: "Тарифи", href: "/pricing" },
      { name: "Для бізнесу", href: "/business" },
    ],
    socials: [
      { icon: <Instagram size={20} />, href: "#", color: "hover:bg-pink-500" },
      { icon: <Twitter size={20} />, href: "#", color: "hover:bg-sky-400" },
      { icon: <Linkedin size={20} />, href: "#", color: "hover:bg-blue-600" },
      { icon: <Github size={20} />, href: "#", color: "hover:bg-slate-700" },
    ]
  };

  return (
    <footer className="relative bg-[#020617] pt-32 pb-12 overflow-hidden">
      {/* Складна система фонового освітлення */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-250 h-100 bg-emerald-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-75 h-75 bg-blue-600/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-12 h-12 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all duration-300">
                  <Leaf className="text-white w-7 h-7 fill-white/10" />
                </div>
              </div>
              <span className="text-3xl font-black text-white tracking-tighter">
                oliva<span className="bg-linear-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent italic">work</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md font-medium">
              Ми створюємо простір, де технології зустрічаються з талантами. Ваша наступна велика можливість починається тут.
            </p>

            <div className="flex gap-4">
              {footerLinks.socials.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color} hover:text-white hover:border-transparent hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-emerald-500 font-bold mb-8 text-xs uppercase tracking-[0.2em]">Платформа</h4>
              <ul className="space-y-5">
                {footerLinks.seeker.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-white transition-all flex items-center group gap-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-emerald-500 font-bold mb-8 text-xs uppercase tracking-[0.2em]">Бізнес</h4>
              <ul className="space-y-5">
                {footerLinks.employer.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-white transition-all flex items-center group gap-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust/Stats Column (Замість форми підписки) */}
          <div className="lg:col-span-3">
            <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <ShieldCheck size={80} />
              </div>
              
              <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                <Zap className="text-emerald-500" size={18} />
                Статус мережі
              </h4>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Активні вакансії</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">1.2k+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Час аптайму</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">99.9%</span>
                </div>
                <div className="h-px bg-slate-800 w-full" />
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    +40 нових сьогодні
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {currentYear} OliveWork. <span className="hidden sm:inline text-slate-700 mx-2">|</span> 
              <span className="text-slate-400"> Майбутнє роботи вже тут.</span>
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[11px] font-black uppercase tracking-[0.15em] text-slate-600">
            <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <Globe2 size={12} /> UA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;