"use client";
import {
  Switch,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import "./form.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// Define default props type
type QuestionType = {
  type: string;
  text: string;
  options: string[];
  isRequired: boolean;
};

type FormProps = {
  title: string;
  description: string;
  questions: QuestionType[];
  isFile: boolean;
};

const defaultFormProps: FormProps = {
  title: "Untitled Form",
  description: "Form description",
  questions: [
    {
      type: "text",
      text: "Your question",
      options: [],
      isRequired: true,
    },
  ],
  isFile: false,
};

const CreatorForm = (props: Partial<FormProps> = defaultFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormProps>({
    title: props.title || defaultFormProps.title,
    description: props.description || defaultFormProps.description,
    questions: props.questions || [...defaultFormProps.questions],
    isFile: props.isFile || defaultFormProps.isFile,
  });

  const handleSendData = async (event) => {
    setLoading(true);
    try {
      event.preventDefault();
      const response = await axios.post("/api/creatorform", form);
      if (response.data?.success) {
        toast.success("Form created!");
        router.push("/dashboard/#recents");
      } else {
        toast.error(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occurred!");
    }
  };

  useEffect(() => {
    if (props) {
      setForm({
        title: props.title || defaultFormProps.title,
        description: props.description || defaultFormProps.description,
        questions: props.questions || [...defaultFormProps.questions],
        isFile: props.isFile || defaultFormProps.isFile,
      });
    }
  }, [props]);

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        { type: "text", text: "New Question", options: [], isRequired: true },
      ],
    });
  };

  const handleSwitchChange = (index, _bool) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === index) {
        return { ...question, isRequired: !_bool };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const handleInputChange = (index: Number, event) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === index) {
        return { ...question, text: event.target.value };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const handleTypeChange = (index, event) => {
    if (event !== "file") {
      const newQuestions = form.questions.map((question, i) => {
        if (i === index) {
          return { ...question, type: event, options: [] };
        }
        return question;
      });
      setForm({ ...form, questions: newQuestions });
    } else {
      if (form.isFile) {
        toast.error("Multiple file uploads are not allowed!");
      } else {
        const newQuestions = form.questions.map((question, i) => {
          if (i === index) {
            return { ...question, type: event, options: [] };
          }
          return question;
        });
        setForm({ ...form, questions: newQuestions, isFile: true });
      }
    }
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === qIndex) {
        const newOptions = question.options.map((option, j) => {
          if (j === oIndex) {
            return event.target.value;
          }
          return option;
        });
        return { ...question, options: newOptions };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === qIndex) {
        return {
          ...question,
          options: [...question.options, "New Option"],
        };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === qIndex) {
        return {
          ...question,
          options: question.options.filter((_, j) => j !== oIndex),
        };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };
  const deleteQuestion = (index) => {
    if (form.questions[index].type === "file") {
      setForm({
        ...form,
        questions: form.questions.filter((_, i) => i !== index),
        isFile: false,
      });
    } else {
      setForm({
        ...form,
        questions: form.questions.filter((_, i) => {
          return i !== index;
        }),
      });
    }
  };

  return (
    <div
      aria-disabled={loading}
      className="mainclass p-7 flex flex-col max-w-3xl justify-center border-1  border-[#ccc] md:w-full text-gray-800 bg-white mt-5"
    >
      <form
        aria-disabled={loading}
        action=""
        onSubmit={(event) => handleSendData(event)}
      >
        <div className="rounded-lg">
          <div className="p-1 mb-2 rounded-md">
            <div className="mb-5">
              <label className="block text-lg font-semibold mb-1.5">
                Title of form
              </label>
              <Input
                radius="none"
                type="text"
                className="w-full border-1 border-[#ccc] max-w-4xl"
                value={form.title}
                size="lg"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1.5">Description of form</label>
              <Textarea
                radius="none"
                minRows={2}
                className="max-w-4xl w-full border-1 m-0 border-[#ccc]"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="p-1 text-xs mb-2">
            {form.questions.map((question, qIndex) => (
              <div key={qIndex} className="lg:mb-4 p-4  border-1 border-[#ccc]">
                <div className="flex justify-between items-center">
                  <label className="block">Question</label>
                  <Button
                    className="bg-white"
                    color="danger"
                    variant="flat"
                    size="sm"
                    onClick={() => deleteQuestion(qIndex)}
                  >
                    Delete
                  </Button>
                </div>
                <Input
                  radius="none"
                  type="text"
                  className="w-full border-1 m-0 border-[#ccc] text-small mb-4"
                  value={question.text}
                  size="sm"
                  onChange={(e) => handleInputChange(qIndex, e)}
                />
                <div className="flex justify-end items-center h-5 m-1.5">
                  <div className="flex justify-between items-center sm:h-3 scale-[90%] lg:gap-4 sm: gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="capitalize"
                          size="sm"
                        >
                          {question.type}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        onSelectionChange={(event) =>
                          handleTypeChange(qIndex, event.anchorKey?.toString())
                        }
                      >
                        <DropdownItem key="text" value="text">
                          Text
                        </DropdownItem>
                        <DropdownItem key="number" value="number">
                          Number
                        </DropdownItem>
                        <DropdownItem key="date" value="date">
                          Date
                        </DropdownItem>
                        <DropdownItem key="time" value="time">
                          Time
                        </DropdownItem>
                        {!form.isFile && (
                          <DropdownItem key="file" value="file">
                            File
                          </DropdownItem>
                        )}
                        <DropdownItem key="radio" value="radio">
                          Radio
                        </DropdownItem>
                        <DropdownItem key="checkbox" value="checkbox">
                          Checkbox
                        </DropdownItem>
                        <DropdownItem key="select" value="select">
                          Select
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <Switch
                      size="sm"
                      isSelected={question.isRequired}
                      onChange={() =>
                        handleSwitchChange(qIndex, question.isRequired)
                      }
                    >
                      Required
                    </Switch>
                  </div>
                </div>
                <div>
                  {["radio", "checkbox", "select"].includes(question.type) && (
                    <div className="mt-4">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center mb-2">
                          <Input
                            radius="none"
                            type="text"
                            className="w-full border-1 m-0 border-[#ccc] text-small"
                            value={option}
                            size="sm"
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e)
                            }
                          />
                          <Button
                            color="danger"
                            variant="flat"
                            size="sm"
                            className="ml-2"
                            onClick={() => removeOption(qIndex, oIndex)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => addOption(qIndex)}
                        variant="ghost"
                      >
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="my-4 w-full text-right">
            <Button
              size="sm"
              type="button"
              className=" text-white bg-primary"
              onClick={addQuestion}
            >
              Add Question
            </Button>
          </div>
        </div>

        <div className="w-full flex mt-5 justify-center">
          <Button
            size="lg"
            className="bg-primary w-full text-white"
            onClick={handleSendData}
            isDisabled={loading}
            isLoading={loading}
          >
            {loading ? "Creating..." : "Create My Form"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatorForm;
