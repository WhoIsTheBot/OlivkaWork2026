import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

export const requireAdmin = asyncHandler(async (req, res, next) => {
  try {
    // якщо використовуєш auth0
    const auth0Id = req.oidc?.user?.sub;

    if (!auth0Id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // можна передати користувача далі
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
