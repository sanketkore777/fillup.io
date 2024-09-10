import React from "react";
import Templates from "@/app/components/Templates";
import FormCard from "./FormCard";

const Dashboard = async () => {
  return (
    <div className="mainclass flex flex-col w-full p-3 px-12 gap-3 min-h-screen bg-gray-100">
      <h2 className="text-4xl mb-2 capitalize w-full text-start text-gray-800 font-semibold mt-2 ">
        Templates
      </h2>
      <div className="flex w-full justify-center items-center">
        <Templates />
      </div>
      <h2
        id="recents"
        className="text-4xl py-4 capitalize w-full text-start text-gray-800 font-semibold mt-2 "
      >
        Recents
      </h2>
      <div className="flex w-full justify-center items-center">
        <FormCard />
      </div>
    </div>
  );
};

export default Dashboard;
