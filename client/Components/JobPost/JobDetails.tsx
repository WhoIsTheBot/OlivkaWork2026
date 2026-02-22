"use client";
import { useGlobalContext } from "@/context/globalContext";
import { Label } from "../ui/label";
import "react-quill-new/dist/quill.snow.css";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

function MyEditor() {
  const { setJobDescription, jobDescription } = useGlobalContext();

  return (
    <ReactQuill
      value={jobDescription}
      onChange={setJobDescription}
      style={{
        minHeight: "400px",
        maxHeight: "900px",
      }}
      modules={{
        toolbar: true,
      }}
      className="custom-quill-editor"
    />
  );
}

function JobDetails() {
  const {
    handleSalaryChange,
    salary,
    setSalaryType,
    setNegotiable,
    negotiable,
  } = useGlobalContext();
  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-black font-bold">Опис вакансії</h3>
          <Label htmlFor="jobDescription" className="text-gray-500 mt-2">
            Опишіть детально обов’язки та вимоги до вакансії.
          </Label>
        </div>
        <div className="flex-1">
          <MyEditor />
        </div>
      </div>

      <Separator className="my-2" />

      <div className="relative grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-black font-bold">Зарплата</h3>
          <Label htmlFor="salary" className="text-gray-500 mt-2">
            Вкажіть діапазон зарплати для цієї вакансії.
          </Label>
        </div>

        <div>
          <Input
            type="number"
            id="salary"
            placeholder="Введіть зарплату"
            value={salary}
            onChange={handleSalaryChange}
            className="mt-2"
          />

          <div className="flex gap-2 mt-2 justify-between">
            <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-2">
              <Checkbox id="negotiable" />
              <Label htmlFor="negotiable" className="text-gray-500">
                Договірна
              </Label>
            </div>
            <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-2">
              <Checkbox
                id="hideSalary"
                checked={negotiable}
                onCheckedChange={setNegotiable}
              />
              <Label htmlFor="hideSalary" className="text-gray-500">
                Приховати зарплату
              </Label>
            </div>

            <div>
              <Select onValueChange={setSalaryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть тип" />
                </SelectTrigger>
                <SelectContent className="w-30 mt-2">
                  <SelectItem value="Yearly">На рік</SelectItem>
                  <SelectItem value="Month">На місяць</SelectItem>
                  <SelectItem value="Hour">За годину</SelectItem>
                  <SelectItem value="Fixed">Фіксована</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
