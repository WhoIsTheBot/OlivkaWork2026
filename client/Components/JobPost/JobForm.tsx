"use client";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";
import JobTitle from "./JobTitle";
import JobDetails from "./JobDetails";
import JobSkills from "./JobSkills";
import JobLocation from "./JobLocation";
import { useJobsContext } from "@/context/jobsContext";

function JobForm() {
  const {
    jobTitle,
    jobDescription,
    salaryType,
    activeEmploymentTypes,
    salary,
    location,
    skills,
    negotiable,
    tags,
    resetJobForm,
  } = useGlobalContext();
  const { createJob } = useJobsContext();

  const sections = ["Про вакансію", "Деталі", "Навички", "Локація", "Підсумок"];
  const [currentSection, setCurrentSection] = React.useState(sections[0]);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const renderStages = () => {
    switch (currentSection) {
      case "Про вакансію":
        return <JobTitle />;
      case "Деталі":
        return <JobDetails />;
      case "Навички":
        return <JobSkills />;
      case "Локація":
        return <JobLocation />;
    }
  };

  const getCompletedColor = (section: string) => {
    switch (section) {
      case "Про вакансію":
        return jobTitle && activeEmploymentTypes.length > 0
          ? "bg-[#7263F3] text-white"
          : "bg-gray-300";
      case "Деталі вакансії":
        return jobDescription && salary > 0
          ? "bg-[#7263F3] text-white"
          : "bg-gray-300";
      case "Навички":
        return skills.length && tags.length > 0
          ? "bg-[#7263F3] text-white"
          : "bg-gray-300";
      case "Локація":
        return location.address || location.city || location.country
          ? "bg-[#7263F3] text-white"
          : "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob({
      title: jobTitle,
      description: jobDescription,
      salaryType,
      jobType: activeEmploymentTypes,
      salary,
      location: `${location.address ? location.address + ", " : ""}${location.city ? location.city + ", " : ""}${location.country}`,
      skills,
      negotiable,
      tags,
    });

    resetJobForm();
  };

  return (
    <div className="w-full flex gap-6">
      {/* Ліве меню секцій */}
      <div className="self-start w-40 flex flex-col bg-white rounded-md shadow-sm overflow-hidden">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`pl-4 py-3 relative flex self-start items-center gap-2 font-medium 
                ${currentSection === section ? "text-[#166434]" : "text-gray-500"}`}
            onClick={() => handleSectionChange(section)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center border border-gray-400/60 justify-center text-gray-500
                ${currentSection === section ? " text-white" : ""} ${getCompletedColor(section)}`}
            >
              {index + 1}
            </span>
            {section}
            {currentSection === section && (
              <span className="w-1 h-full absolute left-0 top-0 bg-[#166434] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Форма */}
      <form
        action=""
        className="p-6 flex-1 bg-white rounded-lg self-start"
        onSubmit={handleSubmit}
      >
        {renderStages()}

        {/* Кнопки навігації */}
        <div className="flex justify-end gap-4 mt-4">
          {currentSection !== "Підсумок" && (
            <button
              type="button"
              className="px-6 py-2 bg-[#166434] text-white rounded-md"
              onClick={() => {
                const currentIndex = sections.indexOf(currentSection);
                setCurrentSection(sections[currentIndex + 1]);
              }}
            >
              Далі
            </button>
          )}

          {currentSection === "Підсумок" && (
            <button
              type="submit"
              className="self-end px-6 py-2 bg-[#166434] text-white rounded-md"
            >
              Опублікувати вакансію
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default JobForm;
