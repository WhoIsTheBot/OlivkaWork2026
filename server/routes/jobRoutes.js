import express from "express";
import {
  createJob,
  getJobs,
  getJobsByUser,
  searchJobs,
  applyJob,
  likeJob,
  getJobById,
  deleteJob,
  getJobsWithLikes,
  updateJob,
} from "../controllers/jobController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/jobs", protect, createJob);
router.get("/jobs", getJobs);
router.get("/jobs/userJobs", protect, getJobsWithLikes);
router.get("/jobs/user/:id", protect, getJobsByUser);
router.get("/jobs/search", searchJobs);
router.get("/jobs/:id", protect, getJobById);
router.put("/jobs/apply/:id", protect, applyJob);
router.put("/jobs/like/:id", protect, likeJob);
router.delete("/jobs/:id", protect, deleteJob);


// 2. ДОДАЙТЕ ЦЕЙ РЯДОК:
router.put("/jobs/:id", protect, updateJob); 

export default router;