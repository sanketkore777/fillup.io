import React from "react";
import MyCard from "./Card";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import Sphere from "./Sphere";
import Link from "next/link";
const Templates = () => {
  return (
    <div className=" flex gap-10 flex-wrap ">
      <Link
        href="/newform"
        className=" rounded-lg cursor-pointer transition-transform transform hover:scale-105 duration-300 bg-white "
      >
        <Card radius="none" isBlurred={true} className="">
          <div>
            <CardHeader className="pb-2 pt-4 px-4 flex flex-col items-start">
              <h4 className="font-semibold text-lg text-left">Blank Form</h4>
              <small className="text-sm text-gray-600 mt-1">
                Start creating from scratch
              </small>
            </CardHeader>
            <CardBody className="overflow-hidden flex w-full justify-center items-center p-6">
              <Image
                alt="Card background"
                className="object-cover rounded-lg"
                src="/blank-icon.png"
                height={150} // Standard height for all images
              />
            </CardBody>
          </div>
        </Card>
      </Link>
      <MyCard
        server_key={"customerfeedback"}
        text="Customer Feedback"
        img={"/Customer Feedback.jpg"}
        description="Get insights from customers."
      />
      <MyCard
        server_key={"jobapplication"}
        text="Job Application"
        img={"/Job Application.jpg"}
        description="Streamline the hiring process with a customized application form."
      />
      <MyCard
        server_key={"eventregistration"}
        text="Event Registration"
        img={"/Event Registration.jpg"}
        description="Simplify event sign-ups and manage attendee information."
      />
      <MyCard
        server_key={"productsurvey"}
        text="Product Survey"
        img={"/Product Survey.jpg"}
        description="Collect valuable feedback on your products to enhance offerings."
      />
      <MyCard
        server_key={"workingfeedback"}
        text="Working Feedback"
        img={"/Working Feedback.jpg"}
        description="Monitor and improve workplace satisfaction with direct feedback."
      />
      <Sphere />
    </div> //this parent of that card fix this too
  );
};

export default Templates;
