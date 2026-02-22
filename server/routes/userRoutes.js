import express from "express";
import {
  getUserProfile,
  checkAuth,
  getRecruiter,
  getAdmin,
  getUsers,
  deleteUser,
  updateUser,
  getUsersByRole,
  getUserProfileMongo,
  updateUserRole, // ДОДАНО ІМПОРТ
} from "../controllers/userController.js";

import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

// GET
router.get("/check-auth", checkAuth);
router.get("/users/:id", getUserProfile);
router.get("/users/mongoID/:id", getUserProfileMongo);
router.get("/users", getUsers);
router.get("/recruiter/:id", getRecruiter);
router.get("/users/role/:role", getUsersByRole);
router.get("/admin", requireAdmin, getAdmin);

// DELETE
router.delete("/user/:id", requireAdmin, deleteUser);

// PUT/PATCH
router.put("/user/:id", updateUser);
// Додаємо requireAdmin, щоб звичайні юзери не могли міняти собі ролі
router.patch("/users/:id/role", requireAdmin, updateUserRole); 

export default router;