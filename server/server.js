import "dotenv/config";
import express from "express";
import { auth } from "express-openid-connect";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";

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
      secure: true, // Завжди true для Render (HTTPS)
      // ВАЖЛИВО: "None" дозволяє передавати куки між різними доменами (Vercel -> Render)
      sameSite: "None", 
    },
  },
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

// ... (решта твого коду з ensureUserInDB та routes)

const startServer = async () => {
  try {
    await connect();
    
    // Динамічне завантаження роутів
    const routeFiles = fs.readdirSync("./routes");
    for (const file of routeFiles) {
      if (file.endsWith(".js")) {
        const route = await import(`./routes/${file}`);
        if (route.default) app.use("/api/v1/", route.default);
      }
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server error", error.message);
    process.exit(1);
  }
};

startServer();