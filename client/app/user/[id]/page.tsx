"use client";
import React, { useEffect } from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { useParams } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import Image from "next/image";

// Інтерфейси для типізації даних
interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface IEducation {
  university: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

function Page() {
  const { id } = useParams();
  const { getPublicProfile, publicProfile, loading } = useGlobalContext();

  useEffect(() => {
    if (id) {
      getPublicProfile(id as string);
    }
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  if (!publicProfile) return (
    <div className="text-center py-20 font-medium text-gray-500">Користувача не знайдено</div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-[90%] py-12 space-y-8">
        {/* Картка заголовка */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src={publicProfile.profilePicture || "/user.png"}
              alt={publicProfile.name || "User"}
              fill
              className="rounded-full object-cover border-4 border-green-50 shadow-sm"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900">{publicProfile.name}</h1>
            <p className="text-green-600 font-medium text-xl mt-1">{publicProfile.profession}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              {publicProfile.createdAt && (
                <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium">
                  На платформі з {new Date(publicProfile.createdAt).getFullYear()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ОСНОВНИЙ КОНТЕНТ */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Про себе */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Про себе</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {publicProfile.bio || "Користувач ще не додав опис."}
              </p>
            </section>

            {/* Навички */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Навички</h2>
              <div className="flex flex-wrap gap-2">
                {publicProfile.skills && publicProfile.skills.length > 0 ? (
                  publicProfile.skills.map((skill: string, index: number) => (
                    <span key={index} className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-100">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Навички не вказані</p>
                )}
              </div>
            </section>

            {/* Досвід роботи */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Досвід роботи</h2>
              <div className="space-y-6">
                {publicProfile.experience && publicProfile.experience.length > 0 ? (
                  publicProfile.experience.map((exp: IExperience, index: number) => (
                    <div key={index} className="relative pl-6 border-l-2 border-green-100">
                      <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 shadow-sm shadow-green-200"></div>
                      <h4 className="font-bold text-gray-900 text-lg">{exp.company}</h4>
                      <p className="text-green-600 font-semibold">{exp.position}</p>
                      <p className="text-gray-500 mt-2 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Досвід роботи не вказаний</p>
                )}
              </div>
            </section>

            {/* Освіта */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Освіта</h2>
              <div className="space-y-6">
                {publicProfile.education && publicProfile.education.length > 0 ? (
                  publicProfile.education.map((edu: IEducation, index: number) => (
                    <div key={index} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900">{edu.university}</h4>
                      <p className="text-gray-600">{edu.fieldOfStudy}</p>
                      {edu.degree && <p className="text-sm text-gray-400 mt-1">{edu.degree}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Інформація про освіту відсутня</p>
                )}
              </div>
            </section>
          </div>

          {/* БОКОВА ПАНЕЛЬ */}
          <aside className="space-y-6 h-fit md:sticky md:top-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6">Контакти</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Електронна пошта</span>
                  <a href={`mailto:${publicProfile.email}`} className="text-gray-700 font-medium hover:text-green-600 transition-colors break-words">
                    {publicProfile.email || "Не вказано"}
                  </a>
                </div>
                
                <div className="pt-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    Контактні дані надаються для ділової комунікації.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-600 rounded-3xl p-8 text-white shadow-xl shadow-green-100 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-3">Зацікавив профіль?</h3>
                <p className="text-green-50 text-sm mb-6 leading-relaxed">
                  Надішліть пропозицію про роботу або обговоріть проект.
                </p>
                <a 
                  href={`mailto:${publicProfile.email}`} 
                  className="block w-full bg-white text-green-600 text-center font-bold py-4 rounded-2xl hover:bg-green-50 transition-all transform hover:-translate-y-1"
                >
                  Зв&apos;язатися
                </a>
              </div>
              {/* Декоративне коло */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-green-500 rounded-full opacity-50"></div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Page;