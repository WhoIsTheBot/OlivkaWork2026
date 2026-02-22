"use client";
import React from "react";
import { Button } from "./ui/button";
import { useJobsContext } from "@/context/jobsContext";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import formatMoney from "@/utils/formatMoney";
import { Separator } from "./ui/separator";
import { XCircle, Filter } from "lucide-react";

function Filters() {
  const {
    handleFilterChange,
    filters,
    setFilters,
    minSalary,
    maxSalary,
    setMinSalary,
    setMaxSalary,
    searchJobs,
    setSearchQuery,
  } = useJobsContext();

  const clearAllFilters = () => {
  // Скидаємо чекбокси
  setFilters({
    fullTime: false,
    partTime: false,
    contract: false,
    internship: false,
    fullStack: false,
    backend: false,
    devOps: false,
    uiUx: false,
  });

  // Скидаємо пошукові запити
  setSearchQuery({ tags: "", location: "", title: "" });

  // ВАЖЛИВО: Скидаємо повзунки зарплати до стандартних значень
  setMinSalary(0);
  setMaxSalary(200000);
};

  const handleMinSalaryChange = (value: number[]) => {
    setMinSalary(value[0]);
    if (value[0] > maxSalary) setMaxSalary(value[0]);
  };

  const handleMaxSalaryChange = (value: number[]) => {
    setMaxSalary(value[0]);
    if (value[0] < minSalary) setMinSalary(value[0]);
  };

  return (
    <div className="w-full max-w-[320px] bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-8 sticky top-24 self-start">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#166434]" />
          <h2 className="text-xl font-bold text-gray-900">Фільтри</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
          onClick={() => {
            clearAllFilters();
            searchJobs();
          }}
        >
          <XCircle size={18} />
        </Button>
      </div>

      <Separator className="bg-gray-100" />

      {/* Секція: Тип роботи */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Тип зайнятості</h3>
        <div className="grid gap-3">
          {[
            { id: "fullTime", label: "Повний день" },
            { id: "partTime", label: "Часткова зайнятість" },
            { id: "contract", label: "Контракт" },
            { id: "internship", label: "Стажування" },
          ].map((item) => (
            <div key={item.id} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox
                id={item.id}
                checked={filters[item.id as keyof typeof filters]}
                onCheckedChange={() => handleFilterChange(item.id)}
                className="border-gray-300 data-[state=checked]:bg-[#166434] data-[state=checked]:border-[#166434]"
              />
              <Label
                htmlFor={item.id}
                className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer transition-colors"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Секція: Теги */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Спеціалізація</h3>
        <div className="grid gap-3">
          {[
            { id: "fullStack", label: "FullStack" },
            { id: "backend", label: "Backend" },
            { id: "devOps", label: "DevOps" },
            { id: "uiUx", label: "UI/UX" },
          ].map((item) => (
            <div key={item.id} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox
                id={item.id}
                checked={filters[item.id as keyof typeof filters]}
                onCheckedChange={() => handleFilterChange(item.id)}
                className="border-gray-300 data-[state=checked]:bg-[#166434] data-[state=checked]:border-[#166434]"
              />
              <Label
                htmlFor={item.id}
                className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer transition-colors"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-100" />

      {/* Секція: Зарплата */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Діапазон зарплати</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-gray-500">Мін.</Label>
            <span className="text-sm font-bold text-[#166434] bg-green-50 px-2 py-0.5 rounded">
              {formatMoney(minSalary, "GBP")}
            </span>
          </div>
          <Slider
            min={0}
            max={200000}
            step={500}
            value={[minSalary]}
            onValueChange={handleMinSalaryChange}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-gray-500">Макс.</Label>
            <span className="text-sm font-bold text-[#166434] bg-green-50 px-2 py-0.5 rounded">
              {formatMoney(maxSalary, "GBP")}
            </span>
          </div>
          <Slider
            min={0}
            max={200000}
            step={500}
            value={[maxSalary]}
            onValueChange={handleMaxSalaryChange}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Кнопка очищення (акцентна) */}
      <Button
        variant="outline"
        className="w-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all font-semibold py-6"
        onClick={() => {
          clearAllFilters();
          searchJobs();
        }}
      >
        Очистити все
      </Button>
    </div>
  );
}

export default Filters;