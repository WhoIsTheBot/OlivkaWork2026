import "dotenv/config"; // МИТТЄВЕ ЗАВАНТАЖЕННЯ ENV
import express from "express";
import { auth } from "express-openid-connect";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";

// Перевірка змінних в логах Render (видалити після налагодження)
console.log("--- ENV CHECK ---");
console.log("BASE_URL:", process.env.BASE_URL ? "Loaded" : "MISSING");
console.log("SECRET:", process.env.SECRET ? "Loaded" : "MISSING");
console.log("-----------------");

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
      // На Render завжди HTTPS, тому для безпеки краще true
      // Якщо будуть проблеми з сесією на Render, змініть на process.env.NODE_ENV === "production"
      secure: true, 
      sameSite: "Lax",
    },
  },
};

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ініціалізація Auth0
if (!config.baseURL || !config.secret) {
  console.error("CRITICAL ERROR: Auth0 config missing baseURL or secret!");
} else {
  app.use(auth(config));
}

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

app.get("/", asyncHandler(async (req, res) => {
  if (req.oidc?.isAuthenticated()) {
    await enusureUserInDB(req.oidc.user);
    return res.redirect(process.env.CLIENT_URL);
  } else {
    return res.send("Logged out");
  }
}));

app.get("/register", (req, res) => {
  res.oidc.login({
    authorizationParams: {
      screen_hint: "signup",
    },
  });
});

const registerRoutes = async () => {
  const routeFiles = fs.readdirSync("./routes");
  for (const file of routeFiles) {
    if (file.endsWith(".js")) {
      try {
        const route = await import(`./routes/${file}`);
        if (route.default) {
          app.use("/api/v1/", route.default);
          console.log(`Route loaded: ${file}`);
        }
      } catch (error) {
        console.log(`Error importing route ${file}:`, error.message);
      }
    }
  }
};

const startServer = async () => {
  try {
    await connect();
    await registerRoutes();
    // 0.0.0.0 обов'язково для Render
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

startServer();