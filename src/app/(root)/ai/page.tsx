"use client";
import CreatorForm from "@/app/components/CreatorForm";
import React, { useState } from "react";
import axios from "axios";
import { Button, Input } from "@nextui-org/react";
// Define the form structure
interface Question {
  type: string;
  text: string;
  options: string[];
  isRequired: boolean;
}

interface FormState {
  title: string;
  description: string;
  questions: Question[];
  isFile: boolean;
}

const Page = () => {
  const [form, setForm] = useState<FormState | null>(null); // Use FormState or null
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/aicreatorform", {
        reqprompt: prompt,
      });

      if (response.data.success) {
        setForm({
          title: response.data.data.title || "Untitled Form",
          description: response.data.data.description || "Form description",
          questions: response.data.data.questions || [
            {
              type: "text",
              text: "Your question",
              options: [],
              isRequired: true,
            },
          ],
          isFile: false,
        });
      } else {
        console.error("Failed to fetch data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center pt-5 min-h-[92vh] w-full bg-slate-950 px-4">
      <div className="space-y-6 text-center w-full max-w-4xl">
        {!form && (
          <div className="flex flex-col justify-center items-center md:flex-row w-full space-y-4 md:space-y-0 md:space-x-3">
            <Input
              radius="md"
              className="max-w-xl"
              placeholder="Enter prompt..."
              size="lg"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              size="lg"
              variant="solid"
              color="primary"
              onClick={fetchData}
              isLoading={isLoading}
              className="w-full md:w-auto"
            >
              Generate
            </Button>
          </div>
        )}

        {form && (
          <CreatorForm
            title={form.title}
            description={form.description}
            questions={form.questions.map((que) => ({
              type: que.type,
              text: que.text,
              options: que.options ? [...que.options] : [],
              isRequired: que.isRequired,
            }))}
            isFile={form.isFile}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
