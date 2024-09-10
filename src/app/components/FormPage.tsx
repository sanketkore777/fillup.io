"use client";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Form = ({ id }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/userform/${id}`);
        console.log(response, "fetching");
        if (response.data.data) {
          const _formData = response.data.data;
          setFormData({
            title: _formData.title,
            description: _formData.description,
            questions: _formData.questions.map((ques, idx) => ({
              ...ques,
              answer: ques.type === "checkbox" || "radio" ? [] : "",
            })),
          });
          setIsLoading(false);
        } else {
          alert("Request failed, try refreshing page!");
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (index, value, isCheckbox, option = "") => {
    const newQuestions = [...formData.questions];
    if (isCheckbox) {
      const currentAnswers = newQuestions[index].answer || [];
      if (currentAnswers.includes(option)) {
        newQuestions[index].answer = currentAnswers.filter(
          (item) => item !== option
        );
      } else {
        newQuestions[index].answer = [...currentAnswers, option];
      }
    } else if (newQuestions[index].type === "file") {
      newQuestions[index].answer = value[0]; // Handle file upload
    } else {
      if (newQuestions[index].type === "radio") {
        newQuestions[index].answer[0] = value;
      } else {
        newQuestions[index].answer = value;
      }
    }

    const updatedFormData = { ...formData, questions: newQuestions };
    setFormData(updatedFormData);
  };

  const uploadFormResponse = async (_data) => {
    try {
      console.log(_data);
      const serverFormData = {
        title: _data?.title,
        description: _data?.description,
        questions: _data?.questions.map((question) => ({
          question: question.text,
          answer: question.answer,
          answer_type: question.type,
        })),
      };
      const response = await axios.post(
        `/api/submituserform/${id}`,
        serverFormData
      );
      console.log(response, "UPLOAD RESPONSE....");
      return response;
    } catch (error) {
      console.log(error, "ERRRRRRROR");
      toast.error(error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedQuestions = await Promise.all(
        formData.questions.map(async (que) => {
          if (que?.type === "file") {
            const _formData = new FormData();
            _formData.append("file", que.answer);
            const response = await axios.post("/api/getfile", _formData);
            console.log(response, "RESPONSE FROM HANDLESUBMIT");
            if (response.data?.url) {
              return { ...que, answer: response.data.url }; // Update answer with the file URL
            } else {
              toast.error("File upload failed! Please try again.");
              throw new Error("File upload failed");
            }
          }
          return que;
        })
      );

      return { ...formData, questions: updatedQuestions };
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong!");
      console.error("Error submitting form:", error);
      throw error; // Re-throw the error so it can be caught in mainHandleSubmit
    }
  };

  async function mainHandleSubmit(event) {
    console.log(
      formData,
      "FORMDATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );
    event.preventDefault();
    setIsLoading(true);
    try {
      const _data = await handleSubmit(); // Wait for handleSubmit to complete
      const response = await uploadFormResponse(_data); // Pass the updated data to uploadFormResponse
      console.log(response, "RESPONSE..............");
      if (response?.data?.success) {
        toast.success("Form Submited!");
        router.push("/dashboard");
      } else {
        toast.error(response?.data.message);
      }
    } catch (error) {
      console.log(error, "ERROR IN MAIN HANDLESUBMIT");
      toast.error("Something went wrong during submission!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl flex flex-col justify-center mx-auto p-4 text-gray-800 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-3">{formData.title}</h1>
      <p className="mb-3">{formData.description}</p>
      <form onSubmit={(event) => mainHandleSubmit(event)}>
        {formData.questions.map((question, index) => (
          <div key={question._id} className="mb-4">
            <label className="block mb-2 text-lg ">
              {question.text}{" "}
              {question.isRequired && <span className="text-red-500">*</span>}
            </label>
            {question.type === "text" && (
              <Input
                className="w-full border-1 border-[#ccc] max-w-4xl"
                radius="none"
                type="text"
                required={question.isRequired}
                value={question.answer}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, false)
                }
              />
            )}
            {question.type === "number" && (
              <Input
                className="w-full border-1 border-[#ccc] max-w-4xl"
                radius="none"
                type="number"
                required={question.isRequired}
                value={question.answer}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, false)
                }
              />
            )}
            {question.type === "date" && (
              <Input
                className="w-full border-1 border-[#ccc] max-w-4xl"
                radius="none"
                type="date"
                required={question.isRequired}
                value={question.answer}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, false)
                }
              />
            )}
            {question.type === "file" && (
              <Input
                className="w-full border-1 border-[#ccc] max-w-4xl"
                radius="none"
                type="file"
                required={question.isRequired}
                onChange={(e) =>
                  handleInputChange(index, e.target.files, false)
                }
              />
            )}
            {question.type === "radio" && (
              <div className="">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="mb-2 ">
                    <label className="inline-flex items-center">
                      <Input
                        className=" form-radio w-full border-1 border-[#ccc] max-w-4xl"
                        radius="none"
                        type="radio"
                        name={`question_${index}`}
                        value={option}
                        checked={question.answer[0] === option}
                        required={question.isRequired}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            e.target.value,
                            false,
                            option
                          )
                        }
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
            {question.type === "checkbox" && (
              <div className="">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="mb-2">
                    <label className="inline-flex items-center">
                      <Input
                        className="w-10 border-1 border-[#ccc] "
                        type="checkbox"
                        radius="none"
                        name={`question_${index}`}
                        value={option}
                        checked={question.answer.includes(option)}
                        onChange={() =>
                          handleInputChange(index, null, true, option)
                        }
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <Button
          type="submit"
          variant="shadow"
          className="w-full p-2 bg-blue-500 text-white font-semibold rounded"
          isLoading={isLoading}
        >
          {isLoading ? "Hang tight" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Form;
