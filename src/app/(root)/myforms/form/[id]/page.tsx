"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import toast from "react-hot-toast";
import NotFound from "@/app/not-found";
import Link from "next/link";
import NoDataPlaceholder from "@/app/components/NoDataplaceholder";

const Page = ({ params }: { params: { id: String } }) => {
  const [formResponse, setFormResponse] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [sheet, setSheet] = useState(null);
  useEffect(() => {
    async function downloadExcel() {
      try {
        const response = await axios.post(
          `/api/getresponsesinsheet/${params.id}`
        );
        if (response.data.success) {
          return setSheet(response.data.url);
        } else {
          toast.error(response.data.message);
          console.log(response, "RESPONSE FROM BACKEND ");
        }
      } catch (error) {
        console.error("Failed to download the file", error);
      }
    }
    downloadExcel();

    async function fetchData() {
      const response = await axios.get(`/api/getresponses/${params.id}`, {
        data: pageNo,
      });
      if (response.data.success) {
        console.log(
          response,
          "Response........................................................"
        );
        setFormResponse(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    }
    fetchData();
  }, [pageNo, params.id]);

  if (formResponse.length) {
    return (
      <div className="mainclass w-full min-h-screen bg-[f8f8ff] flex flex-col items-center py-8 px-4">
        <h2 className="text-  xl font-semibold mb-4 text-slate-800 drop-shadow-lg">
          {formResponse[0]?.title}
        </h2>
        <p className="mb-6 text-slate-600 text-opacity-90">
          {formResponse[0]?.description}
        </p>
        <Button
          variant="flat"
          color="primary"
          className="mb-6  hover:bg-blue-100 transition duration-300"
        >
          {sheet ? (
            <Link href={sheet}>Download Responses as Excel</Link>
          ) : (
            "Loading..."
          )}
        </Button>
        {formResponse.map((form) => (
          <div
            key={form._id}
            className="w-full lg:max-w-[560px] p-6 mb-8 bg-white shadow-2xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            {form.questions.map((question, index) => (
              <div key={question._id} className="mb-4">
                <p className=" text-gray-700 text-lg">
                  {index + 1}. {question.question}
                </p>
                {question.answer_type !== "file" ? (
                  <Input
                    size="md"
                    readOnly
                    className="text-lg italic w-full rounded-none text-gray-900 border-gray-300 focus:border-blue-500 transition duration-200"
                    value={
                      question.answer_type === "checkbox"
                        ? question.answer.split(",").join(", ")
                        : question.answer
                    }
                  />
                ) : (
                  <Link
                    href={question.answer}
                    className="mt-2 inline-block rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition duration-300"
                  >
                    Open File
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="min-h-[92vh] bg-gray-100 flex justify-center items-center">
        <NoDataPlaceholder data={"Responses"} />
      </div>
    );
  }
};

export default Page;
