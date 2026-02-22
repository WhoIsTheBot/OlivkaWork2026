"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown"; // Імпортуємо для гарного тексту
import Header from "@/Components/Header";
import { Send, Bot, User, Sparkles, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";

function Page() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Привіт! Я твій AI помічник **OlivaWork**. Чим можу допомогти з пошуком роботи сьогодні?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Автопрокрутка до останнього повідомлення
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            // У вашій функції handleSend змініть fetch:
            const response = await fetch("http://localhost:8000/api/v1/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ОБО'ЯЗКОВО для передачі сесії/кук
                body: JSON.stringify({
                    message: currentInput,
                    history: messages.filter((_, i) => i !== 0)
                }),
            });

            if (!response.ok) throw new Error("Помилка мережі");
            const data = await response.json();

            if (data.text) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "⚠️ **Помилка з'єднання.** Перевірте, чи запущений ваш бекенд на порту 8000."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: "assistant", content: "Діалог очищено. Готовий до нових запитань! 😊" }]);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden text-slate-900">
            <Header />

            <main className="flex-1 flex overflow-hidden container mx-auto px-4 py-4 gap-6">

                {/* Sidebar */}
                <aside className="hidden md:flex w-72 flex-col gap-4 overflow-hidden">
                    <Button
                        onClick={clearChat}
                        className="w-full bg-[#166434] hover:bg-[#114d28] gap-2 py-6 rounded-2xl shadow-md shrink-0 transition-transform active:scale-95"
                    >
                        <Plus size={18} /> Новий діалог
                    </Button>

                    <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm overflow-y-auto">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">Швидкий старт</h3>
                        <div className="space-y-2">
                            {["Підбери вакансії для мене", "Як покращити моє резюме?", "Вакансії для Junior"].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setInput(item);
                                        // Можна відразу викликати handleSend() після setInput
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-[#166434] rounded-xl truncate transition-colors border border-transparent hover:border-emerald-100"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Chat Window */}
                <section className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden min-w-0">

                    {/* Chat Header */}
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-[#166434] shadow-inner">
                                <Bot size={28} />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-slate-800">OlivaWork AI</h2>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-400 animate-pulse' : 'bg-emerald-500'}`}></span>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-tight">
                                        {isLoading ? 'Генерує відповідь...' : 'В мережі'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={clearChat} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 size={20} />
                        </Button>
                    </div>

                    {/* Messages List */}
                    <ScrollArea className="flex-1 overflow-y-auto">
                        <div className="max-w-3xl mx-auto py-10 px-6 space-y-8">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "animate-in fade-in slide-in-from-left-4 duration-500"}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === "assistant" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                                        }`}>
                                        {msg.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
                                    </div>

                                    <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-base leading-relaxed shadow-sm border ${msg.role === "assistant"
                                        ? "bg-slate-50 text-slate-800 rounded-tl-none border-slate-100"
                                        : "bg-[#166434] text-white rounded-tr-none border-[#114d28]"
                                        }`}>
                                        {/* Рендеринг тексту з підтримкою списків та заголовків */}
                                        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-[#166434] prose-li:marker:text-emerald-500">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                                    h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
                                                    ul: ({ children }) => <ul className="list-disc ml-5 space-y-1 mb-3">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal ml-5 space-y-1 mb-3">{children}</ol>,
                                                    li: ({ children }) => <li className="pl-1">{children}</li>,
                                                    strong: ({ children }) => <span className="font-bold text-emerald-900">{children}</span>,
                                                    hr: () => <hr className="my-6 border-slate-200" />,
                                                    a: ({ children, href }) => (
                                                        <a
                                                            href={href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-emerald-600 font-bold underline hover:text-emerald-700 transition-colors"
                                                        >
                                                            {children}
                                                        </a>
                                                    ),
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-4 animate-pulse">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#166434] flex items-center justify-center">
                                        <Bot size={20} />
                                    </div>
                                    <div className="bg-slate-50 px-6 py-4 rounded-[1.5rem] rounded-tl-none border border-slate-100">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} className="h-4" />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-slate-100 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                        <div className="max-w-3xl mx-auto relative group">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                disabled={isLoading}
                                placeholder={isLoading ? "Зачекайте, я формую відповідь..." : "Напишіть ваше запитання тут..."}
                                className="pr-16 py-8 rounded-[1.5rem] border-slate-200 focus-visible:ring-[#166434] focus-visible:border-transparent shadow-inner text-base bg-slate-50/50 transition-all focus:bg-white"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                size="icon"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#166434] hover:bg-[#114d28] w-12 h-12 rounded-2xl transition-all shadow-lg active:scale-90"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={22} />}
                            </Button>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <Sparkles size={12} className="text-emerald-500" />
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                                Потужність Gemini 1.5 Flash • OlivaWork 2026
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Page;