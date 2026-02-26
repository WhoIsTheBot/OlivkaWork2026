import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";

dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL,
    callback: "/callback",
    logout: "/logout",
    login: "/login",
  },
  session: {
    absoluteDuration: 30 * 24 * 60 * 60 * 1000,
    cookie: {
      secure: true,
      sameSite: "None", 
    },
  },

  // session: {
  //   cookie: {
  //     secure: false,
  //   },
  // },
};

const PORT = process.env.PORT || 8000;

// --- Middleware ---
app.use(
  cors({

    origin: "https://olivka-work2026.vercel.app", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Ініціалізація Auth0
if (process.env.BASE_URL && process.env.SECRET) {
  app.use(auth(config));
}

// --- Вспоміжна функція для БД ---
const enusureUserInDB = async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });
    if (!existingUser) {
      const newUser = new User({
        auth0Id: user.sub,
        email: user.email,
        name: user.name,
        role: "jobseeker",
        profilePicture: user.picture,
      });
      await newUser.save();
      console.log("User added to db:", user.email);
    }
  } catch (error) {
    console.log("Error checking or adding user to db:", error.message);
  }
};

// --- Основні маршрути ---
app.get("/", asyncHandler(async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // Користувач увійшов — створюємо/перевіряємо в БД
    await enusureUserInDB(req.oidc.user);
    
    // ПЕРЕНАПРАВЛЯЄМО НА VERCEL
    // Переконайся, що в Render додана змінна CLIENT_URL=https://olivka-work2026.vercel.app
    return res.redirect(process.env.CLIENT_URL || 'https://olivka-work2026.vercel.app');
  } else {
    // Якщо не залогінений, теж кидаємо на фронтенд
    return res.redirect(process.env.CLIENT_URL || 'https://olivka-work2026.vercel.app');
  }
}));

app.get("/register", (req, res) => {
  res.oidc.login({
    authorizationParams: {
      screen_hint: "signup",
    },
  });
});

// --- Функція для динамічного завантаження роутів ---
const registerRoutes = async () => {
  const routeFiles = fs.readdirSync("./routes");
  
  for (const file of routeFiles) {
    // Завантажуємо тільки .js файли
    if (file.endsWith(".js")) {
      try {
        const route = await import(`./routes/${file}`);
        // Перевірка, чи файл дійсно експортує роутер
        if (route.default && typeof route.default === 'function') {
          app.use("/api/v1/", route.default);
          console.log(`Route loaded: ${file}`);
        }
      } catch (error) {
        console.log(`Error importing route ${file}:`, error.message);
      }
    }
  }
};

// --- Запуск сервера ---
const startServer = async () => {
  try {
    await connect(); // Підключення до БД
    
    await registerRoutes(); // ЧЕКАЄМО завантаження роутів перед запуском
    
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

startServer();