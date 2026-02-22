"use client";
import React, { useEffect, useState } from "react";
import { Job } from "@/types/types";
import { useJobsContext } from "@/context/jobsContext";
import Image from "next/image";
import { CardTitle } from "../ui/card";
import { formatDates } from "@/utils/fotmatDates";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil, Trash, MapPin, Calendar, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";

interface JobProps {
  job: Job;
}

function MyJob({ job }: JobProps) {
  const { deleteJob, likeJob } = useJobsContext();
  const { userProfile, isAuthenticated, getUserProfile } = useGlobalContext();
  const [isLiked, setIsLiked] = useState(
    job.likes.includes(userProfile?._id ?? "")
  );

  const router = useRouter();

  const handleLike = (id: string) => {
    setIsLiked((prev) => !prev);
    likeJob(id);
  };

  useEffect(() => {
    if (isAuthenticated && job.createdBy._id) {
      getUserProfile(job.createdBy._id);
    }
  }, [isAuthenticated, job.createdBy._id, getUserProfile]);

  return (
    <div className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => router.push(`/job/${job._id}`)}
        >
          <div className="relative w-12 h-12">
            <Image
              alt="profile"
              src={job.createdBy.profilePicture || "/user.png"}
              fill
              className="rounded-full object-cover ring-2 ring-gray-50 shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#166434] transition-colors leading-tight truncate max-w-50 md:max-w-xs">
              {job.title}
            </CardTitle>
            <p className="text-sm font-medium text-gray-500">
              {job.createdBy.name}
            </p>
          </div>
        </div>

        <button
          className={`p-2 rounded-full transition-colors ${
            isLiked ? "bg-green-50 text-[#166434]" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
          }`}
          onClick={() => {
            if (isAuthenticated) {
              handleLike(job._id);
            } else {
              router.push("https://olivkawork2026.onrender.com/login");
            }
          }}
        >
          <span className="text-xl inline-block transition-transform hover:scale-110">
            {isLiked ? bookmark : bookmarkEmpty}
          </span>
        </button>
      </div>

      {/* Details section */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-500 border-b border-gray-50 pb-4">
        <div className="flex items-center gap-1">
          <MapPin size={14} className="text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} className="text-gray-400" />
          {formatDates(job.createdAt)}
        </div>
        {job.salary && (
          <div className="flex items-center gap-1 text-[#166434]">
            <Banknote size={14} />
            {job.salary.toLocaleString()} {job.salaryType === "Year" ? "/ рік" : "/ міс"}
          </div>
        )}
      </div>

      {/* Tags & Skills */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-green-50 text-green-700 hover:bg-green-100 border-none font-semibold px-2.5 py-0.5"
            >
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {job.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="mt-auto pt-2 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg border-gray-200 text-gray-600 hover:bg-[#166434] hover:text-white transition-all font-semibold"
          onClick={() => router.push(`/job/${job._id}`)}
        >
          Детальніше
        </Button>

        {job.createdBy._id === userProfile?._id && (
          <div className="flex items-center bg-gray-50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md"
              onClick={() => router.push(`/edit-job/${job._id}`)}
            >
              <Pencil size={14} />
              <span className="sr-only">Edit</span>
            </Button>

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md"
              onClick={() => {
                if(window.confirm("Ви впевнені, що хочете видалити цю вакансію?")) {
                  deleteJob(job._id);
                }
              }}
            >
              <Trash size={14} />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyJob;