"use client";
import React, { useEffect, useState } from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { useGlobalContext } from "@/context/globalContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

// Типи для резюме
interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  university: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface User {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface Resume {
  _id: string;
  title: string;
  about: string;
  phone: string;
  city: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  createdBy: User;
  likes: string[]; // масив _id користувачів
}

function Page() {
  const { userProfile, isAuthenticated } = useGlobalContext();
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [resume, setResume] = useState<Resume | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}`, {
          credentials: "include",
        });
        const data: Resume = await res.json();
        setResume(data);

        if (userProfile?._id) {
          setIsLiked(data.likes.includes(userProfile._id));
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };
    fetchResume();
  }, [id, userProfile?._id]);

  if (!resume) return <p className="text-center mt-8">Loading...</p>;

  const { title, about, phone, city, experience, education, skills, languages, createdBy, likes } = resume;
  const { name, profilePicture } = createdBy;

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push("http://localhost:8000/login");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/v1/resumes/like/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) setIsLiked((prev) => !prev);
    } catch {
      toast.error("Помилка при вподобанні резюме");
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ліва колонка */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-lg shadow flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <Image
                src={profilePicture || "/user.png"}
                alt={name}
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <p className="font-bold">{name}</p>
          </div>
        </aside>

        {/* Центральна колонка */}
        <section className="lg:col-span-6 bg-white rounded-lg shadow p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <button
              className={`text-2xl ${isLiked ? "text-[#166434]" : "text-gray-400"}`}
              onClick={handleLike}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="mb-4">
            <p><strong>Про себе:</strong> {about}</p>
            <p><strong>Телефон:</strong> {phone}</p>
            <p><strong>Місто:</strong> {city}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Досвід роботи</h2>
            {experience.length ? (
              experience.map((exp, idx) => (
                <div key={idx} className="mb-2 p-2 border rounded-md">
                  <p><strong>Компанія:</strong> {exp.company}</p>
                  <p><strong>Посада:</strong> {exp.position}</p>
                  <p><strong>Період:</strong> {exp.startDate} - {exp.endDate}</p>
                  <p><strong>Опис:</strong> {exp.description}</p>
                </div>
              ))
            ) : (
              <p>Досвід відсутній</p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Освіта</h2>
            {education.length ? (
              education.map((edu, idx) => (
                <div key={idx} className="mb-2 p-2 border rounded-md">
                  <p><strong>Університет:</strong> {edu.university}</p>
                  <p><strong>Ступінь:</strong> {edu.degree}</p>
                  <p><strong>Період:</strong> {edu.startDate} - {edu.endDate}</p>
                </div>
              ))
            ) : (
              <p>Освіта відсутня</p>
            )}
          </div>
        </section>

        {/* Права колонка */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-lg shadow flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Навички</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-[#a2deb9] text-[#166434] px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Мови</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, idx) => (
                <span key={idx} className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">{lang}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow flex flex-col gap-3">
            <p><strong>Кількість вподобань:</strong> {likes.length}</p>
          </div>
        </aside>
      </div>
      <Footer />
    </main>
  );
}

export default Page;
