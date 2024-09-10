"use client";
import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type Props = {
  text: string;
  img: string;
  description: string;
  server_key: string;
};

export default function MyCard(props: Props) {
  const router = useRouter();
  function handleDefaultForm(serverKey: string) {
    console.log("Rendering...");
    router.push(`/newform/${serverKey}`);
  }

  return (
    <div className="flex flex-wrap max-w-xs justify-center rounded-lg cursor-pointer transition-transform transform hover:scale-105 duration-300 bg-white">
      <Card radius="none" isBlurred={true} className="">
        <div onClick={() => handleDefaultForm(props.server_key)}>
          <CardHeader className="pb-0 pt-3 px-4 flex flex-col items-start">
            <h4 className="font-semibold text-lg text-gray-800">
              {props.text}
            </h4>
            <small className="text-sm text-gray-500 mt-1">
              {props.description}
            </small>
          </CardHeader>
          <CardBody className="overflow-hidden flex justify-center items-center py-3">
            <Image
              alt="Card background"
              className="object-cover rounded-lg shadow-inner"
              src={props.img}
              width={230}
              height={150}
            />
          </CardBody>
        </div>
      </Card>
    </div> //fix this card and it should and the card shoud not change as per the image
  );
}
