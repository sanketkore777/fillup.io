import React from "react";
import CreatorForm from "@/app/components/CreatorForm";
import axios from "axios";

// Define the type for a question
interface Question {
  type: string;
  text: string;
  options: string[];
  isRequired: boolean;
}

// Define the type for the form data
interface FormData {
  title: string;
  description: string;
  questions: Question[];
  isFile: boolean;
}

interface Params {
  params: {
    key: string;
  };
}

const Page = async ({ params }: Params) => {
  let data: FormData | null = null; // Initialize data as null or FormData

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gettemplates/${params.key}`
    );

    if (response.data.success) {
      data = {
        ...response.data.data,
        isFile: false, // Ensure isFile is included in data
      };
    } else {
      throw new Error("Something went wrong!");
    }

    return (
      <div className="bg-gray-100 min-h-[92vh] w-full flex items-center justify-center">
        {data && (
          <CreatorForm
            title={data.title}
            description={data.description}
            questions={data.questions.map((que) => ({
              type: que.type,
              text: que.text,
              options: [...que.options],
              isRequired: que.isRequired,
            }))}
            isFile={false}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching template:", error);
    return (
      <div className="flex flex-col w-full p-6">
        <h2 className="text-3xl font-semibold text-red-500">
          Failed to load templates
          <h5>{JSON.stringify(error)}</h5>
        </h2>
      </div>
    );
  }
};

export default Page;
