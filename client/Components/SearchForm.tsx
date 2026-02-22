"use client";
import { useJobsContext } from "@/context/jobsContext";
import { location as LocationIcon } from "@/utils/Icons";
import { Search } from "lucide-react";


function SearchForm() {
  const { searchJobs, handleSearchChange, searchQuery } = useJobsContext();

  return (
    <form
      className="relative flex items-center bg-white p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 max-w-5xl mx-auto transition-all hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)]"
      onSubmit={(e) => {
        e.preventDefault();
        searchJobs(searchQuery.tags, searchQuery.location, searchQuery.title);
      }}
    >
      {/* Поле: Посада */}
      <div className="flex-[1.2] relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#166434] transition-colors">
          <Search size={22} />
        </div>
        <input
          type="text"
          id="job-title"
          name="title"
          value={searchQuery.title}
          onChange={(e) => handleSearchChange("title", e.target.value)}
          placeholder="Посада або ключові слова"
          className="w-full py-5 pl-16 pr-4 text-lg text-gray-800 placeholder:text-gray-400 bg-transparent rounded-l-full outline-none"
        />
      </div>

      {/* Розділювач */}
      <div className="w-px h-10 bg-gray-200 mx-2 hidden md:block"></div>

      {/* Поле: Локація */}
      <div className="flex-1 relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#166434] transition-colors font-bold">
           {/* Якщо ваша іконка location - це SVG-строка, вона рендериться тут */}
           <span className="scale-125 block">{LocationIcon}</span>
        </div>
        <input
          type="text"
          id="location"
          name="location"
          value={searchQuery.location}
          onChange={(e) => handleSearchChange("location", e.target.value)}
          placeholder="Місто або регіон"
          className="w-full py-5 pl-14 pr-4 text-lg text-gray-800 placeholder:text-gray-400 bg-transparent outline-none"
        />
      </div>

      {/* Кнопка пошуку */}
      <button
        type="submit"
        className="bg-[#166434] hover:bg-[#12522a] text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <span>Пошук</span>
      </button>
    </form>
  );
}

export default SearchForm;