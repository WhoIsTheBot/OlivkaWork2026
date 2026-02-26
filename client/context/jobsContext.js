"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useGlobalContext } from "./globalContext";
import api from "@/api/api.js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const JobsContext = createContext();

export const JobsContextProvider = ({ children }) => {
  const { userProfile } = useGlobalContext();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userJobs, setUserJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    tags: "",
    location: "",
    title: "",
  });

  const [filters, setFilters] = useState({
  fullTime: false,
  partTime: false,
  contract: false,
  internship: false,
  temporary: false, // Додано новий тип
  fullStack: false,
  backend: false,
  devOps: false,
  uiux: false,
});


  const [minSalary, setMinSalary] = useState(900);
  const [maxSalary, setMaxSalary] = useState(120000);
  // Додайте це всередину JobsContextProvider

const [singleJob, setSingleJob] = useState(null);

const getJobById = async (id) => {
  setLoading(true);
  try {
    const res = await api.get(`/api/v1/jobs/${id}`);
    setSingleJob(res.data);
    return res.data; // Повертаємо для ініціалізації форми
  } catch (error) {
    console.log("Error getting job by id", error);
  } finally {
    setLoading(false);
  }
};

const updateJob = async (jobId, jobData) => {
  setLoading(true);
  try {
    const res = await api.put(`/api/v1/jobs/${jobId}`, jobData);
    toast.success("Вакансію оновлено!");
    
    // Оновлюємо списки вакансій
    getJobs();
    if (userProfile?._id) getEnrichedUserJobs(userProfile._id);
    
    router.push(`/job/${jobId}`);
  } catch (error) {
    console.log("Error updating job", error);
    toast.error("Помилка при оновленні");
  } finally {
    setLoading(false);
  }
};

// Не забудьте додати updateJob та getJobById у value провайдера

  const getJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log("Error getting jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const getEnrichedUserJobs = useCallback(async (userId) => {
  if (!userId) return;
  setLoading(true);
  try {
    const res = await api.get("/api/v1/jobs/user/" + userId);
    const rawJobs = res.data;

    const userCache = {};

    // Допоміжна функція для завантаження деталей юзерів за масивом ID
    const fetchUserDetails = async (idArray) => {
      if (!idArray || idArray.length === 0) return [];
      return await Promise.all(
        idArray.map(async (id) => {
          if (userCache[id]) return userCache[id];
          try {
            const userRes = await api.get(`/api/v1/users/mongoID/${id}`);
            userCache[id] = {
              _id: userRes.data._id,
              name: userRes.data.name,
              profilePicture: userRes.data.profilePicture,
              auth0Id: userRes.data.auth0Id,
            };
            return userCache[id];
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            console.error(`Помилка отримання юзера ${id}`);
            return null;
          }
        })
      );
    };

    const enrichedJobs = await Promise.all(
      rawJobs.map(async (job) => {
        // Збагачуємо лайки (як було)
        const enrichedLikes = await fetchUserDetails(job.likes);
        
        // ГОЛОВНЕ: Збагачуємо аплікантів (відгуки)
        const enrichedApplicants = await fetchUserDetails(job.applicants);

        return {
          ...job,
          likes: enrichedLikes.filter((u) => u !== null),
          applicantsDetails: enrichedApplicants.filter((u) => u !== null), // Зберігаємо як деталі
          applicants: job.applicants, // Залишаємо оригінальні ID про всяк випадок
        };
      })
    );

    setUserJobs(enrichedJobs);
  } catch (error) {
    console.log("Error enriching jobs:", error);
  } finally {
    setLoading(false);
  }
}, []);

  const createJob = async (jobData) => {
    try {
      const res = await api.post("/api/v1/jobs", jobData);
      toast.success("Job created successfully");
      setJobs((prevJobs) => [res.data, ...prevJobs]);

      if (userProfile?._id) {
        await getEnrichedUserJobs(userProfile._id);
      }
      router.push(`/job/${res.data._id}`);
    } catch (error) {
      console.log("Error creating job", error);
    }
  };

  const searchJobs = async (tags, location, title) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (tags) query.append("tags", tags);
      if (location) query.append("location", location);
      if (title) query.append("title", title);

      const res = await api.get(`/api/v1/jobs/search?${query.toString()}`);
      setJobs(res.data);
    } catch (error) {
      console.log("Error searching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const likeJob = async (jobId) => {
    try {
      await api.put(`/api/v1/jobs/like/${jobId}`);
      toast.success("Job updated");
      getJobs();
      if (userProfile?._id) getEnrichedUserJobs(userProfile._id);
    } catch (error) {
      console.log("Error liking job", error);
    }
  };

    // apply to a job
  const applyToJob = async (jobId) => {
    const job = jobs.find((job) => job._id === jobId);

    if (job && job.applicants.includes(userProfile._id)) {
      toast.error("You have already applied to this job");
      return;
    }

    try {
      const res = await api.put(`/api/v1/jobs/apply/${jobId}`);

      toast.success("Applied to job successfully");
      getJobs();
    } catch (error) {
      console.log("Error applying to job", error);
      toast.error(error.response.data.message);
    }
  };

  const handleSearchChange = (searchName, value) => {
    setSearchQuery((prev) => ({ ...prev, [searchName]: value }));
  };

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (userProfile?._id) {
      getEnrichedUserJobs(userProfile._id);
    }
  }, [userProfile?._id, getEnrichedUserJobs]);

  // ГОЛОВНЕ: Додано оператор return
  return (
    <JobsContext.Provider
      value={{
        jobs,
        loading,
        createJob,
        userJobs,
        searchJobs,
        getUserJobs: getEnrichedUserJobs,
        likeJob,
        handleSearchChange,
        searchQuery,
        setSearchQuery,
        handleFilterChange,
        filters,
        minSalary,
        setMinSalary,
        maxSalary,
        setMaxSalary,
        setFilters,
        updateJob,
        getJobById,
        applyToJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobsContext = () => useContext(JobsContext);