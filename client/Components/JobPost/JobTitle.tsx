"use client";
import { useGlobalContext } from "@/context/globalContext";
import { Separator } from "@/Components/ui/separator";
import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

interface EmployementTypeProps {
  "Повна зайнятість": string;
  "Часткова зайнятість": string;
  Контракт: boolean;
  Стажування: boolean;
  Тимчасова: boolean;
}

function JobTitle() {
  const { handleTitleChange, jobTitle, setActiveEmploymentTypes } =
    useGlobalContext();

  const [employmentTypes, setEmploymentTypes] =
    React.useState<EmployementTypeProps>({
      "Повна зайнятість": "",
      "Часткова зайнятість": "",
      Контракт: false,
      Стажування: false,
      Тимчасова: false,
    });

  const handleEmploymentTypeChange = (type: keyof EmployementTypeProps) => {
    setEmploymentTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  useEffect(() => {
    const selectedTypes = Object.keys(employmentTypes).filter((type) => {
      return employmentTypes[type as keyof EmployementTypeProps];
    });

    setActiveEmploymentTypes(selectedTypes);
  }, [employmentTypes, setActiveEmploymentTypes]);

  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Назва вакансії</h3>
          <Label
            htmlFor="jobTitle"
            className="text-sm text-muted-foreground mt-2"
          >
            Вкажіть точну назву посади.
          </Label>
        </div>
        <Input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={handleTitleChange}
          className="flex-1 w-full mt-2"
          placeholder="Введіть назву вакансії"
        />
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Тип зайнятості</h3>
          <Label
            htmlFor="employmentType"
            className="text-sm text-muted-foreground mt-2"
          >
            Оберіть тип зайнятості для цієї вакансії.
          </Label>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {Object.entries(employmentTypes).map(([type, checked]) => (
            <div
              key={type}
              className="flex items-center space-x-2 border border-input rounded-md p-2"
            >
              <Checkbox
                id={type}
                checked={checked}
                onCheckedChange={() => {
                  handleEmploymentTypeChange(
                    type as keyof EmployementTypeProps
                  );
                }}
              />
              <Label
                htmlFor={type}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobTitle;
