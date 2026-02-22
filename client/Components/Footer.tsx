"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Leaf, Mail, Instagram, Twitter, 
  Linkedin, Github, ArrowUpRight 
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
      { name: "Додати вакансію", href: "/post" },
      { name: "Тарифи", href: "/pricing" },
      { name: "Для бізнесу", href: "/business" },
    ],
    socials: [
      { icon: <Instagram size={18} />, href: "#" },
      { icon: <Twitter size={18} />, href: "#" },
      { icon: <Linkedin size={18} />, href: "#" },
      { icon: <Github size={18} />, href: "#" },
    ]
  };

  return (
    <footer className="relative bg-[#0F172A] pt-24 pb-12 overflow-hidden">
      {/* Декоративний елемент фону (світіння) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-150 h-75 bg-emerald-900/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Leaf className="text-white w-6 h-6 fill-white/20" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                oliva<span className="text-emerald-500 italic">work</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-sm">
              Ми будуємо майбутнє рекрутингу, де талант знаходить можливості без кордонів та зайвих бар&apos;єрів.
            </p>
            <div className="flex gap-4">
              {footerLinks.socials.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Шукачу</h4>
            <ul className="space-y-4">
              {footerLinks.seeker.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center group gap-1">
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Роботодавцю</h4>
            <ul className="space-y-4">
              {footerLinks.employer.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center group gap-1">
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact Column */}
          <div className="lg:col-span-4 bg-white/5 rounded-[2rem] p-8 border border-white/10 backdrop-blur-sm">
            <h4 className="text-white font-bold mb-4">Залишайтеся на зв&apos;язку</h4>
            <p className="text-sm text-slate-400 mb-6">Отримуйте найкращі вакансії тижня на пошту.</p>
            <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition-colors">
              <input 
                type="email" 
                placeholder="Ваш email" 
                className="bg-transparent border-none focus:ring-0 text-sm px-3 grow text-white outline-none"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95">
                Join
              </button>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Mail size={16} />
              </div>
              support@olivawork.com
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} <span className="text-slate-300 font-medium">OlivaWork</span>. Crafted for the future of work.
          </p>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;