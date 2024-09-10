"use client";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Switch,
} from "@nextui-org/react";
import CustomSnippet from "./CustomSnippet";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import NoDataPlaceholder from "./NoDataplaceholder";
import { useEffect, useState } from "react";
const FormCard = () => {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  function handleFormClick(id: String) {
    router.push(`myforms/form/${id}`);
  }

  async function handleSwitchChange(
    value: boolean,
    formId: string,
    formTitle: string
  ) {
    try {
      //   Use toast.promise to manage the promise lifecycle with automatic toast notifications
      const response = await toast.promise(
        axios.put(`/api/updateformaccept/${formId}`, {
          isAcceptingResponses: value,
        }),
        {
          loading: `Updating...`,
          success: `${formTitle} Updated!`,
          error: "Request failed!",
        }
      );
    } catch (error) {
      router.refresh();
      toast.error("Request failed.");
    }
  }

  useEffect(() => {
    async function fetchForms() {
      const response = await axios.get("/api/myforms");
      console.log(response, "RESPONSE ----------");
      if (response.data.success) {
        setForms([...response.data.data]);
      }
    }
    fetchForms();
  }, []);
  return (
    <div className="flex flex-wrap gap-4 self-center w-full">
      {forms.length ? (
        forms
          .slice() // Create a shallow copy of the array
          .reverse() // Reverse the array
          .map((form) => (
            <div
              key={form.id}
              className="w-full max-w-md border border-gray-200  cursor-pointer"
            >
              <Card
                className="flex flex-col justify-between h-full"
                radius="none"
              >
                <div onClick={() => handleFormClick(form.id)}>
                  <CardHeader className="bg-white p-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-xl font-semibold text-gray-700">
                        {form.title}
                      </div>
                      <Switch
                        color="primary"
                        defaultSelected={form.isAccepting}
                        onChange={() =>
                          handleSwitchChange(
                            !form.isAccepting,
                            form.id,
                            form.title
                          )
                        }
                        size="sm"
                      >
                        Accepting
                      </Switch>
                    </div>
                  </CardHeader>
                  <CardBody className="bg-gray-50 p-4">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-sm text-gray-600 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2, // Limit to 2 lines
                          overflow: "hidden",
                        }}
                      >
                        {form.description}
                      </span>
                      <span className="text-sm text-gray-500 italic">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardBody>
                </div>
                <CardFooter className="bg-gray-100 p-4">
                  <CustomSnippet
                    url={`${window.location.origin}/form/${form.id}`}
                  />
                </CardFooter>
              </Card>
            </div>
          ))
      ) : (
        <NoDataPlaceholder data={"Forms"} />
      )}
    </div>
  );
};

export default FormCard;
