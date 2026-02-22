"use client";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { useGlobalContext } from "@/context/globalContext";
import Image from "next/image";
import { useState } from "react";
import api from "@/api/api";

// --- СУВОРІ ІНТЕРФЕЙСИ (Strict Types) ---
interface IEducation {
  university: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface IFormData {
  name: string;
  bio: string;
  profession: string;
  skills: string[];
  education: IEducation[];
  experience: IExperience[];
}

export default function Page() {
  const { userProfile, loading, logout, auth0User, getUserProfile } = useGlobalContext();
  const [editing, setEditing] = useState(false);

  // Ініціалізація стану форми з чітким типом
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    bio: "",
    profession: "",
    skills: [],
    education: [],
    experience: [],
  });

  if (loading) return <div className="p-10 flex justify-center text-xl font-medium">Завантаження...</div>;
  if (!userProfile) return <div className="p-10 flex justify-center text-xl font-medium">Користувача не знайдено</div>;

  // Початок редагування: копіюємо дані з профілю у форму
  const handleStartEdit = () => {
    setFormData({
      name: userProfile.name || "",
      bio: userProfile.bio || "",
      profession: userProfile.profession || "",
      skills: [...(userProfile.skills || [])],
      education: [...(userProfile.education || [])],
      experience: [...(userProfile.experience || [])],
    });
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Додавання нових елементів у списки
  const handleAddItem = (type: "education" | "experience") => {
    if (type === "education") {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, { university: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" }]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        experience: [...prev.experience, { company: "", position: "", startDate: "", endDate: "", description: "" }]
      }));
    }
  };

  // Оновлення полів у списках (без використання any)
  const handleUpdateListItem = (
    type: "education" | "experience", 
    index: number, 
    field: string, 
    value: string
  ) => {
    setFormData((prev) => {
      if (type === "education") {
        const newList = [...prev.education];
        newList[index] = { ...newList[index], [field as keyof IEducation]: value };
        return { ...prev, education: newList };
      } else {
        const newList = [...prev.experience];
        newList[index] = { ...newList[index], [field as keyof IExperience]: value };
        return { ...prev, experience: newList };
      }
    });
  };

  // Видалення елементів (Skills, Education, Experience)
  const handleRemoveItem = (type: keyof IFormData, index: number) => {
    setFormData((prev) => {
      if (Array.isArray(prev[type])) {
        const newList = [...(prev[type] as Array<string | IEducation | IExperience>)];
        newList.splice(index, 1);
        return { ...prev, [type]: newList };
      }
      return prev;
    });
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value.trim();
    if (e.key === "Enter" && val && !formData.skills.includes(val)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, val] }));
      e.currentTarget.value = "";
    }
  };

  const saveProfile = async () => {
    try {
      await api.put(`/api/v1/user/${auth0User.sub}`, formData);
      await getUserProfile(auth0User.sub);
      setEditing(false);
    } catch (err) {
      console.error("Помилка збереження:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <div className="flex-1 max-w-5xl mx-auto w-[90%] py-10 space-y-8">
        {/* ВЕРХНЯ КАРТКА */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
          <div className="relative w-30 h-30">
            <Image
              src={userProfile.profilePicture || "/user.png"}
              fill
              alt="avatar"
              className="rounded-full ring-4 ring-green-50 object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            {editing ? (
              <div className="space-y-3">
                <input className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" name="name" value={formData.name} onChange={handleChange} placeholder="Ім'я" />
                <input className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" name="profession" value={formData.profession} onChange={handleChange} placeholder="Професія" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold">{userProfile.name || "Без імені"}</h2>
                <p className="text-green-600 font-medium text-lg">{userProfile.profession || "Професія не вказана"}</p>
                <p className="text-gray-400">{userProfile.email}</p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            {!editing ? (
              <button onClick={handleStartEdit} className="bg-[#166434] text-white px-8 py-2 rounded-full font-bold hover:bg-opacity-90 transition">Редагувати</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveProfile} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition">Зберегти</button>
                <button onClick={() => setEditing(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition">Скасувати</button>
              </div>
            )}
            <button onClick={logout} className="bg-black text-white px-8 py-2 rounded-full font-bold hover:bg-opacity-80 transition">Вийти</button>
          </div>
        </div>

        {/* ПРО МЕНЕ */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Про мене</h3>
          {editing ? (
            <textarea className="w-full border p-4 rounded-2xl h-32 focus:ring-2 focus:ring-green-500 outline-none resize-none" name="bio" value={formData.bio} onChange={handleChange} placeholder="Розкажіть про себе..." />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{userProfile.bio || "Інформація відсутня"}</p>
          )}
        </div>

        {/* НАВИЧКИ */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Навички</h3>
          <div className="flex flex-wrap gap-2">
            {(editing ? formData.skills : (userProfile.skills as string[] || []))?.map((skill: string, i: number) => (
              <span key={i} className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                {skill}
                {editing && (
                  <button onClick={() => handleRemoveItem('skills', i)} className="hover:text-red-500 transition-colors">✕</button>
                )}
              </span>
            ))}
            {editing && (
              <input 
                className="border px-4 py-1.5 rounded-full text-sm outline-none focus:border-green-500 w-32" 
                placeholder="Додати..." 
                onKeyDown={handleAddSkill}
              />
            )}
          </div>
        </div>

        {/* ДОСВІД РОБОТИ */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Досвід роботи</h3>
            {editing && (
              <button onClick={() => handleAddItem("experience")} className="text-green-600 font-bold hover:underline text-sm">+ Додати досвід</button>
            )}
          </div>
          <div className="space-y-6">
            {(editing ? formData.experience : (userProfile.experience as IExperience[] || []))?.map((exp: IExperience, i: number) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 relative">
                {editing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border p-2 rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none" placeholder="Компанія" value={exp.company} onChange={(e) => handleUpdateListItem('experience', i, 'company', e.target.value)} />
                    <input className="border p-2 rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none" placeholder="Посада" value={exp.position} onChange={(e) => handleUpdateListItem('experience', i, 'position', e.target.value)} />
                    <textarea className="border p-2 rounded-lg col-span-full text-sm h-20 focus:ring-1 focus:ring-green-500 outline-none" placeholder="Опис обов'язків" value={exp.description} onChange={(e) => handleUpdateListItem('experience', i, 'description', e.target.value)} />
                    <button onClick={() => handleRemoveItem('experience', i)} className="text-red-500 text-xs font-bold w-fit hover:underline">Видалити запис</button>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-lg">{exp.company}</h4>
                    <p className="text-green-600 font-semibold">{exp.position}</p>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ОСВІТА */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Освіта</h3>
            {editing && (
              <button onClick={() => handleAddItem("education")} className="text-green-600 font-bold hover:underline text-sm">+ Додати освіту</button>
            )}
          </div>
          <div className="space-y-6">
            {(editing ? formData.education : (userProfile.education as IEducation[] || []))?.map((edu: IEducation, i: number) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                {editing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border p-2 rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none" placeholder="Університет" value={edu.university} onChange={(e) => handleUpdateListItem('education', i, 'university', e.target.value)} />
                    <input className="border p-2 rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none" placeholder="Спеціальність / Ступінь" value={edu.fieldOfStudy} onChange={(e) => handleUpdateListItem('education', i, 'fieldOfStudy', e.target.value)} />
                    <button onClick={() => handleRemoveItem('education', i)} className="text-red-500 text-xs font-bold w-fit hover:underline">Видалити запис</button>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-lg">{edu.university}</h4>
                    <p className="text-gray-600 font-medium">{edu.fieldOfStudy}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}