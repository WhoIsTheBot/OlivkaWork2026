import asycHandler from "express-async-handler";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  try {

    const id = req.params.id || req.query.id;

    const user = await User.findOne({ auth0Id: id });

    if (!user) {
      console.log("User not found for auth0Id:", id);
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export const checkAuth = asyncHandler(async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // return auth status
    return res.status(200).json({
      isAuthenticated: true,
      user: req.oidc.user,
    });
  } else {
    return res.status(200).json(false);
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export const getUsersByRole = asyncHandler(async (req, res) => {
  try {
    const { role } = req.params;

    // перевірка чи роль валідна
    const allowedRoles = ["jobseeker", "recruiter", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const users = await User.find({ role });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


export const getRecruiter = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id || req.query.id;

    const user = await User.findOne({ auth0Id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "recruiter") {
      return res.status(403).json({ message: "User is not recruiter" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {

    const id = req.params.id || req.query.id;
    const auth0Id = req.oidc?.user?.sub;

    if (!auth0Id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const currentUser = await User.findOne({ auth0Id });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // можна видалити себе або якщо ти адмін
    if (currentUser.role !== "admin" && auth0Id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findOneAndDelete({ auth0Id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  try {
    
    const id = req.params.id;              
    const auth0Id = req.oidc?.user?.sub;   
    console.log("Authenticated user id:", auth0Id);

    if (!auth0Id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const currentUser = await User.findOne({ auth0Id });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // можна редагувати себе або якщо адмін
    if (currentUser.role !== "admin" && auth0Id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // заборона змінювати роль
    if (req.body.role && currentUser.role !== "admin") {
      delete req.body.role;
    }

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export const getUserProfileMongo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Шукаємо саме за системним _id (MongoID)
    const user = await User.findById(id).select("name profilePicture auth0Id");

    if (!user) {
      console.log("User not found for MongoID:", id);
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfileMongo:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


// Виправте назву тут (додайте 'n')
export const getAdmin = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Welcome admin",
    admin: req.user,
  });
});

// Контролер зміни ролі
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params; // Це буде Mongo _id
  const { role } = req.body;

  // Перевірка на валідність ролі
  const allowedRoles = ["jobseeker", "recruiter", "admin"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Невалідна роль" });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ message: "Користувача не знайдено" });
  }

  res.status(200).json(user);
});