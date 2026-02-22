import express from "express";
import asyncHandler from "express-async-handler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/UserModel.js"; // Переконайтеся, що назва файлу вірна
import Job from "../models/JobModel.js";

const router = express.Router();

// Ініціалізація Gemini (краще винести ключ в .env)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

router.post("/chat", asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    // 1. Отримуємо дані користувача через Auth0 сесію
    // sub - це унікальний ID від Auth0
    const userAuth = req.oidc?.user;
    const userData = userAuth ? await User.findOne({ auth0Id: userAuth.sub }) : null;

    // 2. Отримуємо вакансії
    const jobs = await Job.find().limit(20);

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

    // Оновлюємо формування списку вакансій:
    const jobsList = jobs.map(j => {
        const jobUrl = `${clientUrl}/job/${j._id}`; // Формуємо посилання
        return `[Назва: ${j.title}, URL: ${jobUrl}, Скіли: ${j.skills?.join(", ")}, Зарплата: ${j.salary}]`;
    }).join("\n");

    // 3. Формуємо системну інструкцію
    const systemInstruction = `
        Ти — OlivaWork AI. Твоє завдання: аналізувати профіль користувача та пропонувати найкращі вакансії.
        
        ПРОФІЛЬ КОРИСТУВАЧА:
        - Ім'я: ${userData?.name || "Гість"}
        - Навички: ${userData?.skills?.join(", ") || "не вказані"}
        - Досвід: ${userData?.experience?.length > 0
            ? userData.experience.map(e => `${e.position} в ${e.company}`).join(", ")
            : "без досвіду"}
        
        ДОСТУПНІ ВАКАНСІЇ:
        ${jobsList}
        
        ІНСТРУКЦІЯ:
        - Відповідай дружньо. 
        - Якщо користувач просить підібрати вакансії, порівняй його "Навички" з "Скілами" вакансій.
        - Якщо є збіг, виділи його: "Ця вакансія підходить, бо ви знаєте **${userData?.skills?.[0] || 'необхідні технології'}**".
        - Коли пропонуєш вакансію, ОБОВ'ЯЗКОВО оформлюй назву вакансії як клікабельне посилання, використовуючи формат Markdown: [Назва вакансії](URL).
        - НЕ ПИШИ текстовий ID (наприклад, 699871...), використовуй тільки посилання.
        - Приклад: "Вас може зацікавити вакансія [Frontend Developer](http://localhost:3000/job/123)".

        `;

    try {
        const model = genAI.getGenerativeModel(
            { model: "gemini-3-flash-preview" }, // Або спробуйте "gemini-pro",
            { apiVersion: "v1beta" }
        );

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Привіт! Я OlivaWork AI. Я проаналізував ваш профіль та базу вакансій. Чим можу допомогти?" }] },
                // Перетворюємо історію з фронтенду у формат Gemini
                ...history.map(msg => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }],
                }))
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        res.json({ text: response.text() });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Помилка нейронної мережі. Спробуйте пізніше." });
    }
}));

export default router;